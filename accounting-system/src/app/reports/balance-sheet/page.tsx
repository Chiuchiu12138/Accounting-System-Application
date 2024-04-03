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

export default function BalanceSheet() {
  // ?from=2024-04-03T07:00:00.000Z&to=2024-04-18T07:00:00.000Z
  const searchParams = useSearchParams();

  const date: Date = new Date(decodeURIComponent(searchParams.get("from") ?? new Date().toISOString()));

  //move to credit if negative
  const asset = {
    cashDebit: 0, //client payments, sum all payments of all client invoices
    cashCredit: 0, //supplier payments, sum all payments of all supplier invoices then add to account receivable
    accountReceivableDebit: 114.75, //sum of all unpaid client invoices
    accountReceivableCredit: 0,
    gstReceivableDebit: 42.5, //Sum all unpaid supplier invoice gst amounts
    gstReceivableCredit: 0,
    qstReceivableDebit: 82.875, //Sum all unpaid supplier invoice gst amounts
    qstReceivableCredit: 0,
  };

  //move to debit if negative
  const liability = {
    accountPayableDebit: 0,
    accountPayableCredit: 975.375, //sum all unpaid supplier invoices
    gstPayableDebit: 0,
    gstPayableCredit: 55, //Sum all unpaid client invoice gst amounts
    qstPayableDebit: 0,
    qstPayableCredit: 107.25, //Sum all unpaid client invoice qst amounts
  };

  const totalAsset =
    asset.cashDebit +
    asset.accountReceivableDebit +
    asset.gstReceivableDebit +
    asset.qstReceivableDebit -
    (asset.cashCredit + asset.accountReceivableCredit + asset.gstReceivableCredit + asset.qstReceivableCredit);

  const totalLiability =
    liability.accountPayableCredit +
    liability.gstPayableCredit +
    liability.qstPayableCredit -
    (liability.accountPayableDebit + liability.gstPayableDebit + liability.qstPayableDebit);

  return (
    <div>
      <h1 className="mb-4 mt-8 text-center text-3xl font-gigabold">Balance Sheet</h1>
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
            <TableCell className="font-gigabold">Asset</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Cash</TableCell>
            <TableCell>{asset.cashDebit.toFixed(2)}</TableCell>
            <TableCell>{asset.cashCredit.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Account Receivable</TableCell>
            <TableCell>{asset.accountReceivableDebit.toFixed(2)}</TableCell>
            <TableCell>{asset.accountReceivableCredit.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>GST Reveivable</TableCell>
            <TableCell>{asset.gstReceivableDebit.toFixed(2)}</TableCell>
            <TableCell>{asset.gstReceivableCredit.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>QST Reveivable</TableCell>
            <TableCell>{asset.qstReceivableDebit.toFixed(2)}</TableCell>
            <TableCell>{asset.qstReceivableCredit.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Asset</TableCell>
            <TableCell></TableCell>
            <TableCell>${totalAsset.toFixed(2)}</TableCell>
            <TableCell></TableCell>
          </TableRow>

          <TableRow>
            <TableCell></TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-gigabold">Liability</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Account Payable</TableCell>
            <TableCell>{liability.accountPayableDebit.toFixed(2)}</TableCell>
            <TableCell>{liability.accountPayableCredit.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>GST Payable</TableCell>
            <TableCell>{liability.gstPayableDebit.toFixed(2)}</TableCell>
            <TableCell>{liability.gstPayableCredit.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>QST Payable</TableCell>
            <TableCell>{liability.qstPayableDebit.toFixed(2)}</TableCell>
            <TableCell>{liability.qstPayableCredit.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Liability</TableCell>
            <TableCell></TableCell>
            <TableCell className="text-right">${totalLiability.toFixed(2)}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-gigabold" colSpan={2}>
              Equity
            </TableCell>
            {/* sum all rev debits subtract with all rev credits, repeat for expense then add together rev and expense numbers */}
            <TableCell className="font-gigabold">${totalAsset - totalLiability}</TableCell>
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
