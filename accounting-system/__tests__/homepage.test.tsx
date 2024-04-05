import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import Homepage from "@/src/app/page";

test("Homepage renders properly", () => {
  const { getAllByTestId } = render(<Homepage />);

  const divElement = getAllByTestId("homepage");

  expect(divElement[0].children.length).toBeGreaterThanOrEqual(4);
});
