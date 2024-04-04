"use client";

import { useEffect, useState } from "react";
import { Button } from "../_components/shadcn/button";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../_components/shadcn/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../_components/shadcn/input";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/app/_components/shadcn/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/app/_components/shadcn/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/app/_components/shadcn/popover";
import { cn } from "../_utils/shadUtils";
import { Check, ChevronsUpDown } from "lucide-react";
import ProfileSearchDialog from "../_components/dialogs/payable/ProfileSearchDialog";
import { Calendar } from "../_components/shadcn/calendar";
import { format, sub } from "date-fns";

import { useToast } from "@/src/app/_components/shadcn/use-toast";
import { buildStrapiRequest, fetchAPIClient, postAPIClient } from "../_utils/strapiApi";
import { Client } from "@apiTypes/client/content-types/client/client";
import { Item, Type } from "@apiTypes/item/content-types/item/item";

export default function CreateInvoiceOrMemo({ mode }: { mode: "invoice" | "memo" }) {
  const { toast } = useToast();

  type InvoiceItem = Item & {
    quantity: number;
  };

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const [clientError, setClientError] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean>(false);
  const [configuration, setConfiguration] = useState<any>();

  useEffect(() => {
    fetch("/api/configuration", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setConfiguration(data));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { requestUrl, mergedOptions } = buildStrapiRequest("/items");
        const result = await fetchAPIClient(requestUrl, mergedOptions);
        if (result?.data?.length) setAvailableItems(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    return undefined;
  }, []);

  useEffect(() => {
    if (selectedClient) {
      setClientError(false);
    }
  }, [selectedClient]);

  useEffect(() => {
    if (selectedDate) {
      setDateError(false);
    }
  }, [selectedDate]);

  const itemNameToId = availableItems.map((item) => {
    return {
      label: item.attributes.name,
      value: item.id.toString(),
    };
  });

  const formSchema = z.object({
    quantity: z.coerce.number(),
    itemId: z.string({
      required_error: "Please select an item.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    let item = availableItems.find((item) => item.id.toString() === values.itemId);
    if (item) {
      const existing = invoiceItems.find((item) => item.id.toString() === values.itemId);
      if (existing) {
        existing.quantity += values.quantity;
        setInvoiceItems(invoiceItems);
      } else {
        setInvoiceItems([...invoiceItems, { ...item, quantity: values.quantity }]);
      }
    }
  }

  const subtotal = invoiceItems.reduce((accumulator, currentItem) => {
    // Adding the line total of the current item to the accumulator
    return accumulator + currentItem.quantity * (currentItem.attributes.unitPrice ?? 0);
  }, 0);

  const gstTax = configuration?.gstRate / 10000;
  const qstTax = configuration?.qstRate / 10000;

  const qst = invoiceItems.reduce((accumulator, currentItem) => {
    // Adding the line total of the current item to the accumulator
    if (currentItem.attributes.type == Type.Sales) {
      return accumulator + (currentItem.quantity ?? 0) * (currentItem?.attributes.unitPrice ?? 0) * qstTax;
    }
    return accumulator;
  }, 0);
  const gst = invoiceItems.reduce((accumulator, currentItem) => {
    // Adding the line total of the current item to the accumulator
    if (currentItem.attributes.type == Type.Sales) {
      return accumulator + (currentItem.quantity ?? 0) * (currentItem?.attributes.unitPrice ?? 0) * gstTax;
    }
    return accumulator;
  }, 0);

  return (
    <div>
      <h1 className="mb-12 mt-8 text-center text-3xl font-gigabold">
        {mode === "invoice" ? "Create an Invoice" : "Create a Memo"}
      </h1>

      <h1 className="mb-2 text-center text-lg font-gigabold">Select a Supplier:</h1>
      <div className="mb-16 w-full rounded-lg bg-white p-8">
        <div className="flex w-full items-center justify-evenly">
          <p className="font-gigabold">Selected Supplier:</p>
          <div>
            <div>ID: {selectedClient?.id ?? "N/A"}</div>
            <div>Name: {selectedClient?.attributes.name ?? "N/A"}</div>
            <div>Email: {selectedClient?.attributes.email ?? "N/A"}</div>
          </div>
          <div>
            <div>Address: {selectedClient?.attributes.address ?? "N/A"}</div>
            <div>Phone: {selectedClient?.attributes.phone ?? "N/A"}</div>
            <div className="h-6"></div>
          </div>
          <ProfileSearchDialog setSelectedClient={setSelectedClient}></ProfileSearchDialog>
        </div>
        {clientError && <p className="mt-6 text-center font-bold text-red-500">You must select a client.</p>}
      </div>

      <h1 className="mb-2 text-center text-lg font-gigabold">Select a Date:</h1>
      <div className="mx-auto mb-16 w-fit rounded-lg bg-white p-8">
        <div className="flex w-full justify-evenly">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"hightlighted"}
                className={cn("w-[240px] pl-3 text-left font-normal", !selectedDate && "text-muted-foreground")}
              >
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        {dateError && <p className="mt-6 text-center font-bold text-red-500">You must select a date.</p>}
      </div>

      <h1 className="mb-2 text-center text-lg font-gigabold">Add an Item:</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto mb-20 space-y-8 rounded-lg bg-white">
          <div className="flex min-h-28 items-center justify-between px-8">
            <FormField
              control={form.control}
              name="itemId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Item</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="hightlighted"
                          role="combobox"
                          className={cn("w-[200px] justify-between", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? itemNameToId.find((item) => item.value === field.value)?.label : "Select item"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search item..." />
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {itemNameToId.map((item) => (
                              <CommandItem
                                value={item.label}
                                key={item.value}
                                onSelect={() => {
                                  form.setValue("itemId", item.value);
                                }}
                              >
                                <Check className={cn("mr-2 h-4 w-4", item.value === field.value ? "opacity-100" : "opacity-0")} />
                                {item.label}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <Input type="number" placeholder="Quantity..." {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <br></br>
            <div className="flex w-fit flex-col items-center">
              <Button type="submit" size="sm" variant="hightlighted" className="w-full">
                Add Item
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Item #</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead className="w-[100px]">Qty</TableHead>
            <TableHead className="w-[100px]"></TableHead>
            <TableHead className="text-right">Line Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoiceItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{item.attributes.name}</TableCell>
              <TableCell>{item.attributes.description}</TableCell>
              <TableCell>${(item.attributes.unitPrice ?? 0).toFixed(2)}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                <div
                  className="flex cursor-pointer"
                  onClick={() => {
                    setInvoiceItems(
                      invoiceItems.filter((i) => {
                        return i.id != item.id;
                      }),
                    );
                  }}
                >
                  <div className="icon-[material-symbols--close] h-5 w-5 text-red-600"></div>
                  Remove
                </div>
              </TableCell>
              <TableCell className="text-right">${(item.quantity * (item.attributes.unitPrice ?? 0)).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>Subtotal</TableCell>
            <TableCell className="text-right">${subtotal.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={6}>GST</TableCell>
            <TableCell className="text-right">${gst.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={6}>QST</TableCell>
            <TableCell className="text-right">${qst.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={6}>Total</TableCell>
            <TableCell className="text-right">${(subtotal + qst + gst).toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Button
        className="ml-auto mt-10"
        variant="hightlighted"
        onClick={async () => {
          if (!selectedClient) {
            setClientError(true);
            return;
          }

          if (!selectedDate) {
            setDateError(true);
            return;
          }

          const { requestUrl, mergedOptions } = buildStrapiRequest(
            "/" + (mode === "invoice" ? "invoices" : "memos"),
            {},
            {
              data: {
                date: selectedDate.toISOString().split("T")[0],
                supplier: selectedClient.id,
                amountPaid: 0,
                Items: [
                  ...invoiceItems.map((item) => {
                    return {
                      itemId: item.id,
                      quantity: item.quantity,
                    };
                  }),
                ],
              },
            },
          );

          const result = await postAPIClient(requestUrl, mergedOptions);

          if (result) {
            toast({
              className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
              title:
                mode === "invoice"
                  ? "Successfully created invoice and saved to database."
                  : "Successfully created memo and saved to database.",
              variant: "green",
            });
            setSelectedClient(undefined);
            setSelectedDate(undefined);
            setInvoiceItems([]);
          }
        }}
      >
        {mode === "invoice" ? "Submit Invoice" : "Submit Memo"}
      </Button>
    </div>
  );
}
