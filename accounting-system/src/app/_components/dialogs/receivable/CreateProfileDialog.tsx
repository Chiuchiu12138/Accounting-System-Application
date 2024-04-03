import { ReactNode, useContext, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../shadcn/dialog";
import { AuthContext, AuthScreen } from "@/src/app/_providers/AuthProvider";
import { DialogFooter } from "../../shadcn/dialog";

import { Input } from "../../../_components/shadcn/input";
import { Button } from "../../../_components/shadcn/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  FormDescription,
} from "../../../_components/shadcn/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/src/app/_components/shadcn/use-toast";
import axios from "axios";
import { buildStrapiRequest, fetchAPIClient, getStrapiURL, postAPIClient } from "../../../_utils/strapiApi";

export default function CreateProfileDialog({ setSelectedClient }: { setSelectedClient: Function }) {
  const { authenticatedUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const formSchema = z.object({
    name: z.string().min(1),
    telephone: z.string().min(1),
    email: z.string().min(1),
    address: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const { requestUrl, mergedOptions } = buildStrapiRequest(
      "/clients",
      {},
      {
        data: {
          name: values.name,
          phone: values.telephone,
          email: values.email,
          address: values.address,
          invoices: [],
          memos: [],
          user: authenticatedUser?.userInfo.id,
        },
      },
    );

    console.log(mergedOptions);

    const result = await postAPIClient(requestUrl, mergedOptions);

    console.log(result);

    if (result) {
      setOpen(false);
      setSelectedClient(result.data);
      toast({
        duration: 2000,
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        title: "Successfully created new profile.",
        variant: "green",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hightlighted">Create New Client</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mx-auto text-3xl">New Client</DialogHeader>
        <DialogFooter className="text-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mx-6 w-full space-y-8">
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-2">
                      <FormLabel>Name:</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input type="string" placeholder="Client Name..." {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br></br>
                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-2">
                      <FormLabel>Tel #:</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input type="string" placeholder="Telephone Number..." {...field} />
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
                    <FormItem className="flex items-center justify-between gap-2">
                      <FormLabel>Email:</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input type="string" placeholder="Email..." {...field} />
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
                    <FormItem className="flex items-center justify-between gap-2">
                      <FormLabel>Address:</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input type="string" placeholder="Address..." {...field} />
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
                  Create New Client
                </Button>
              </div>
            </form>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
