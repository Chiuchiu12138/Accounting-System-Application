import Link from "next/link";
import { Button } from "../_components/shadcn/button";

export default function Home() {
  return (
    <div className="flex w-full min-h-[80vh] mt-12">
      <div className="flex flex-col justify-evenly w-full p-5 bg-white rounded-lg gap-2">
        <h2 className="text-2xl font-gigabold text-center w-full mb-7 underline underline-offset-8">
          Account Receivable
        </h2>
        <div className="w-full flex flex-col">
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
        <div className="w-full flex flex-col">
          <Button variant="hightlighted">Client Payment</Button>
          <br></br>
          <Button variant="hightlighted">Client Refund</Button>
        </div>
        <div className="w-full flex flex-col">
          <Link className="w-full" href="/receivable/client-profile">
            <Button className="w-full" variant="hightlighted">
              Client Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="border-r-2 border-black mx-8"></div>

      <div className="flex flex-col justify-evenly w-full p-5 bg-white rounded-lg gap-2">
        <h2 className="text-2xl font-gigabold text-center w-full mb-7 underline underline-offset-8">
          Account Payable
        </h2>
        <div className="w-full flex flex-col">
          <Button variant="hightlighted">Supplier Invoice</Button>
          <br></br>
          <Button variant="hightlighted">Credit Memo</Button>
        </div>
        <div className="w-full flex flex-col">
          <Button variant="hightlighted">Payment to Supplier</Button>
          <br></br>
          <Button variant="hightlighted">Supplier Refund</Button>
        </div>
        <div className="w-full flex flex-col">
          <Button className="w-full" variant="hightlighted">
            Supplier Profile
          </Button>
        </div>
      </div>

      <div className="border-r-2 border-black mx-8"></div>

      <div className="flex flex-col justify-evenly w-full p-5 bg-white rounded-lg gap-2">
        <h2 className="text-2xl font-gigabold text-center w-full mb-7 underline underline-offset-8">
          Reports
        </h2>
        <div className="w-full flex flex-col">
          <Button variant="hightlighted">Balance Sheet</Button>
          <br></br>
          <Button variant="hightlighted">Financial Statement</Button>
        </div>
        <div className="h-[104px]"></div>
        <div className="w-full flex flex-col">
          <Button className="w-full" variant="hightlighted">
            My Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
