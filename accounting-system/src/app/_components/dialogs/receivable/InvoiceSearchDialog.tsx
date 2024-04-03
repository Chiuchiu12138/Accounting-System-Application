import { ReactNode, useContext, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../shadcn/dialog";
import { DialogFooter } from "../../shadcn/dialog";

import { Input } from "../../shadcn/input";
import { Button } from "../../shadcn/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "../../shadcn/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "../../shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../shadcn/popover";
import { Invoice } from "@apiTypes/invoice/content-types/invoice/invoice";
import { buildStrapiRequest, fetchAPIClient } from "../../../_utils/strapiApi";
import Link from "next/link";

export default function InvoiceSearchDialog({ mode }: { mode: "invoice" | "memo" }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const formSchema = z.object({
    date: z.date().optional(),
    invoiceId: z.string().optional(),
    clientId: z.number().optional(),
    clientName: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const { requestUrl, mergedOptions } = buildStrapiRequest(`/${mode === "invoice" ? "invoices" : "memos"}`, {
      filters: {
        id: { $contains: values.invoiceId },
        date: { $contains: values.date?.toISOString()?.split("T")[0] },
        client: {
          id: { $contains: values.clientId },
          address: { $contains: values.address },
          email: { $contains: values.email },
          phone: { $contains: values.phoneNumber },
          name: { $contains: values.clientName },
        },
      },
      populate: "client, items",
    });

    console.log(mergedOptions);

    const result = await fetchAPIClient(requestUrl, mergedOptions);
    result.data = result.data.filter((invoice: any) => {
      return invoice.attributes.client.data;
    });
    setInvoices(result.data);
  }

  const modeText = mode === "invoice" ? "Search an Invoice" : "Search a Memo";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="hightlighted">{modeText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mx-auto text-3xl">{modeText}</DialogHeader>
        <DialogFooter className="mx-auto flex w-full flex-col space-x-0 text-center sm:flex-col sm:space-x-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto space-y-8">
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel>Date of Invoice</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"hightlighted"}
                              className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br></br>
                <FormField
                  control={form.control}
                  name="invoiceId"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel>Invoice ID</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input type="text" placeholder="Invoice ID..." {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br></br>
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel>Client ID</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input type="text" placeholder="Client ID..." {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br></br>
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel>Client Name</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input type="text" placeholder="Client Name..." {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br></br>
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel>Phone Number</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input type="text" placeholder="Phone Number..." {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br></br>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel>Email</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input type="text" placeholder="Email..." {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br></br>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel>Address</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input type="text" placeholder="Address..." {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br></br>
              </div>
              <div className="flex w-full flex-col items-center">
                <Button type="submit" size="sm" variant="hightlighted" className="w-full">
                  Search
                </Button>
              </div>
            </form>
          </Form>
          {invoices.length > 0 && <h1 className="my-4 font-bold">Search Results:</h1>}
          <div>
            {invoices.map((invoice) => {
              return (
                <div key={invoice.id} className="my-2 flex items-center justify-between rounded-lg bg-backgroundGray px-4 py-2">
                  <div>{invoice.id}</div>
                  <div>{invoice.attributes.date?.toString()}</div>
                  <div>{invoice.attributes.amountPaid === 0 ? "Unpaid" : "Paid"}</div>
                  <Link href={`/receivable/view-invoice?mode=${mode}&id=${invoice.id}`}>
                    <Button variant="hightlighted" onClick={() => {}}>
                      Select
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
