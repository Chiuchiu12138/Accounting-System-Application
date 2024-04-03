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
import Link from "next/link";

export default function BalanceSheetDialog({ mode }: { mode: "financial-statement" | "balance-sheet" }) {
  const formSchema = z.object({
    date: z.date().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    alert("submitted");
    console.log(values);
  }

  const modeText = mode === "financial-statement" ? "Financial Statement" : "Balance Sheet";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="hightlighted">{modeText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mx-auto text-3xl">{modeText}</DialogHeader>
        <DialogFooter className="text-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto space-y-8">
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel>Date ending at</FormLabel>
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
              </div>
              <div className="flex w-full flex-col items-center">
                {mode === "financial-statement" ? (
                  <Link className="w-full" href="/reports/financial-statement">
                    <Button type="submit" size="sm" variant="hightlighted" className="w-full">
                      Go
                    </Button>
                  </Link>
                ) : (
                  <Link className="w-full" href="/reports/balance-sheet">
                    <Button type="submit" size="sm" variant="hightlighted" className="w-full">
                      Go
                    </Button>
                  </Link>
                )}
              </div>
            </form>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
