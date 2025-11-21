import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AllProviders from "@/app/providers/AllProviders";

jest.mock("@/app/utils/api", () => ({
  sendQuery: jest.fn().mockResolvedValue([]),
  summarise: jest.fn().mockResolvedValue([]),
  elaborate: jest.fn().mockResolvedValue([]),
  refineQuery: jest.fn().mockResolvedValue([]),
  generateFollowUps: jest.fn().mockResolvedValue([]),
  generateFollowUpQs: jest.fn().mockResolvedValue([]),
}));

import Answer from "./Answer";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
  jest.spyOn(console, "log").mockImplementation(jest.fn());
});

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

const ChatHistoryType = {
  question: "Test question",
  answer: "Test answer",
  refined: false,
  generated: false,
  id: 1,
};

const errorMessage = {
  question: "Test question",
  answer:
    "Apologies, we had a technical issue. Please try again in few minutes",
  refined: false,
  generated: false,
  type: "error",
  citations: [],
};

const elaboratedMessage = {
  question: "Elaborate",
  answer: "Test elaborate answer",
  citations: [{ title: "Test", url: "test", chunks: "Test" }],
  refined: false,
  generated: false,
  id: 1,
};

const TestAnswer = () => (
  <AllProviders>
    <Answer
      message={ChatHistoryType}
      setLoadedChatHistory={() => {}}
      setTyping={() => {}}
    />
  </AllProviders>
);

describe("Answer renders", () => {
  it("Message Answer Container is present in document body", () => {
    render(<TestAnswer />);
    const messageAnswerContainer = screen.getByTestId(
      "message-answer-container",
    );
    expect(messageAnswerContainer).toBeInTheDocument();
  });

  it("renders the error message correctly", () => {
    render(
      <AllProviders>
        <Answer
          message={errorMessage}
          setLoadedChatHistory={() => {}}
          setTyping={() => {}}
        />
      </AllProviders>,
    );
    const errorElement = screen.getByText(
      /Apologies, we had a technical issue/,
    );
    expect(errorElement).toBeInTheDocument();
  });
});

describe("useState conditional renders", () => {
  it("renders AI disclaimer for summarised responses", () => {
    render(
      <AllProviders>
        <Answer
          message={{
            question: "Summarise",
            answer: "Test answer",
            citations: [{ title: "Test", url: "test", chunks: "Test" }],
            refined: false,
            generated: false,
            id: 1,
          }}
          setLoadedChatHistory={() => {}}
          setTyping={() => {}}
        />
      </AllProviders>,
    );

    const disclaimer = screen.getByTestId("ai-answer-disclaimer");
    expect(disclaimer).toHaveTextContent("AI created a shorter response");
  });

  it("renders AI disclaimer for elaborated responses", () => {
    render(
      <AllProviders>
        <Answer
          message={elaboratedMessage}
          setLoadedChatHistory={() => {}}
          setTyping={() => {}}
        />
      </AllProviders>,
    );

    const disclaimer = screen.getByTestId("ai-answer-disclaimer");
    expect(disclaimer).toHaveTextContent("AI created a more detailed response");
  });
});
