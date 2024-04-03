"use client";

import { useSearchParams } from "next/navigation";

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../../_components/shadcn/table";
import { Button } from "../../_components/shadcn/button";

export default function FinancialStatement() {
  // ?from=2024-04-03T07:00:00.000Z&to=2024-04-18T07:00:00.000Z
  const searchParams = useSearchParams();

  const date: Date = new Date(decodeURIComponent(searchParams.get("from") ?? new Date().toISOString()));

  //move negative to other column
  const revenue = {
    salesDebit: 0,
    salesCredit: 2100, //sum all client invoice sales, no taxes
    salaryDebit: 0,
    salaryCredit: 300, //sum all client invoice salaries, no taxes
    miscDebit: 0,
    miscCredit: 500, //sum all client invoice misc, no taxes
  };

  const expense = {
    purchaseDebit: 1100, //sum all supplier invoice sales, no taxes
    purchaseCredit: 0,
    rentDebit: 100, //sum all supplier invoice rent, no taxes
    rentCredit: 0,
    miscDebit: 300, //sum all supplier invoice misc, no taxes
    miscCredit: 0,
  };

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
            <TableCell>{revenue.salesDebit.toFixed(2)}</TableCell>
            <TableCell>{revenue.salesCredit.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Salary</TableCell>
            <TableCell>{revenue.salaryDebit.toFixed(2)}</TableCell>
            <TableCell>{revenue.salaryCredit.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Misc Income</TableCell>
            <TableCell>{revenue.miscDebit.toFixed(2)}</TableCell>
            <TableCell>{revenue.miscCredit.toFixed(2)}</TableCell>
          </TableRow>

          {/* total rev and put total under credit*/}

          <TableRow>
            <TableCell className="font-gigabold">Expense</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Purchase</TableCell>
            <TableCell>{expense.purchaseDebit.toFixed(2)}</TableCell>
            <TableCell>{expense.purchaseCredit.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Rent</TableCell>
            <TableCell>{expense.rentDebit.toFixed(2)}</TableCell>
            <TableCell>{expense.rentCredit.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Misc Expense</TableCell>
            <TableCell>{expense.miscDebit.toFixed(2)}</TableCell>
            <TableCell>{expense.miscCredit.toFixed(2)}</TableCell>
          </TableRow>

          {/* total rev and put total under credit*/}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-gigabold" colSpan={2}>
              P&L
            </TableCell>
            {/* sum all rev debits subtract with all rev credits, repeat for expense then add together rev and expense numbers */}
            <TableCell className="font-gigabold">
              $
              {(
                revenue.salaryDebit +
                revenue.salesDebit +
                revenue.miscDebit -
                (revenue.salaryCredit + revenue.salesCredit + revenue.miscCredit) +
                (expense.purchaseDebit +
                  expense.rentDebit +
                  expense.miscDebit -
                  (expense.purchaseCredit + expense.rentCredit + expense.miscCredit))
              ).toFixed(2)}
            </TableCell>
            <TableCell></TableCell>
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
