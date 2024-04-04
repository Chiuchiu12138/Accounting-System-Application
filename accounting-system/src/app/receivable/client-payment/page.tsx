"use client";

import { useEffect, useState } from "react";
import { Button } from "../../_components/shadcn/button";
import { Calendar as CalendarIcon } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../../_components/shadcn/input";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/app/_components/shadcn/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/app/_components/shadcn/popover";
import { cn } from "../../_utils/shadUtils";
import { Check, ChevronsUpDown } from "lucide-react";
import ProfileSearchDialog from "../../_components/dialogs/receivable/ProfileSearchDialog";
import { Calendar } from "../../_components/shadcn/calendar";
import { format, setDate } from "date-fns";

import { useToast } from "@/src/app/_components/shadcn/use-toast";
import { Client } from "@apiTypes/client/content-types/client/client";
import { InvoiceWithItems, buildStrapiRequest, getInvoiceCost, getInvoiceData, putAPIClient } from "../../_utils/strapiApi";

export default function CreateInvoiceOrMemo() {
  const { toast } = useToast();

  type Invoice = {
    id: string;
    date: Date;
    total: string;
  };

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [dateError, setDateError] = useState<boolean>(false);
  const [clientError, setClientError] = useState<boolean>(false);
  const [invoicesToPay, setInvoicesToPay] = useState<InvoiceWithItems[]>([]);
  const [availableInvoices, setAvailableInvoices] = useState<InvoiceWithItems[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client>();

  useEffect(() => {
    async function fetchData() {
      let invoices = await getInvoiceData(true, undefined, selectedClient?.id);
      invoices = invoices.filter((invoice) => invoice.attributes.amountPaid === 0);
      let memos = await getInvoiceData(false, undefined, selectedClient?.id);
      memos = memos.filter((invoice) => invoice.attributes.amountPaid === 0);
      setAvailableInvoices(memos.concat(invoices));
    }
    if (selectedClient) {
      setClientError(false);
      fetchData();
    }
  }, [selectedClient]);

  useEffect(() => {
    if (selectedDate) {
      setDateError(false);
    }
  }, [selectedDate]);

  const formSchema = z.object({
    paid: z.literal(getTotalDue().toFixed(2), {
      errorMap: () => ({ message: `The amount paid must match the amount due ($${getTotalDue().toFixed(2)}) exactly.` }),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedClient) {
      setClientError(true);
      return;
    }
    if (!selectedDate) {
      setDateError(true);
      return;
    }

    {
      for (let i = 0; i < invoicesToPay.length; i++) {
        const invoice = invoicesToPay[i];
        const { requestUrl, mergedOptions } = buildStrapiRequest(
          `/${invoice.attributes.memoOrInvoice === "invoice" ? "invoices" : "memos"}/${invoice.id}`,
          {},
          {
            data: {
              amountPaid: Math.abs(getInvoiceCost(invoice).total),
            },
          },
        );

        await putAPIClient(requestUrl, mergedOptions);
      }

      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        title: "Successfully submitted payment.",
        variant: "green",
      });

      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  }

  function getTotalDue() {
    return invoicesToPay.reduce((accumulator, currentItem) => {
      // Adding the line total of the current item to the accumulator
      return accumulator + getInvoiceCost(currentItem).total;
    }, 0);
  }

  return (
    <div>
      <h1 className="mb-12 mt-8 text-center text-3xl font-gigabold">Client Payment</h1>

      <h1 className="mb-2 text-center text-lg font-gigabold">Select a Client:</h1>
      <div className="mb-16 w-full rounded-lg bg-white p-8">
        <div className="flex w-full items-center justify-evenly">
          <p className="font-gigabold">Selected Client:</p>
          <div>
            <div>ID: {selectedClient?.id ?? "N/A"}</div>
            <div>Name: {selectedClient?.attributes.name ?? "N/A"}</div>
            <div>Email: {selectedClient?.attributes.email ?? "N/A"}</div>
          </div>
          <div>
            <div>Address: {selectedClient?.attributes.address ?? "N/A"}</div>
            <div>Phone: {selectedClient?.attributes.phone ?? "N/A"}</div>
            <div className="h-6"></div>
          </div>
          <ProfileSearchDialog setSelectedClient={setSelectedClient}></ProfileSearchDialog>
        </div>
        {clientError && <p className="mt-6 text-center font-bold text-red-500">You must select a client.</p>}
      </div>
      <div className="flex justify-evenly">
        <div>
          <h1 className="mb-2 text-center text-lg font-gigabold">Select a Date:</h1>
          <div className="mx-auto mb-16 w-fit rounded-lg bg-white p-8">
            <div className="flex w-full justify-evenly">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"hightlighted"}
                    className={cn("w-[240px] pl-3 text-left font-normal", !selectedDate && "text-muted-foreground")}
                  >
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            {dateError && <p className="mt-6 text-center font-bold text-red-500">You must select a date.</p>}
          </div>
        </div>

        <div>
          <h1 className="mb-2 text-center text-lg font-gigabold">Enter Amount Paid:</h1>
          <Form {...form}>
            <form
              id="paid-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto mb-20 flex w-fit space-y-8 rounded-lg bg-white"
            >
              <div className="flex min-h-28 items-end justify-between gap-4 px-8 py-5">
                <FormField
                  control={form.control}
                  name="paid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount Paid</FormLabel>
                      <div className="flex items-center gap-2">
                        $
                        <FormControl>
                          <Input type="number" placeholder="Amount..." {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br></br>
                <div>
                  Amount Due: <p className="font-gigabold">${getTotalDue().toFixed(2)}</p>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <h1 className="mb-2 text-center text-lg font-gigabold">Select Invoices to Pay:</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total Due</TableHead>
            <TableHead className="text-right">Pay Now</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {availableInvoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{(invoice.attributes.date as unknown as string) ?? ""}</TableCell>
              <TableCell>${getInvoiceCost(invoice).total.toFixed(2)}</TableCell>
              <TableCell>
                <div>
                  <Input
                    type="checkbox"
                    className="ml-auto mr-5 h-4 w-4"
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      if (isChecked) {
                        setInvoicesToPay([...invoicesToPay, invoice]);
                      } else {
                        const filteredInvoices = invoicesToPay.filter((i) => invoice.id !== i.id);
                        setInvoicesToPay(filteredInvoices);
                      }
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>Total</TableCell>
            <TableCell className="text-right">
              $
              {invoiceItems
                .reduce((accumulator, currentItem) => {
                  // Adding the line total of the current item to the accumulator
                  return accumulator + currentItem.quantity * currentItem.unitPrice;
                }, 0)
                .toFixed(2)}
            </TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>

      <Button
        className="ml-auto mt-10"
        variant="hightlighted"
        type="submit"
        form="paid-form"
        // onClick={() => {
        //   form.handleSubmit(onSubmit);
        // }}
      >
        Submit Payment
      </Button>
    </div>
  );
}
