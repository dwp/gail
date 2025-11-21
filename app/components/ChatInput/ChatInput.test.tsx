import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import AllProviders from "@/app/providers/AllProviders";

jest.mock("@/app/utils/api", () => ({
  sendQuery: jest.fn().mockResolvedValue([]),
  summarise: jest.fn().mockResolvedValue([]),
  elaborate: jest.fn().mockResolvedValue([]),
  refineQuery: jest.fn().mockResolvedValue([]),
  generateFollowUps: jest.fn().mockResolvedValue([]),
  generateFollowUpQs: jest.fn().mockResolvedValue([]),
}));

import ChatInput from "./ChatInput";

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

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
  jest.spyOn(console, "log").mockImplementation(jest.fn());
});

// Remove the global useState mock as it interferes with component functionality

const TestChatInputProps = {
  chatHistory: [],
  loadedChatHistory: [],
  setLoadedChatHistory: jest.fn(),
  typing: false,
  setTyping: jest.fn(),
  isModalOpen: false,
};

const TestChatInput = () => {
  return (
    <AllProviders>
      <ChatInput {...TestChatInputProps} />
    </AllProviders>
  );
};

describe("ChatInput renders correctly", () => {
  it("Text area is in document", () => {
    render(<TestChatInput />);
    const textAreaWrapper = screen.getByTestId("chat-input-text-area");
    expect(textAreaWrapper).toBeInTheDocument();
  });

  it("Text area to update and enter text", () => {
    const { getByTestId } = render(<TestChatInput />);
    const input = getByTestId("chat-window-input");

    fireEvent.change(input, { target: { value: "test input" } });
    expect((input as HTMLTextAreaElement).value).toBe("test input");

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
  });

  it("Text area to update and enter empty text", () => {
    const { getByTestId } = render(<TestChatInput />);
    const input = getByTestId("chat-window-input");

    fireEvent.change(input, { target: { value: "" } });
    expect((input as HTMLTextAreaElement).value).toBe("");

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
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

    render(<TestChatInput />);
    expect(mockGetItem).toHaveBeenCalledWith("location");
  });

  it("handles shift+enter without submitting", () => {
    const { getByTestId } = render(<TestChatInput />);
    const input = getByTestId("chat-window-input");

    fireEvent.change(input, { target: { value: "test input" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", shiftKey: true });

    // Should not clear the input when shift+enter is pressed
    expect((input as HTMLTextAreaElement).value).toBe("test input");
  });

  it("handles sendQuery with catch block", () => {
    const mockSetTyping = jest.fn();
    const mockSetLoadedChatHistory = jest.fn();

    render(
      <AllProviders>
        <ChatInput
          loadedChatHistory={[]}
          setLoadedChatHistory={mockSetLoadedChatHistory}
          typing={false}
          setTyping={mockSetTyping}
          isModalOpen={false}
        />
      </AllProviders>,
    );

    const input = screen.getByTestId("chat-window-input");
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockSetTyping).toHaveBeenCalledWith(true);
  });
});
