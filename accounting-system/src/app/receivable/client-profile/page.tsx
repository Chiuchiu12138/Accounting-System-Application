"use client";

import { useState } from "react";
import { Button } from "../../_components/shadcn/button";
import ProfileSearchDialog from "../../_components/dialogs/ProfileSearchDialog";

export default function ClientInvoice() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div>
      <div className="flex mt-10 justify-between">
        <ProfileSearchDialog></ProfileSearchDialog>
        <Button variant="hightlighted">Create New</Button>
      </div>
      <div className="min-h-[60vh] flex items-center w-full">
        <div className="flex flex-col font-gigabold gap-2 w-full">
          <div className="flex gap-4">
            <div className="w-1/2">Client ID:</div>
            <div className="w-full bg-white p-2 rounded-lg"></div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">Client Name:</div>
            <div className="w-full bg-white p-2 rounded-lg"></div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">Tel #:</div>
            <div className="w-full bg-white p-2 rounded-lg"></div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">Email:</div>
            <div className="w-full bg-white p-2 rounded-lg"></div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">Address:</div>
            <div className="w-full bg-white p-2 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
