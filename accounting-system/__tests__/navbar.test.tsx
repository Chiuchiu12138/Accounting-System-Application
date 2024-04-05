import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "@/src/app/_components/navbar/Navbar";

test("Navbar renders properly", () => {
  const { getAllByTestId } = render(<Navbar />);

  const divElement = getAllByTestId("navbar");

  expect(divElement[0].children.length).toBeGreaterThanOrEqual(4);
});
