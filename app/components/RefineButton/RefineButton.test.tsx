/* eslint-disable @typescript-eslint/no-require-imports */
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/app/utils/api", () => ({
  sendQuery: jest.fn().mockResolvedValue([]),
  summarise: jest.fn().mockResolvedValue([]),
  elaborate: jest.fn().mockResolvedValue([]),
  refineQuery: jest.fn().mockResolvedValue([]),
  generateFollowUps: jest.fn().mockResolvedValue([]),
  generateFollowUpQs: jest.fn().mockResolvedValue([]),
}));

import RefineButton from "./RefineButton";

const ChatHistoryType = {
  question: "Test question",
  answer: "Test answer",
  refined: false,
  generated: false,
};

const TestButton = ({
  button,
}: {
  button: "summarise" | "elaborate" | "followup";
}) => (
  <RefineButton
    button={button}
    text={"Test"}
    setLoadedChatHistory={jest.fn()}
    setTyping={jest.fn()}
    message={ChatHistoryType}
    hasBeenRefined={false}
  />
);

describe("RefineButton renders", () => {
  it("Summarise Button is present in document body", () => {
    render(<TestButton button="summarise" />);
    const summariseButton = screen.getByTestId("refine-button-summarise");
    expect(summariseButton).toBeInTheDocument();
  });

  it("Elaborate Button is present in document body", () => {
    render(<TestButton button="elaborate" />);
    const summariseButton = screen.getByTestId("refine-button-elaborate");
    expect(summariseButton).toBeInTheDocument();
  });

  it("Followup Button is present in document body", () => {
    render(<TestButton button="followup" />);
    const summariseButton = screen.getByTestId("refine-button-followup");
    expect(summariseButton).toBeInTheDocument();
  });
});

describe("RefineButton functionality", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Calls refineQuery when summarise button is clicked", async () => {
    const mockSetTyping = jest.fn();
    const mockSetLoadedChatHistory = jest.fn();

    render(
      <RefineButton
        button="summarise"
        text="Test"
        setLoadedChatHistory={mockSetLoadedChatHistory}
        setTyping={mockSetTyping}
        message={ChatHistoryType}
        hasBeenRefined={false}
      />,
    );
    const summariseButton = screen.getByTestId("refine-button-summarise");

    fireEvent.click(summariseButton);

    await waitFor(() => {
      expect(mockSetTyping).toHaveBeenCalledWith(true);
      expect(mockSetTyping).toHaveBeenCalledWith(false);
    });
  });

  it("Calls refineQuery when elaborate button is clicked", async () => {
    const mockSetTyping = jest.fn();
    const mockSetLoadedChatHistory = jest.fn();
    render(
      <RefineButton
        button="elaborate"
        text="Test"
        setLoadedChatHistory={mockSetLoadedChatHistory}
        setTyping={mockSetTyping}
        message={ChatHistoryType}
        hasBeenRefined={false}
      />,
    );
    const elaborateButton = screen.getByTestId("refine-button-elaborate");

    fireEvent.click(elaborateButton);

    await waitFor(() => {
      expect(mockSetTyping).toHaveBeenCalledWith(true);
      expect(mockSetTyping).toHaveBeenCalledWith(false);
    });
  });

  it("Calls refineQuery when followup button is clicked", async () => {
    const mockSetTyping = jest.fn();
    const mockSetLoadedChatHistory = jest.fn();
    render(
      <RefineButton
        button="followup"
        text="Followup"
        setLoadedChatHistory={mockSetLoadedChatHistory}
        setTyping={mockSetTyping}
        message={ChatHistoryType}
        hasBeenRefined={false}
      />,
    );
    const followupButton = screen.getByTestId("refine-button-followup");

    fireEvent.click(followupButton);

    await waitFor(() => {
      expect(mockSetTyping).toHaveBeenCalledWith(true);
      expect(mockSetTyping).toHaveBeenCalledWith(false);
    });
  });
});

describe("RefineButton error handling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles refineQuery error for summarise button", async () => {
    const mockSetTyping = jest.fn();
    const mockSetLoadedChatHistory = jest.fn();
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    const { refineQuery } = require("@/app/utils/api");
    refineQuery.mockRejectedValue(new Error("API Error"));

    render(
      <RefineButton
        button="summarise"
        text="Test"
        setLoadedChatHistory={mockSetLoadedChatHistory}
        setTyping={mockSetTyping}
        message={ChatHistoryType}
        hasBeenRefined={false}
      />,
    );

    const button = screen.getByTestId("refine-button-summarise");
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      expect(mockSetTyping).toHaveBeenCalledWith(false);
    });

    consoleSpy.mockRestore();
  });

  it("handles refineQuery error for elaborate button", async () => {
    const mockSetTyping = jest.fn();
    const mockSetLoadedChatHistory = jest.fn();
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    const { refineQuery } = require("@/app/utils/api");
    refineQuery.mockRejectedValue(new Error("API Error"));

    render(
      <RefineButton
        button="elaborate"
        text="Test"
        setLoadedChatHistory={mockSetLoadedChatHistory}
        setTyping={mockSetTyping}
        message={ChatHistoryType}
        hasBeenRefined={false}
      />,
    );

    const button = screen.getByTestId("refine-button-elaborate");
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      expect(mockSetTyping).toHaveBeenCalledWith(false);
    });

    consoleSpy.mockRestore();
  });

  it("handles generateFollowUps error for followup button", async () => {
    const mockSetTyping = jest.fn();
    const mockSetLoadedChatHistory = jest.fn();
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    const { generateFollowUps } = require("@/app/utils/api");
    generateFollowUps.mockRejectedValue(new Error("API Error"));

    render(
      <RefineButton
        button="followup"
        text="Test"
        setLoadedChatHistory={mockSetLoadedChatHistory}
        setTyping={mockSetTyping}
        message={ChatHistoryType}
        hasBeenRefined={false}
      />,
    );

    const button = screen.getByTestId("refine-button-followup");
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      expect(mockSetTyping).toHaveBeenCalledWith(false);
    });

    consoleSpy.mockRestore();
  });
});
