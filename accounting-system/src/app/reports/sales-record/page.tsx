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

export default function SalesRecord() {
  // ?showPaid=true&from=2024-04-03T07:00:00.000Z&to=2024-04-18T07:00:00.000Z
  const searchParams = useSearchParams();

  const showPaid = JSON.parse(searchParams.get("showPaid") ?? "false");

  const from: Date = new Date(decodeURIComponent(searchParams.get("from") ?? new Date().toISOString()));
  const to: Date = new Date(decodeURIComponent(searchParams.get("to") ?? new Date().toISOString()));

  console.log(from, to, showPaid);

  let invoices = [
    {
      id: "124124214",
      clientId: "01234101",
      clientName: "Placeholder",
      date: "Some Date",
      salesTotal: "100.00",
      gst: "5",
      qst: "9.75",
      invoiceTotal: "114.75",
      isPaid: false,
    },
    {
      id: "1242322334",
      clientId: "01234101",
      clientName: "Placeholder",
      date: "Some Date",
      salesTotal: "1000.00",
      gst: "50",
      qst: "97.5",
      invoiceTotal: "1147.5",
      isPaid: true,
    },
  ];

  if (!showPaid) {
    invoices = invoices.filter((invoice) => {
      return !invoice.isPaid;
    });
  }

  return (
    <div>
      <h1 className="mb-4 mt-8 text-center text-3xl font-gigabold">{showPaid ? "Sales Report" : "Account Receivable Report"}</h1>
      <h1 className="mb-12 text-center text-xl font-gigabold">
        {from.toDateString()} - {to.toDateString()}
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Client ID</TableHead>
            <TableHead>Client Name</TableHead>
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
          {invoices.map((item) => (
            <TableRow key={item.clientId}>
              <TableCell className="font-medium">{item.clientId}</TableCell>
              <TableCell>{item.clientName}</TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>${item.salesTotal}</TableCell>
              <TableCell>${item.gst}</TableCell>
              <TableCell>${item.qst}</TableCell>
              <TableCell>${item.invoiceTotal}</TableCell>
              <TableCell>
                <div>
                  <Input type="checkbox" className="ml-auto mr-5 h-4 w-4" checked={item.isPaid} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell>
              $
              {invoices
                .reduce((accumulator, currentItem) => {
                  const salesTotal = parseFloat(currentItem.salesTotal);
                  return accumulator + salesTotal;
                }, 0)
                .toFixed(2)}
            </TableCell>
            <TableCell>
              $
              {invoices
                .reduce((accumulator, currentItem) => {
                  const val = parseFloat(currentItem.gst);
                  return accumulator + val;
                }, 0)
                .toFixed(2)}
            </TableCell>
            <TableCell>
              $
              {invoices
                .reduce((accumulator, currentItem) => {
                  const val = parseFloat(currentItem.qst);
                  return accumulator + val;
                }, 0)
                .toFixed(2)}
            </TableCell>
            <TableCell colSpan={3}>
              $
              {invoices
                .reduce((accumulator, currentItem) => {
                  const val = parseFloat(currentItem.invoiceTotal);
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
