import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Card from "./Card";

const onClick = jest.fn();
const TEST_QUESTION =
  "What support is available for someone out of work to get help with a CV or work experience?";

describe("Card renders correctly", () => {
  it("Card renders text correctly", () => {
    render(<Card onClick={onClick} text={TEST_QUESTION} />);
    const card = screen.getByText(TEST_QUESTION);
    expect(card.innerHTML).toEqual(TEST_QUESTION);
  });
});

describe("onclick handler runs", () => {
  it("onclick runs", () => {
    render(<Card onClick={onClick} text={TEST_QUESTION} />);
    const card = screen.getByText(TEST_QUESTION);
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalled();
  });
});
