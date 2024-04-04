"use client";

import { useEffect, useState } from "react";
import { Button } from "../../_components/shadcn/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../_components/shadcn/table";

import { useSearchParams } from "next/navigation";
import { InvoiceWithItems, getInvoiceCost, getInvoiceData } from "../../_utils/strapiApi";
import { Client } from "@apiTypes/client/content-types/client/client";

export default function ViewInvoice() {
  const [invoice, setInvoice] = useState<InvoiceWithItems>();
  const [client, setClient] = useState<Client>();

  // /receivable/view-invoice?id=1&mode=invoice
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const mode = searchParams.get("mode");

  useEffect(() => {
    const fetchData = async () => {
      const result = await getInvoiceData(mode === "invoice" ? true : false, parseInt(id ?? ""));

      setInvoice(result[0]);
      setClient(result[0].attributes.client?.data);
    };

    fetchData();
  }, []);

  if (!invoice) {
    return (
      <div>
        <h1 className="mb-12 mt-8 text-center text-3xl font-gigabold">
          {mode === "invoice" ? "Invoice" : "Memo"} #{id}
        </h1>
        <p>Loading...</p>
      </div>
    );
  }

  const { total, subtotal, gst, qst } = getInvoiceCost(invoice);

  return (
    <div>
      <h1 className="mb-12 mt-8 text-center text-3xl font-gigabold">
        {mode === "invoice" ? "Invoice" : "Memo"} #{id}
      </h1>

      <h1 className="mb-8 text-center text-lg font-gigabold">Supplier Info:</h1>
      <div className="mb-16 flex w-full items-center">
        <div className="flex w-full flex-col gap-2 font-gigabold">
          <div className="flex gap-4">
            <div className="w-1/2">Client ID:</div>
            <div className="w-full rounded-lg bg-white p-2">{client?.id}</div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">Client Name:</div>
            <div className="w-full rounded-lg bg-white p-2">{client?.attributes.name}</div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">Tel #:</div>
            <div className="w-full rounded-lg bg-white p-2">{client?.attributes.phone}</div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">Email:</div>
            <div className="w-full rounded-lg bg-white p-2">{client?.attributes.email}</div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">Address:</div>
            <div className="w-full rounded-lg bg-white p-2">{client?.attributes.address}</div>
          </div>
        </div>
      </div>

      <h1 className="mb-8 text-center text-lg font-gigabold">Items:</h1>
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
          {invoice?.items.map((itemComponent) => {
            return (
              <TableRow key={itemComponent?.id}>
                <TableCell className="font-medium">{itemComponent?.id}</TableCell>
                <TableCell>{itemComponent?.attributes.name}</TableCell>
                <TableCell>{itemComponent?.attributes.description}</TableCell>
                <TableCell>${(itemComponent?.attributes.unitPrice ?? 0).toFixed(2)}</TableCell>
                <TableCell>{itemComponent.quantity}</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">
                  ${((itemComponent.quantity ?? 0) * (itemComponent?.attributes.unitPrice ?? 0)).toFixed(2)}
                </TableCell>
              </TableRow>
            );
          })}
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
            <TableCell className="text-right">${total.toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Button
        className="ml-auto mt-10 print:hidden"
        variant="hightlighted"
        onClick={() => {
          window.print();
        }}
      >
        {mode === "invoice" ? "Print Invoice" : "Print Memo"}
      </Button>
    </div>
  );
}
