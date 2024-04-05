import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import ChartOfAccount from "@/src/app/reports/chart-of-account/page";

test("ChartOfAccount renders properly", () => {
  const { getAllByTestId } = render(<ChartOfAccount />);

  const divElement = getAllByTestId("chartofaccount");

  expect(divElement[0].children.length).toBeGreaterThanOrEqual(3);
});
