import qs from "qs";
import { Media } from "@strapiTypes/schemas-to-ts/Media";
import axios from "axios";
import { Invoice } from "@apiTypes/invoice/content-types/invoice/invoice";
import { Item, Type } from "@apiTypes/item/content-types/item/item";

type ImageSize = "thumbnail" | "small" | "medium" | "large";
/**
 * Get a specific image URL by size, will return the closest size if unavailable.
 * @param {Media} image - The image.
 * @param {"thumbnail" | "xsmall" | "small" | "medium" | "large" | "xlarge"} [size="medium"] - The size, default medium.
 * @returns {string} The URL of the selected image.
 */
export function getImageURLBySize(image: Media, size: ImageSize = "medium"): string | undefined {
  const formats: ImageSize[] = ["thumbnail", "small", "medium", "large"];

  const requestedImage = image.attributes.formats[size]?.url;
  if (requestedImage) return process.env.NEXT_PUBLIC_API_URL + requestedImage;

  let smaller = formats.indexOf(size) - 1;
  let larger = formats.indexOf(size) + 1;

  for (; formats[smaller] || formats[larger]; smaller--, larger++) {
    const smallerFormat: ImageSize = formats[smaller];
    const largerFormat: ImageSize = formats[larger];

    if (image.attributes.formats[smallerFormat]) {
      return process.env.NEXT_PUBLIC_API_URL + image.attributes.formats[smallerFormat].url;
    } else if (image.attributes.formats[largerFormat]) {
      return process.env.NEXT_PUBLIC_API_URL + image.attributes.formats[largerFormat].url;
    }
  }
}

export function getStrapiURL(path = "") {
  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337"}${path}`;
}

/**
 * Server only.
 */
export async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
  try {
    const { requestUrl, mergedOptions } = buildStrapiRequest(path, urlParamsObject, options);

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(`Please check if your server is running and you set all the required tokens.`);
  }
}

export async function fetchAPIClient(requestUrl: string, mergedOptions = {}) {
  try {
    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(`Please check if your server is running and you set all the required tokens.`);
  }
}

export async function postAPIClient(requestUrl: string, mergedOptions: any = {}) {
  try {
    // Trigger API call
    const { headers, ...axiosOptions } = mergedOptions;
    const response = await axios.post(requestUrl, axiosOptions, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Please check if your server is running and you set all the required tokens.`);
  }
}

export async function putAPIClient(requestUrl: string, mergedOptions: any = {}) {
  try {
    // Trigger API call
    const { headers, ...axiosOptions } = mergedOptions;
    const response = await axios.put(requestUrl, axiosOptions, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Please check if your server is running and you set all the required tokens.`);
  }
}

type InvoiceCost = { subtotal: number; gst: number; qst: number; total: number };

export type InvoiceWithItems = Invoice & {
  items: ItemWithQuantity[];
  cost: InvoiceCost;
};

export type ItemWithQuantity = Item & {
  quantity: number;
};

export function getInvoiceCost(invoice: InvoiceWithItems): InvoiceCost {
  const gstTax = 0.05;
  const qstTax = 0.0975;
  const isInvoice = invoice.attributes.memoOrInvoice === "invoice";
  let subtotal: number, qst: number, gst: number;
  subtotal = invoice.items.reduce((accumulator, currentItem) => {
    // Adding the line total of the current item to the accumulator
    if (isInvoice) {
      return accumulator + (currentItem.quantity ?? 0) * (currentItem?.attributes.unitPrice ?? 0);
    } else {
      return accumulator - (currentItem.quantity ?? 0) * (currentItem?.attributes.unitPrice ?? 0);
    }
  }, 0);
  qst = invoice.items.reduce((accumulator, currentItem) => {
    // Adding the line total of the current item to the accumulator
    if (currentItem.attributes.type == Type.Sales) {
      if (isInvoice) {
        return accumulator + (currentItem.quantity ?? 0) * (currentItem?.attributes.unitPrice ?? 0) * qstTax;
      } else {
        return accumulator - (currentItem.quantity ?? 0) * (currentItem?.attributes.unitPrice ?? 0) * qstTax;
      }
    }
    return accumulator;
  }, 0);
  gst = invoice.items.reduce((accumulator, currentItem) => {
    // Adding the line total of the current item to the accumulator
    if (currentItem.attributes.type == Type.Sales) {
      if (isInvoice) {
        return accumulator + (currentItem.quantity ?? 0) * (currentItem?.attributes.unitPrice ?? 0) * gstTax;
      } else {
        return accumulator - (currentItem.quantity ?? 0) * (currentItem?.attributes.unitPrice ?? 0) * gstTax;
      }
    }
    return accumulator;
  }, 0);
  return {
    subtotal: subtotal,
    gst: gst,
    qst: qst,
    total: subtotal + gst + qst,
  };
}

export async function getInvoiceData(
  isInvoice: boolean,
  id: number | undefined,
  clientId: number | undefined = undefined,
): Promise<InvoiceWithItems[]> {
  const { requestUrl, mergedOptions } = buildStrapiRequest(`/${isInvoice ? "invoices" : "memos"}`, {
    populate: "Items,client,supplier",
  });
  const result = await fetchAPIClient(requestUrl, mergedOptions);
  let invoiceReturn: InvoiceWithItems[] = [];

  // if (id !== undefined) {
  //   invoiceReturn = result.data.filter((i: any) => i.id == id);
  // } else {
  //   invoiceReturn = result.data;
  // }

  for (const invoice of result.data) {
    console.log("invoice", invoice);
    const { requestUrl, mergedOptions } = buildStrapiRequest("/items", {
      filters: {
        id: { $eq: invoice?.attributes.Items.map((item: { quantity: number; itemId: number }) => item.itemId) },
      },
    });
    let result2 = await fetchAPIClient(requestUrl, mergedOptions);
    result2 = result2.data.map((item: any) => {
      const quantity = invoice?.attributes.Items.find((i: { quantity: number; itemId: number }) => {
        return i.itemId === item.id;
      }).quantity;
      return { ...item, quantity: quantity };
    });
    delete invoice.attributes.Items;
    invoice.items = result2;
    invoice.cost = getInvoiceCost(invoice);
    invoiceReturn = invoiceReturn.concat({ ...invoice });
    console.log(invoiceReturn);
  }

  if (id !== undefined) {
    invoiceReturn = invoiceReturn.filter((invoice) => invoice.id === id);
  }

  if (clientId !== undefined) {
    invoiceReturn = invoiceReturn.filter((invoice) => {
      if (invoice.attributes.client?.data) {
        console.log("filtering client", invoice.attributes.client?.data);
        return invoice.attributes.client?.data.id === clientId;
      } else if (invoice.attributes.supplier?.data) {
        console.log("filtering supplier", invoice.attributes.supplier?.data, clientId);
        return invoice.attributes.supplier?.data.id === clientId;
      }
    });
  }

  return invoiceReturn;
}

/**
 * Client only.
 */
export function buildStrapiRequest(path: string, urlParamsObject = {}, options = {}) {
  // Merge default and user options
  const mergedOptions = {
    next: { revalidate: 10 },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN ? process.env.API_TOKEN : process.env.NEXT_PUBLIC_API_TOKEN}`,
    },
    ...options,
  };

  // Build request URL
  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${getStrapiURL(`/api${path}${queryString ? `?${queryString}` : ""}`)}`;

  return { requestUrl, mergedOptions };
}
