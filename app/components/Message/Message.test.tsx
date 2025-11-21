import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

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
  summarise: jest.fn().mockResolvedValue([]),
  elaborate: jest.fn().mockResolvedValue([]),
  refineQuery: jest.fn().mockResolvedValue([]),
  generateFollowUps: jest.fn().mockResolvedValue([]),
  generateFollowUpQs: jest.fn().mockResolvedValue([]),
}));

import Message from "./Message";
import AllProviders from "@/app/providers/AllProviders";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

const ChatHistoryType = {
  question: "Test question",
  answer: "Test answer",
  refined: false,
  generated: false,
};

const TestMessage = () => (
  <AllProviders>
    <Message
      message={ChatHistoryType}
      setLoadedChatHistory={() => {}}
      setTyping={() => {}}
    />
  </AllProviders>
);

describe("Message renders", () => {
  it("Message container is present in document body", () => {
    render(<TestMessage />);
    const messageQuestion = screen.getByTestId("message-container");
    expect(messageQuestion).toBeInTheDocument();
  });
});
