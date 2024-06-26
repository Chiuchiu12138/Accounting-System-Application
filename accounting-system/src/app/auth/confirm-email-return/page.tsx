"use client";

import { useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";

import { useToast } from "@/src/app/_components/shadcn/use-toast";
import { useContext, useEffect } from "react";
import { AuthContext, AuthScreen } from "../../_providers/AuthProvider";

export default function ConfirmEmailReturn() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const { setAuthScreen } = useContext(AuthContext);

  //this is the page the user was on before they started the email confirmation process
  const returnTo = searchParams.get("return-to") ?? "/";

  //TODO: send code to backend, verify on backend, set email confirmed to true

  useEffect(() => {
    toast({
      duration: 4000,
      className:
        "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
      title: "Your email has been confirmed!",
      variant: "green",
    });
    setAuthScreen(AuthScreen.LOGIN);
    redirect(returnTo);
  }, [returnTo, setAuthScreen, toast]);
}
