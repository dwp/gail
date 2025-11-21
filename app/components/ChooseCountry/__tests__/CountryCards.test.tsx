import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import CountryCards from "../CountryCards";
import { locations } from "../../Landing/config";

describe("CountryCards", () => {
  it("renders a card for each location and calls handler on click", () => {
    const onClickHandler = jest.fn();

    render(<CountryCards onClickHandler={onClickHandler} />);

    // All locations should render
    locations.forEach((loc) => {
      expect(screen.getByText(loc)).toBeInTheDocument();
    });

    // Click the first location and expect handler called with the location
    const first = locations[0];
    const node = screen.getByText(first);
    fireEvent.click(node);
    expect(onClickHandler).toHaveBeenCalledTimes(1);
    expect(onClickHandler).toHaveBeenCalledWith(first);
  });
});
