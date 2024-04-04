"use client";

import { useSearchParams } from "next/navigation";

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../../_components/shadcn/table";
import { Input } from "../../_components/shadcn/input";
import { Button } from "../../_components/shadcn/button";
import { InvoiceWithItems, getInvoiceCost, getInvoiceData } from "../../_utils/strapiApi";
import { useEffect, useState } from "react";

export default function BalanceSheet() {
  // ?from=2024-04-03T07:00:00.000Z&to=2024-04-18T07:00:00.000Z
  const searchParams = useSearchParams();

  const date: Date = new Date(decodeURIComponent(searchParams.get("from") ?? new Date().toISOString()));

  const [invoiceData, setInvoiceData] = useState<InvoiceWithItems[]>([]);
  const [memoData, setMemoData] = useState<InvoiceWithItems[]>([]);

  useEffect(() => {
    async function fetchData() {
      let invoices = await getInvoiceData(true, undefined, undefined);
      console.log(invoices);
      setInvoiceData(invoices);

      let memos = await getInvoiceData(false, undefined, undefined);
      console.log(memos);
      setMemoData(memos);
    }
    fetchData();
  }, []);

  const cash1 = invoiceData.concat(memoData).reduce((accumulator, currentItem) => {
    if (currentItem.attributes.client?.data && currentItem.attributes.amountPaid === Math.abs(currentItem.cost.total)) {
      console.log("found payment to client: ", currentItem.cost.total);
      const val = currentItem.cost.total;
      return accumulator + val;
    } else {
      return accumulator;
    }
  }, 0);

  const cash2 = invoiceData.concat(memoData).reduce((accumulator, currentItem) => {
    if (currentItem.attributes.supplier?.data && currentItem.attributes.amountPaid === Math.abs(currentItem.cost.total)) {
      console.log("found payment to supplier: ", currentItem.cost.total);
      const val = currentItem.cost.total;
      return accumulator + val;
    } else {
      return accumulator;
    }
  }, 0);

  const totalMemo = memoData.reduce((accumulator, currentItem) => {
    if (currentItem.attributes.client?.data) {
      return accumulator + getInvoiceCost(currentItem).total;
    } else {
      return accumulator;
    }
  }, 0);

  const totalMemoSupplier = memoData.reduce((accumulator, currentItem) => {
    if (currentItem.attributes.supplier?.data) {
      return accumulator + getInvoiceCost(currentItem).total;
    } else {
      return accumulator;
    }
  }, 0);

  const totalInvoice = invoiceData.reduce((accumulator, currentItem) => {
    if (currentItem.attributes.client?.data) {
      console.log(getInvoiceCost(currentItem));
      return accumulator + getInvoiceCost(currentItem).total;
    } else {
      return accumulator;
    }
  }, 0);

  const totalInvoiceSupplier = invoiceData.reduce((accumulator, currentItem) => {
    if (currentItem.attributes.supplier?.data) {
      console.log(getInvoiceCost(currentItem));
      return accumulator + getInvoiceCost(currentItem).total;
    } else {
      return accumulator;
    }
  }, 0);

  //all client payments - all supplier payments
  const totalInvoicePayments = invoiceData.reduce((accumulator, currentItem) => {
    if (currentItem.attributes.client?.data && currentItem.attributes.amountPaid === Math.abs(currentItem.cost.total)) {
      return accumulator + (currentItem.attributes.amountPaid ?? 0);
    } else {
      return accumulator;
    }
  }, 0);

  const totalMemoPayments = memoData.reduce((accumulator, currentItem) => {
    if (currentItem.attributes.client?.data && currentItem.attributes.amountPaid === Math.abs(currentItem.cost.total)) {
      return accumulator - (currentItem.attributes.amountPaid ?? 0);
    } else {
      return accumulator;
    }
  }, 0);

  const allClientPayments = totalInvoicePayments - totalMemoPayments;

  const totalInvoicePaymentsSupplier = invoiceData.reduce((accumulator, currentItem) => {
    if (currentItem.attributes.supplier?.data && currentItem.attributes.amountPaid === Math.abs(currentItem.cost.total)) {
      return accumulator + (currentItem.attributes.amountPaid ?? 0);
    } else {
      return accumulator;
    }
  }, 0);

  const totalMemoPaymentsSupplier = memoData.reduce((accumulator, currentItem) => {
    if (currentItem.attributes.supplier?.data) {
      return accumulator - (currentItem.attributes.amountPaid ?? 0);
    } else {
      return accumulator;
    }
  }, 0);

  const allSupplierPayments = totalInvoicePaymentsSupplier - totalMemoPaymentsSupplier;

  console.log("CASH&&&&", cash1, cash2);

  const totalUnpaidInvoiceClient = totalInvoice - totalInvoicePayments;
  const totalUnpaidMemoClient = totalMemo - totalMemoPayments;

  const totalUnpaidInvoiceSupplier = totalInvoiceSupplier - totalInvoicePaymentsSupplier;
  const totalUnpaidMemoSupplier = totalMemoSupplier - totalMemoPaymentsSupplier;

  const totalClientGST = invoiceData.concat(memoData).reduce((accumulator, currentItem) => {
    if (currentItem.attributes.client?.data) {
      return accumulator + getInvoiceCost(currentItem).gst;
    } else {
      return accumulator;
    }
  }, 0);

  const totalClientQST = invoiceData.concat(memoData).reduce((accumulator, currentItem) => {
    if (currentItem.attributes.client?.data) {
      return accumulator + getInvoiceCost(currentItem).qst;
    } else {
      return accumulator;
    }
  }, 0);

  //Sum all unpaid supplier invoice gst amounts
  const totalSupplierGST = invoiceData.concat(memoData).reduce((accumulator, currentItem) => {
    if (currentItem.attributes.supplier?.data) {
      return accumulator + getInvoiceCost(currentItem).gst;
    } else {
      return accumulator;
    }
  }, 0);

  const totalSupplierQST = invoiceData.concat(memoData).reduce((accumulator, currentItem) => {
    if (currentItem.attributes.supplier?.data) {
      return accumulator + getInvoiceCost(currentItem).qst;
    } else {
      return accumulator;
    }
  }, 0);

  const one = invoiceData.concat(memoData).reduce((accumulator, currentItem) => {
    const val = currentItem.cost.total;
    return accumulator + val;
  }, 0);

  const two = invoiceData.reduce((accumulator, currentItem) => {
    const val = currentItem.cost.total;
    return accumulator + val;
  }, 0);

  const three = invoiceData.reduce((accumulator, currentItem) => {
    const val = currentItem.cost.total;
    return accumulator + val;
  }, 0);

  // console.log("cash", totalInvoicePayments, totalInvoicePaymentsSupplier);
  // console.log("IANSFDIFNAOUJDSNFuj", totalUnpaidInvoiceClient, totalUnpaidMemoClient, totalInvoicePayments);

  //default to debit side
  //move to credit if negative
  const asset = {
    cash: cash1 - cash2, //all client payments - all supplier payments
    accountReceivable: totalUnpaidInvoiceClient + totalUnpaidMemoClient, //sum of all unpaid client invoices - all memos + sum all payments to client
    gstReceivable: totalSupplierGST, //Sum all unpaid supplier invoice gst amounts
    qstReceivable: totalSupplierQST, //Sum all unpaid supplier invoice gst amounts
  };

  //default to credit side
  //move to debit if negative
  const liability = {
    accountPayable: totalUnpaidInvoiceSupplier + totalUnpaidMemoSupplier, //sum all unpaid supplier invoices
    gstPayable: totalClientGST, //Sum all unpaid client invoice gst amounts
    qstPayable: totalClientQST, //Sum all unpaid client invoice qst amounts
  };

  const totalAsset = asset.cash + asset.accountReceivable + asset.gstReceivable + asset.qstReceivable;

  const totalLiability = liability.accountPayable + liability.gstPayable + liability.qstPayable;

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
            <TableCell>{asset.cash >= 0 ? asset.cash.toFixed(2) : ""}</TableCell>
            <TableCell>{asset.cash < 0 ? asset.cash.toFixed(2).replace(/-/g, "") : ""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Account Receivable</TableCell>
            <TableCell>{asset.accountReceivable >= 0 ? asset.accountReceivable.toFixed(2) : ""}</TableCell>
            <TableCell>{asset.accountReceivable < 0 ? asset.accountReceivable.toFixed(2).replace(/-/g, "") : ""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>GST Reveivable</TableCell>
            <TableCell>{asset.gstReceivable >= 0 ? asset.gstReceivable.toFixed(2) : ""}</TableCell>
            <TableCell>{asset.gstReceivable < 0 ? asset.gstReceivable.toFixed(2).replace(/-/g, "") : ""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>QST Reveivable</TableCell>
            <TableCell>{asset.qstReceivable >= 0 ? asset.qstReceivable.toFixed(2) : ""}</TableCell>
            <TableCell>{asset.qstReceivable < 0 ? asset.qstReceivable.toFixed(2).replace(/-/g, "") : ""}</TableCell>
          </TableRow>
          <TableRow className="border-t-2 border-t-black">
            <TableCell>Total Asset</TableCell>
            <TableCell></TableCell>
            <TableCell>{totalAsset > 0 ? "$" + totalAsset.toFixed(2) : ""}</TableCell>
            <TableCell>{totalAsset <= 0 ? "$" + totalAsset.toFixed(2) : ""}</TableCell>
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
            <TableCell>{liability.accountPayable < 0 ? liability.accountPayable.toFixed(2).replace(/-/g, "") : ""}</TableCell>
            <TableCell>{liability.accountPayable >= 0 ? liability.accountPayable.toFixed(2) : ""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>GST Payable</TableCell>
            <TableCell>{liability.gstPayable < 0 ? liability.gstPayable.toFixed(2).replace(/-/g, "") : ""}</TableCell>
            <TableCell>{liability.gstPayable >= 0 ? liability.gstPayable.toFixed(2) : ""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>QST Payable</TableCell>
            <TableCell>{liability.qstPayable < 0 ? liability.qstPayable.toFixed(2).replace(/-/g, "") : ""}</TableCell>
            <TableCell>{liability.qstPayable >= 0 ? liability.qstPayable.toFixed(2) : ""}</TableCell>
          </TableRow>
          <TableRow className="border-t-2 border-t-black">
            <TableCell>Total Liability</TableCell>
            <TableCell></TableCell>
            <TableCell>{totalLiability < 0 ? "$" + totalLiability.toFixed(2) : ""}</TableCell>
            <TableCell>{totalLiability >= 0 ? "$" + totalLiability.toFixed(2) : ""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-gigabold" colSpan={3}>
              Equity
            </TableCell>
            {/* sum all rev debits subtract with all rev credits, repeat for expense then add together rev and expense numbers */}
            <TableCell className="text-right font-gigabold">${(totalAsset - totalLiability).toFixed(2)}</TableCell>
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
