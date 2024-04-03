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
import { buildStrapiRequest, fetchAPIClient } from "../../../_utils/strapiApi";
import { useToast } from "../../shadcn/use-toast";

import { Client } from "@apiTypes/client/content-types/client/client";

export default function ProfileSearchDialog({ setSelectedClient }: { setSelectedClient: Function }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const formSchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    telephone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const { requestUrl, mergedOptions } = buildStrapiRequest("/suppliers", {
      filters: {
        id: { $contains: values.id },
        name: { $contains: values.name },
        phone: { $contains: values.telephone },
        email: { $contains: values.email },
        address: { $contains: values.address },
      },
    });

    console.log(mergedOptions);

    const result = await fetchAPIClient(requestUrl, mergedOptions);
    setClients(result.data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hightlighted">Search for Supplier</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mx-auto text-3xl">Search for Supplier Profile</DialogHeader>
        <DialogFooter className="mx-auto flex w-full flex-col space-x-0 text-center sm:flex-col sm:space-x-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-2">
                      <FormLabel>Supplier ID:</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input type="number" placeholder="Supplier ID..." {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br></br>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-2">
                      <FormLabel>Supplier Name:</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input type="string" placeholder="Supplier Name..." {...field} />
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
                  Search for Supplier
                </Button>
              </div>
            </form>
          </Form>
          {clients.length > 0 && <h1 className="my-4 font-bold">Search Results:</h1>}
          <div>
            {clients.map((client) => {
              return (
                <div key={client.id} className="my-2 flex items-center justify-between rounded-lg bg-backgroundGray px-4 py-2">
                  <div>ID: {client.id}</div>
                  <div>{client.attributes.name}</div>
                  <Button
                    variant="hightlighted"
                    onClick={() => {
                      setOpen(false);
                      setSelectedClient(client);
                    }}
                  >
                    Select
                  </Button>
                </div>
              );
            })}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
