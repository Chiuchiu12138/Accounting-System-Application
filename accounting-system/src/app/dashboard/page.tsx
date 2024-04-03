"use client";

import Link from "next/link";
import { Button } from "../_components/shadcn/button";
import InvoiceSearchDialogPayable from "../_components/dialogs/payable/InvoiceSearchDialog";
import InvoiceSearchDialogRecievable from "../_components/dialogs/receivable/InvoiceSearchDialog";
import BalanceSheetDialog from "../_components/dialogs/BalanceSheetDialog";
import SalesAndExpenseDialog from "../_components/dialogs/SalesAndExpenseDialog";

export default function Home() {
  return (
    <div className="mt-12 flex min-h-[80vh] w-full">
      <div className="flex w-full flex-col justify-evenly gap-2 rounded-lg bg-white p-5">
        <h2 className="mb-7 w-full text-center text-2xl font-gigabold underline underline-offset-8">Account Receivable</h2>
        <div className="flex w-full flex-col">
          <Link className="w-full" href="/receivable/client-invoice">
            <Button className="w-full" variant="hightlighted">
              Client Invoice
            </Button>
          </Link>
          <br></br>
          <Link className="w-full" href="/receivable/credit-memo">
            <Button className="w-full" variant="hightlighted">
              Credit Memo
            </Button>
          </Link>
        </div>
        <div className="flex w-full flex-col">
          <InvoiceSearchDialogRecievable mode="invoice"></InvoiceSearchDialogRecievable>
          <br></br>
          <InvoiceSearchDialogRecievable mode="memo"></InvoiceSearchDialogRecievable>
        </div>

        <div className="flex w-full flex-col">
          <Link className="w-full" href="/receivable/client-payment">
            <Button className="w-full" variant="hightlighted">
              Client Payment
            </Button>
          </Link>
          <br></br>
          <Link className="w-full" href="/receivable/client-profile">
            <Button className="w-full" variant="hightlighted">
              Client Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-8 border-r-2 border-black"></div>

      <div className="flex w-full flex-col justify-evenly gap-2 rounded-lg bg-white p-5">
        <h2 className="mb-7 w-full text-center text-2xl font-gigabold underline underline-offset-8">Account Payable</h2>
        <div className="flex w-full flex-col">
          <Link className="w-full" href="/payable/client-invoice">
            <Button className="w-full" variant="hightlighted">
              Supplier Invoice
            </Button>
          </Link>
          <br></br>
          <Link className="w-full" href="/payable/credit-memo">
            <Button className="w-full" variant="hightlighted">
              Credit Memo
            </Button>
          </Link>
        </div>
        <div className="flex w-full flex-col">
          <InvoiceSearchDialogPayable mode="invoice"></InvoiceSearchDialogPayable>
          <br></br>
          <InvoiceSearchDialogPayable mode="memo"></InvoiceSearchDialogPayable>
        </div>

        <div className="flex w-full flex-col">
          <Link className="w-full" href="/payable/client-payment">
            <Button className="w-full" variant="hightlighted">
              Payment to Supplier
            </Button>
          </Link>
          <br></br>
          <Link className="w-full" href="/payable/client-profile">
            <Button className="w-full" variant="hightlighted">
              Supplier Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-8 border-r-2 border-black"></div>

      <div className="flex w-full flex-col justify-evenly gap-2 rounded-lg bg-white p-5">
        <h2 className="mb-7 w-full text-center text-2xl font-gigabold underline underline-offset-8">Reports</h2>
        <div className="flex w-full flex-col">
          <BalanceSheetDialog mode="balance-sheet"></BalanceSheetDialog>
          <br></br>
          <BalanceSheetDialog mode="financial-statement"></BalanceSheetDialog>
        </div>
        <div className="flex w-full flex-col">
          <SalesAndExpenseDialog mode="sales"></SalesAndExpenseDialog>
          <br></br>
          <SalesAndExpenseDialog mode="expense"></SalesAndExpenseDialog>
        </div>
        <div className="flex w-full flex-col">
          <Link className="w-full" href="/reports/chart-of-account">
            <Button className="w-full" variant="hightlighted">
              Chart Of Account
            </Button>
          </Link>
          <br></br>
          <Button className="invisible" variant="hightlighted">
            My Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
