import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@/app/utils/api", () => ({
  sendQuery: jest.fn().mockResolvedValue([]),
  summarise: jest.fn().mockResolvedValue([]),
  elaborate: jest.fn().mockResolvedValue([]),
  refineQuery: jest.fn().mockResolvedValue([]),
  generateFollowUps: jest.fn().mockResolvedValue([]),
  generateFollowUpQs: jest.fn().mockResolvedValue([]),
}));

import FollowUps from "./FollowUps";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
  jest.spyOn(console, "log").mockImplementation(jest.fn());
});

const setLoadedChatHistory = jest.fn();
const setTyping = jest.fn();

const TestFollowUps = () => (
  <FollowUps
    followUpQs={["question"]}
    setLoadedChatHistory={setLoadedChatHistory}
    setTyping={setTyping}
  />
);

describe("FollowUps renders", () => {
  it("FollowUps Questions is present in document body", () => {
    render(<TestFollowUps />);
    const followupQuestion = screen.getByTestId("followup-question");
    expect(followupQuestion).toBeInTheDocument();
  });
});

describe("Event listeners run", () => {
  it("onClick runs", () => {
    render(<TestFollowUps />);
    const button = screen.getByTestId("followup-question");
    fireEvent.click(button);
    expect(setLoadedChatHistory).toHaveBeenCalled();
    expect(setLoadedChatHistory).toHaveBeenCalledWith(expect.any(Function));
    const callback = setLoadedChatHistory.mock.calls[0][0];
    const newState = callback([]);
    expect(newState).toEqual([{ question: expect.any(String) }]);
  });
});
