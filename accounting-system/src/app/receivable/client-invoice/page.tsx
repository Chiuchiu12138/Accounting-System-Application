"use client";

import { useState } from "react";
import { Button } from "../../_components/shadcn/button";
import ClientSearchDialog from "../../_components/dialogs/ClientSearchDialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../_components/shadcn/table";

export default function ClientInvoice() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const items = [
    {
      id: "235253",
      name: "Lettuce",
      description: "Very nice romain lettuce",
      unitPrice: "$50.00",
      quantity: 10,
      lineTotal: "$500.00",
    },
    {
      id: "932847",
      name: "Tomato",
      description: "Fresh vine-ripened tomatoes",
      unitPrice: "$30.00",
      quantity: 8,
      lineTotal: "$240.00",
    },
    {
      id: "482930",
      name: "Carrot",
      description: "Organic carrots",
      unitPrice: "$20.00",
      quantity: 15,
      lineTotal: "$300.00",
    },
    {
      id: "578394",
      name: "Broccoli",
      description: "Fresh broccoli florets",
      unitPrice: "$40.00",
      quantity: 12,
      lineTotal: "$480.00",
    },
    {
      id: "293847",
      name: "Apple",
      description: "Crisp red apples",
      unitPrice: "$25.00",
      quantity: 20,
      lineTotal: "$500.00",
    },
    {
      id: "839201",
      name: "Banana",
      description: "Yellow bananas",
      unitPrice: "$15.00",
      quantity: 30,
      lineTotal: "$450.00",
    },
    {
      id: "109283",
      name: "Potato",
      description: "Golden potatoes",
      unitPrice: "$10.00",
      quantity: 25,
      lineTotal: "$250.00",
    },
    {
      id: "672910",
      name: "Strawberry",
      description: "Juicy strawberries",
      unitPrice: "$60.00",
      quantity: 5,
      lineTotal: "$300.00",
    },
    {
      id: "384756",
      name: "Orange",
      description: "Sweet oranges",
      unitPrice: "$35.00",
      quantity: 10,
      lineTotal: "$350.00",
    },
    {
      id: "847562",
      name: "Spinach",
      description: "Fresh spinach leaves",
      unitPrice: "$45.00",
      quantity: 8,
      lineTotal: "$360.00",
    },
    {
      id: "573819",
      name: "Cucumber",
      description: "Crisp cucumbers",
      unitPrice: "$20.00",
      quantity: 15,
      lineTotal: "$300.00",
    },
    {
      id: "294857",
      name: "Bell Pepper",
      description: "Colorful bell peppers",
      unitPrice: "$50.00",
      quantity: 10,
      lineTotal: "$500.00",
    },
    {
      id: "485726",
      name: "Grapes",
      description: "Sweet purple grapes",
      unitPrice: "$55.00",
      quantity: 7,
      lineTotal: "$385.00",
    },
    {
      id: "638274",
      name: "Pineapple",
      description: "Juicy pineapple chunks",
      unitPrice: "$75.00",
      quantity: 4,
      lineTotal: "$300.00",
    },
    {
      id: "728392",
      name: "Mango",
      description: "Ripe mangoes",
      unitPrice: "$65.00",
      quantity: 6,
      lineTotal: "$390.00",
    },
    {
      id: "384957",
      name: "Onion",
      description: "Sweet onions",
      unitPrice: "$15.00",
      quantity: 20,
      lineTotal: "$300.00",
    },
  ];

  return (
    <div>
      <div className="w-full bg-white p-8 rounded-lg mb-16">
        <div className="flex w-full justify-evenly">
          <div>Client ID: #532143</div>
          <div>Client Detail Here</div>
          <ClientSearchDialog></ClientSearchDialog>
        </div>
        <br></br>
        <div className="flex w-full justify-evenly">
          <div>Date: March 30, 2024</div>
          <div>Invoice ID: #285736</div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Item #</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead className="w-[100px]">Qty</TableHead>
            <TableHead className="text-right">Line Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.unitPrice}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell className="text-right">{item.lineTotal}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell className="text-right">
              $
              {items
                .reduce((accumulator, currentItem) => {
                  // Extracting the numerical value from unitPrice and lineTotal
                  const unitPrice = parseFloat(
                    currentItem.unitPrice.replace("$", "")
                  );
                  const lineTotal = parseFloat(
                    currentItem.lineTotal.replace("$", "")
                  );

                  // Adding the line total of the current item to the accumulator
                  return accumulator + lineTotal;
                }, 0)
                .toFixed(2)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Button className="ml-auto mt-10" variant="hightlighted">
        Enter An Invoice
      </Button>
    </div>
  );
}
