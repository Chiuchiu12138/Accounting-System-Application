"use client";

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

export default function ChartOfAccount() {
  const chartOfAccount = [
    { id: 1000, name: "Cash" },
    { id: 1001, name: "Account Receivable" },
    { id: 1002, name: "GST Receivable" },
    { id: 1003, name: "QST Receivable" },
    { id: 2001, name: "Account Payable" },
    { id: 2002, name: "GST Payable" },
    { id: 2003, name: "QST Payable" },
    { id: 3000, name: "Equity" },
    { id: 4000, name: "Sales" },
    { id: 4001, name: "Salary" },
    { id: 4002, name: "Misc Income" },
    { id: 5000, name: "Expense" },
    { id: 5001, name: "Rent" },
    { id: 5002, name: "Misc Expense" },
  ];

  return (
    <div data-testid="chartofaccount">
      <h1 className="mb-16 mt-8 text-center text-3xl font-gigabold">Chart Of Account</h1>
      <Table>
        {/* <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Client ID</TableHead>
            <TableHead>Client Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Sales Total</TableHead>
            <TableHead>GST</TableHead>
            <TableHead>QST</TableHead>
            <TableHead>Invoice Total</TableHead>
            <TableHead className="text-right">Is Paid</TableHead>
          </TableRow>
        </TableHeader> */}
        <TableBody>
          {chartOfAccount.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="w-1/2 text-center">{item.id}</TableCell>
              <TableCell className="w-1/2">{item.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
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
