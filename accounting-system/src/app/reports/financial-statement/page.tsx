"use client";

import { useSearchParams } from "next/navigation";

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../../_components/shadcn/table";
import { Button } from "../../_components/shadcn/button";
import { useContext, useEffect, useState } from "react";
import { InvoiceWithItems, getInvoiceData } from "../../_utils/strapiApi";
import { Type } from "@apiTypes/item/content-types/item/item";
import { AuthContext } from "../../_providers/AuthProvider";

export default function FinancialStatement() {
  // ?from=2024-04-03T07:00:00.000Z&to=2024-04-18T07:00:00.000Z
  const searchParams = useSearchParams();

  const date: Date = new Date(decodeURIComponent(searchParams.get("ending") ?? new Date().toISOString()));

  const [invoiceData, setInvoiceData] = useState<InvoiceWithItems[]>([]);
  const [memoData, setMemoData] = useState<InvoiceWithItems[]>([]);

  const { authenticatedUser } = useContext(AuthContext);

  useEffect(() => {
    async function fetchData() {
      let invoices = await getInvoiceData(true, undefined, undefined, authenticatedUser?.userInfo.id ?? -1);

      let memos = await getInvoiceData(false, undefined, undefined, authenticatedUser?.userInfo.id ?? -1);

      const from = new Date(date.getFullYear(), 0, 1);
      //remove invoices that do not fall in the selected date range
      let filteredInvoices = invoices.filter((invoice) => {
        const asDate = new Date(invoice.attributes.date as unknown as string);
        return asDate >= from && asDate <= date;
      });

      let filteredMemos = memos.filter((invoice) => {
        const asDate = new Date(invoice.attributes.date as unknown as string);
        return asDate >= from && asDate <= date;
      });

      setMemoData(filteredMemos);
      setInvoiceData(filteredInvoices);
    }
    fetchData();
  }, []);

  const totalMemoClient = { items: 0, salary: 0, misc: 0 };

  memoData.forEach((currentItem) => {
    //if client invoice and is paid
    if (currentItem.attributes.client?.data && currentItem.attributes.amountPaid === Math.abs(currentItem.cost.total)) {
      currentItem.items.forEach((currentItem) => {
        if (currentItem.attributes.type === Type.Sales) {
          totalMemoClient.items += currentItem.attributes.unitPrice! * currentItem.quantity;
        } else if (currentItem.attributes.type === Type.Labor) {
          totalMemoClient.salary += currentItem.attributes.unitPrice! * currentItem.quantity;
        } else if (currentItem.attributes.type === Type.Misc) {
          totalMemoClient.misc += currentItem.attributes.unitPrice! * currentItem.quantity;
        }
      });
    }
  });

  const totalInvoiceClient = { items: 0, salary: 0, misc: 0 };

  invoiceData.concat(memoData).forEach((currentItem) => {
    //if client invoice and is paid
    if (currentItem.attributes.client?.data) {
      let isMemo = currentItem.attributes.memoOrInvoice === "invoice" ? 1 : -1;
      currentItem.items.forEach((currentItem) => {
        if (currentItem.attributes.type === Type.Sales) {
          totalInvoiceClient.items += currentItem.attributes.unitPrice! * currentItem.quantity * isMemo;
        } else if (currentItem.attributes.type === Type.Labor) {
          totalInvoiceClient.salary += currentItem.attributes.unitPrice! * currentItem.quantity * isMemo;
        } else if (currentItem.attributes.type === Type.Misc) {
          totalInvoiceClient.misc += currentItem.attributes.unitPrice! * currentItem.quantity * isMemo;
        }
      });
    }
  });

  const totalMemoSupplier = { items: 0, salary: 0, misc: 0 };

  memoData.forEach((currentItem) => {
    //if client invoice and is paid
    if (currentItem.attributes.supplier?.data) {
      let isMemo = currentItem.attributes.memoOrInvoice === "invoice" ? 1 : -1;
      currentItem.items.forEach((currentItem) => {
        if (currentItem.attributes.type === Type.Sales) {
          totalMemoSupplier.items += currentItem.attributes.unitPrice! * currentItem.quantity * isMemo;
        } else if (currentItem.attributes.type === Type.Labor) {
          totalMemoSupplier.salary += currentItem.attributes.unitPrice! * currentItem.quantity * isMemo;
        } else if (currentItem.attributes.type === Type.Misc) {
          totalMemoSupplier.misc += currentItem.attributes.unitPrice! * currentItem.quantity * isMemo;
        }
      });
    }
  });

  const totalInvoiceSupplier = { items: 0, salary: 0, misc: 0 };

  invoiceData.concat(memoData).forEach((currentItem) => {
    //if client invoice and is paid
    if (currentItem.attributes.supplier?.data) {
      let isMemo = currentItem.attributes.memoOrInvoice === "invoice" ? 1 : -1;
      currentItem.items.forEach((currentItem) => {
        if (currentItem.attributes.type === Type.Sales) {
          totalInvoiceSupplier.items += currentItem.attributes.unitPrice! * currentItem.quantity * isMemo;
        } else if (currentItem.attributes.type === Type.Labor) {
          totalInvoiceSupplier.salary += currentItem.attributes.unitPrice! * currentItem.quantity * isMemo;
        } else if (currentItem.attributes.type === Type.Misc) {
          totalInvoiceSupplier.misc += currentItem.attributes.unitPrice! * currentItem.quantity * isMemo;
        }
      });
    }
  });

  //defualt credit
  //move negative to other column
  const revenue = {
    sales: totalInvoiceClient.items, //sum all paid client invoice sales, no taxes
    salary: totalInvoiceClient.salary, //sum all client invoice salaries, no taxes
    misc: totalInvoiceClient.misc, //sum all client invoice misc, no taxes
  };

  //default debit
  //move negative to other column
  const expense = {
    purchase: totalInvoiceSupplier.items, //sum all supplier invoice sales, no taxes
    rent: totalInvoiceSupplier.salary, //sum all supplier invoice rent, no taxes
    misc: totalInvoiceSupplier.misc, //sum all supplier invoice misc, no taxes
  };

  const totalRevenue = revenue.sales + revenue.salary + revenue.misc;
  const totalExpense = expense.purchase + expense.rent + expense.misc;

  return (
    <div>
      <h1 className="mb-4 mt-8 text-center text-3xl font-gigabold">Financial Statement (P&L)</h1>
      <h1 className="mb-12 text-center text-xl font-gigabold">For the period ending {date.toDateString()}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0"></TableHead>
            <TableHead className="w-0"></TableHead>
            <TableHead className="w-[150px]">Debit</TableHead>
            <TableHead className="w-[150px]">Credit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-gigabold">Revenue</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Sales</TableCell>
            <TableCell>{revenue.sales < 0 ? revenue.sales.toFixed(2).replace(/-/g, "") : ""}</TableCell>
            <TableCell>{revenue.sales >= 0 ? revenue.sales.toFixed(2) : ""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Salary</TableCell>
            <TableCell>{revenue.salary < 0 ? revenue.salary.toFixed(2).replace(/-/g, "") : ""}</TableCell>
            <TableCell>{revenue.salary >= 0 ? revenue.salary.toFixed(2) : ""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Misc Income</TableCell>
            <TableCell>{revenue.misc < 0 ? revenue.misc.toFixed(2).replace(/-/g, "") : ""}</TableCell>
            <TableCell>{revenue.misc >= 0 ? revenue.misc.toFixed(2) : ""}</TableCell>
          </TableRow>

          <TableRow className="border-t-2 border-t-black">
            <TableCell>Total Revenue</TableCell>
            <TableCell></TableCell>
            <TableCell>{totalRevenue <= 0 ? "$" + totalRevenue.toFixed(2) : ""}</TableCell>
            <TableCell>{totalRevenue > 0 ? "$" + totalRevenue.toFixed(2) : ""}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-gigabold">Expense</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Purchase</TableCell>
            <TableCell>{expense.purchase >= 0 ? expense.purchase.toFixed(2) : ""}</TableCell>
            <TableCell>{expense.purchase < 0 ? expense.purchase.toFixed(2).replace(/-/g, "") : ""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Rent</TableCell>
            <TableCell>{expense.rent >= 0 ? expense.rent.toFixed(2) : ""}</TableCell>
            <TableCell>{expense.rent < 0 ? expense.rent.toFixed(2).replace(/-/g, "") : ""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Misc Expense</TableCell>
            <TableCell>{expense.misc >= 0 ? expense.misc.toFixed(2) : ""}</TableCell>
            <TableCell>{expense.misc < 0 ? expense.misc.toFixed(2).replace(/-/g, "") : ""}</TableCell>
          </TableRow>
          <TableRow className="border-t-2 border-t-black">
            <TableCell>Total Expense</TableCell>
            <TableCell></TableCell>
            <TableCell>{totalExpense > 0 ? "$" + totalExpense.toFixed(2) : ""}</TableCell>
            <TableCell>{totalExpense <= 0 ? "$" + totalExpense.toFixed(2) : ""}</TableCell>
          </TableRow>
          <TableRow className="border-t-2 border-t-black"></TableRow>

          {/* total rev and put total under credit*/}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-gigabold" colSpan={2}>
              P&L
            </TableCell>
            <TableCell></TableCell>
            {/* sum all rev debits subtract with all rev credits, repeat for expense then add together rev and expense numbers */}
            <TableCell className="text-right font-gigabold">${(totalRevenue - totalExpense).toFixed(2)}</TableCell>
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
