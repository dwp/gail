import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import AllProviders from "@/app/providers/AllProviders";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

jest.mock("@/app/utils/api", () => ({
  sendQuery: jest.fn().mockResolvedValue([]),
}));

import ExampleQuestions from "./ExampleQuestions";

const TestExampleQuestions = () => (
  <AllProviders>
    <ExampleQuestions setTyping={() => {}} setLoadedChatHistory={() => {}} />
  </AllProviders>
);

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
  jest.spyOn(console, "log").mockImplementation(jest.fn());
});

describe("Example questions render correctly", () => {
  it("Example questions label renders correctly", () => {
    render(<TestExampleQuestions />);
    const label = screen.getByText("Example questions");
    expect(label.innerHTML).toEqual("Example questions");
  });

  it("There should be 4 example questions", () => {
    render(<TestExampleQuestions />);
    const grid = screen.getByTestId("example-questions-grid");
    const children = grid.childNodes;
    expect(children.length).toEqual(4);
  });
});

describe("Clicking an example question", () => {
  it("React state functions are called", () => {
    const setTyping = jest.fn();
    const setLoadedChatHistory = jest.fn();
    render(
      <ExampleQuestions
        setTyping={setTyping}
        setLoadedChatHistory={setLoadedChatHistory}
      />,
    );

    const question = screen.getAllByTestId("card-text")[0];
    fireEvent.click(question);
    expect(setLoadedChatHistory).toHaveBeenCalled();
    expect(setTyping).toHaveBeenCalled();
  });

  it("handles sessionStorage location", () => {
    // Mock sessionStorage
    const mockGetItem = jest.fn().mockReturnValue("test-location");
    Object.defineProperty(window, "sessionStorage", {
      value: {
        getItem: mockGetItem,
      },
      writable: true,
    });

    render(<TestExampleQuestions />);
    expect(mockGetItem).toHaveBeenCalledWith("location");
  });
});
