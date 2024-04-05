import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import Footer from "@/src/app/_components/footer/Footer";

test("Footer renders properly", () => {
  const { getAllByTestId } = render(<Footer />);

  const divElement = getAllByTestId("footer");

  console.log(divElement[0].children);

  expect(divElement[0].children.length).toBeGreaterThanOrEqual(4);
});
