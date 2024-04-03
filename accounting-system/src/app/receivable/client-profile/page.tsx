"use client";

import ProfileSearchDialog from "../../_components/dialogs/receivable/ProfileSearchDialog";
import CreateProfileDialog from "../../_components/dialogs/receivable/CreateProfileDialog";
import { useState } from "react";
import { Client } from "@apiTypes/client/content-types/client/client";

export default function ClientInvoice() {
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();

  return (
    <div>
      <div className="mt-10 flex justify-between">
        <ProfileSearchDialog setSelectedClient={setSelectedClient}></ProfileSearchDialog>
        <CreateProfileDialog setSelectedClient={setSelectedClient}></CreateProfileDialog>
      </div>
      <div className="flex min-h-[60vh] w-full items-center">
        <div className="flex w-full flex-col gap-2 font-gigabold">
          <div className="flex gap-4">
            <div className="w-1/2">Client ID:</div>
            <div className="w-full rounded-lg bg-white p-2">{selectedClient ? selectedClient.id : "N/A"}</div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">Client Name:</div>
            <div className="w-full rounded-lg bg-white p-2">{selectedClient ? selectedClient.attributes.name : "N/A"}</div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">Tel #:</div>
            <div className="w-full rounded-lg bg-white p-2">{selectedClient ? selectedClient.attributes.phone : "N/A"}</div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">Email:</div>
            <div className="w-full rounded-lg bg-white p-2">{selectedClient ? selectedClient.attributes.email : "N/A"}</div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">Address:</div>
            <div className="w-full rounded-lg bg-white p-2">{selectedClient ? selectedClient.attributes.address : "N/A"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
