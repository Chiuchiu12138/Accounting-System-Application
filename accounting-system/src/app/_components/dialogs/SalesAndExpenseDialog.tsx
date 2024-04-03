"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../shadcn/dialog";
import { DialogFooter } from "../shadcn/dialog";

import { Button } from "../shadcn/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "../shadcn/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "../shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { Input } from "../shadcn/input";
import { useState } from "react";

import { useRouter } from "next/navigation";

export default function SalesAndExpenseDialog({ mode }: { mode: "sales" | "expense" }) {
  const [showPaid, setShowPaid] = useState<boolean>(false);

  const formSchema = z.object({
    dateRange: z.object({
      from: z.date(),
      to: z.date(),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (mode === "sales") {
      router.push(
        `/reports/sales-record?showPaid=${showPaid}&from=${values.dateRange.from.toISOString()}&to=${values.dateRange.to.toISOString()}`,
      );
    } else {
      router.push(
        `/reports/expense-record?showPaid=${showPaid}&from=${values.dateRange.from.toISOString()}&to=${values.dateRange.to.toISOString()}`,
      );
    }
  }

  const modeText = mode === "sales" ? "Sales Record" : "Expense Record";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="hightlighted">{modeText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mx-auto text-3xl">{modeText}</DialogHeader>
        <DialogFooter className="text-center">
          <Form {...form}>
            <form id="report-form" onSubmit={form.handleSubmit(onSubmit)} className="mx-auto space-y-8">
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"hightlighted"}
                            className={cn("w-full text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="range" selected={field.value} onSelect={field.onChange} />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br></br>
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel>Show Paid Records</FormLabel>
                      <Input
                        type="checkbox"
                        className="h-4 w-4"
                        onChange={(e) => {
                          setShowPaid(e.target.checked);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full flex-col items-center">
                <Button type="submit" form="report-form" size="sm" variant="hightlighted" className="w-full">
                  Go
                </Button>
              </div>
            </form>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
