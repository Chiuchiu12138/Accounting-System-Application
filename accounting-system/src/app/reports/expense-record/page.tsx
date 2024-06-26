"use client";

import { useSearchParams } from "next/navigation";

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
import { Input } from "../../_components/shadcn/input";
import { Button } from "../../_components/shadcn/button";
import { useState, useEffect, memo, useContext } from "react";
import { InvoiceWithItems, getInvoiceData } from "../../_utils/strapiApi";
import { AuthContext } from "../../_providers/AuthProvider";

export default function SalesRecord() {
  // ?showPaid=true&from=2024-04-03T07:00:00.000Z&to=2024-04-18T07:00:00.000Z
  const searchParams = useSearchParams();

  const showPaid = JSON.parse(searchParams.get("showPaid") ?? "false");

  const from: Date = new Date(decodeURIComponent(searchParams.get("from") ?? new Date().toISOString()));
  const to: Date = new Date(decodeURIComponent(searchParams.get("to") ?? new Date().toISOString()));

  const dayBeforeFrom = new Date(from.getTime());
  dayBeforeFrom.setDate(from.getDate() - 1);

  const dayAfterTo = new Date(to.getTime());
  dayAfterTo.setDate(to.getDate() + 1);

  const [invoiceData, setInvoiceData] = useState<InvoiceWithItems[]>([]);
  // const [memoData, setMemoData] = useState<InvoiceWithItems[]>([]);

  const { authenticatedUser } = useContext(AuthContext);

  useEffect(() => {
    async function fetchData() {
      let invoices = await getInvoiceData(true, undefined, undefined, authenticatedUser?.userInfo.id ?? -1);
      invoices = invoices.filter((invoice) => invoice.attributes.supplier?.data);

      let memos = await getInvoiceData(false, undefined, undefined, authenticatedUser?.userInfo.id ?? -1);
      memos = memos.filter((memo) => memo.attributes.supplier?.data);
      // setMemoData(memos);

      setInvoiceData(invoices.concat(memos));
    }
    fetchData();
  }, []);

  let filteredInvoices = invoiceData;

  if (!showPaid) {
    //remove invoices that are paid for
    filteredInvoices = invoiceData.filter((invoice) => {
      return invoice.attributes.amountPaid !== Math.abs(invoice.cost.total);
    });
  }

  //remove invoices that do not fall in the selected date range
  filteredInvoices = filteredInvoices.filter((invoice) => {
    const asDate = new Date(invoice.attributes.date as unknown as string);
    if (!invoice.attributes.date) return true;
    return asDate >= dayBeforeFrom && asDate <= dayAfterTo;
  });

  return (
    <div>
      <h1 className="mb-4 mt-8 text-center text-3xl font-gigabold">{showPaid ? "Expense Report" : "Account Payable Report"}</h1>
      <h1 className="mb-12 text-center text-xl font-gigabold">
        {from.toDateString()} - {to.toDateString()}
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Supplier ID</TableHead>
            <TableHead>Supplier Name</TableHead>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Sales Total</TableHead>
            <TableHead>GST</TableHead>
            <TableHead>QST</TableHead>
            <TableHead>Invoice Total</TableHead>
            <TableHead className="text-right">Is Paid</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvoices.map((item) => (
            <TableRow key={item.attributes.supplier?.data?.id}>
              <TableCell className="font-medium">{item.attributes.supplier?.data?.id}</TableCell>
              <TableCell>{item.attributes.supplier?.data?.attributes?.name}</TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.attributes.date?.toString() ?? ""}</TableCell>
              <TableCell>${item.cost.subtotal.toFixed(2)}</TableCell>
              <TableCell>${item.cost.gst.toFixed(2)}</TableCell>
              <TableCell>${item.cost.qst.toFixed(2)}</TableCell>
              <TableCell>${item.cost.total.toFixed(2)}</TableCell>
              <TableCell>
                <div>
                  <Input
                    type="checkbox"
                    className="ml-auto mr-5 h-4 w-4"
                    checked={item.attributes.amountPaid === Math.abs(item.cost.total)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell></TableCell>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell>
              $
              {filteredInvoices
                .reduce((accumulator, currentItem) => {
                  const salesTotal = currentItem.cost.subtotal;
                  return accumulator + salesTotal;
                }, 0)
                .toFixed(2)}
            </TableCell>
            <TableCell>
              $
              {filteredInvoices
                .reduce((accumulator, currentItem) => {
                  const val = currentItem.cost.gst;
                  return accumulator + val;
                }, 0)
                .toFixed(2)}
            </TableCell>
            <TableCell>
              $
              {filteredInvoices
                .reduce((accumulator, currentItem) => {
                  const val = currentItem.cost.qst;
                  return accumulator + val;
                }, 0)
                .toFixed(2)}
            </TableCell>
            <TableCell colSpan={3}>
              $
              {filteredInvoices
                .reduce((accumulator, currentItem) => {
                  const val = currentItem.cost.total;
                  return accumulator + val;
                }, 0)
                .toFixed(2)}
            </TableCell>
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
        Print Report
      </Button>
    </div>
  );
}
