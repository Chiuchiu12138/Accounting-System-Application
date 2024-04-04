"use client";

import Link from "next/link";
import { useContext } from "react";
import { AuthContext, AuthScreen } from "../../_providers/AuthProvider";

export default function Navbar() {
  const { setAuthScreen } = useContext(AuthContext);

  return (
    <div className="mt-40 flex w-full flex-col items-center justify-evenly gap-5 text-center sm:flex-row sm:items-start sm:text-left print:hidden">
      {/* Title/Slogan */}
      <div className="flex max-w-72 flex-col">
        <span className={"mb-4 font-alumniSans text-6xl font-gigabold"}>
          BookBreeze
          <span className="icon-[fluent-emoji-flat--copyright] ml-2 mt-3 h-4 w-4 align-top text-black"></span>
        </span>
        <span className="text-sm">Empower Your Finances, Simplify Your Success.</span>
      </div>
      {/* Column 1 */}
      <div className="flex flex-col">
        <span className="mb-4 font-dmSans text-xl font-semibold">Account</span>
        <div
          className="mb-2 cursor-pointer text-sm"
          onClick={() => {
            setAuthScreen(AuthScreen.SIGNUP);
          }}
        >
          Sign Up
        </div>
        <div
          className="mb-2 cursor-pointer text-sm"
          onClick={() => {
            setAuthScreen(AuthScreen.LOGIN);
          }}
        >
          Log In
        </div>
        <div
          className="mb-2 cursor-pointer text-sm"
          onClick={() => {
            setAuthScreen(AuthScreen.FORGOTPASSWORD);
          }}
        >
          Forgot Password
        </div>
      </div>
      {/* Column 2 */}
      <div className="flex flex-col">
        <span className="mb-4 font-dmSans text-xl font-semibold">Navigation</span>
        <Link className="mb-2 text-sm" href="/">
          Home
        </Link>
        <Link className="mb-2 text-sm" href="/dashboard">
          Dashboard
        </Link>
      </div>
      {/* Column 3 */}
      <div className="flex flex-col">
        <span className="mb-4 font-dmSans text-xl font-semibold">Tools</span>
        <Link className="mb-2 text-sm" href="/receivable/client-payment">
          Client Payment
        </Link>
        <Link className="mb-2 text-sm" href="/payable/client-payment">
          Supplier Payment
        </Link>
        <Link className="mb-2 text-sm" href="/reports/chart-of-account">
          Chart of Account
        </Link>
      </div>
    </div>
  );
}
