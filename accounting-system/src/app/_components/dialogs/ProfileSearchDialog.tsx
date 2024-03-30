import { ReactNode, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn/dialog";
import { AuthContext, AuthScreen } from "@/src/app/_providers/AuthProvider";
import { DialogFooter } from "../shadcn/dialog";

import { Input } from "../../_components/shadcn/input";
import { Button } from "../../_components/shadcn/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  FormDescription,
} from "../../_components/shadcn/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ProfileSearchDialog() {
  const formSchema = z.object({
    id: z.number().optional(),
    name: z.string().optional(),
    telephone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    alert("submitted");
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="hightlighted">Search</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mx-auto text-3xl">
          Search for Profile
        </DialogHeader>
        <DialogFooter className="text-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full mx-6"
            >
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-2">
                      <FormLabel>Client ID:</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Client ID..."
                            {...field}
                          />
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
                    <FormItem className="flex items-center gap-2 justify-between">
                      <FormLabel>Client Name:</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input
                            type="string"
                            placeholder="Client Name..."
                            {...field}
                          />
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
                    <FormItem className="flex items-center gap-2 justify-between">
                      <FormLabel>Tel #:</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input
                            type="string"
                            placeholder="Telephone Number..."
                            {...field}
                          />
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
                    <FormItem className="flex items-center gap-2 justify-between">
                      <FormLabel>Email:</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input
                            type="string"
                            placeholder="Email..."
                            {...field}
                          />
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
                    <FormItem className="flex items-center gap-2 justify-between">
                      <FormLabel>Address:</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input
                            type="string"
                            placeholder="Address..."
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br></br>
              </div>
              <div className="flex w-full flex-col items-center">
                <Button
                  type="submit"
                  size="sm"
                  variant="hightlighted"
                  className="w-full"
                >
                  Search
                </Button>
              </div>
            </form>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
