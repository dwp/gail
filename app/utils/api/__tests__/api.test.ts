import "@testing-library/jest-dom";
import {
  sendQuery,
  summarise,
  elaborate,
  refineQuery,
  generateFollowUps,
} from "../api";
import type { Citations } from "@/app/types";

// Mock the imported functions from "./"
jest.mock("../", () => ({
  generateFollowUpQs: jest.fn(),
  sendQueryMessage: jest.fn(),
  summariseQuery: jest.fn(),
  elaborateQuery: jest.fn(),
}));

// Import the mocked functions to access their mock implementations
import {
  generateFollowUpQs,
  sendQueryMessage,
  summariseQuery,
  elaborateQuery,
} from "../";

// Cast to jest.MockedFunction for TypeScript support
const mockGenerateFollowUpQs = generateFollowUpQs as jest.MockedFunction<
  typeof generateFollowUpQs
>;
const mockSendQueryMessage = sendQueryMessage as jest.MockedFunction<
  typeof sendQueryMessage
>;
const mockSummariseQuery = summariseQuery as jest.MockedFunction<
  typeof summariseQuery
>;
const mockElaborateQuery = elaborateQuery as jest.MockedFunction<
  typeof elaborateQuery
>;

describe("API utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("sendQuery", () => {
    it("should call sendQueryMessage with correct parameters and return chat history", async () => {
      const mockChatHistory = [{ question: "test", answer: "response" }];
      mockSendQueryMessage.mockResolvedValue(mockChatHistory);

      const query = "What is the weather?";
      const location = "New York";

      const result = await sendQuery(query, location);

      expect(mockSendQueryMessage).toHaveBeenCalledWith(query, location);
      expect(mockSendQueryMessage).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockChatHistory);
    });

    it("should handle empty query and location", async () => {
      const mockChatHistory: any[] = [];
      mockSendQueryMessage.mockResolvedValue(mockChatHistory);

      const result = await sendQuery("", "");

      expect(mockSendQueryMessage).toHaveBeenCalledWith("", "");
      expect(result).toEqual(mockChatHistory);
    });
  });

  describe("summarise", () => {
    it("should call summariseQuery with correct location and return chat history", async () => {
      const mockChatHistory = [{ question: "summarise", answer: "summary" }];
      mockSummariseQuery.mockResolvedValue(mockChatHistory);

      const location = "London";

      const result = await summarise(location);

      expect(mockSummariseQuery).toHaveBeenCalledWith(location);
      expect(mockSummariseQuery).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockChatHistory);
    });

    it("should handle empty location", async () => {
      const mockChatHistory: any[] = [];
      mockSummariseQuery.mockResolvedValue(mockChatHistory);

      const result = await summarise("");

      expect(mockSummariseQuery).toHaveBeenCalledWith("");
      expect(result).toEqual(mockChatHistory);
    });
  });

  describe("elaborate", () => {
    it("should call elaborateQuery with correct location and return chat history", async () => {
      const mockChatHistory = [
        { question: "elaborate", answer: "detailed response" },
      ];
      mockElaborateQuery.mockResolvedValue(mockChatHistory);

      const location = "Paris";

      const result = await elaborate(location);

      expect(mockElaborateQuery).toHaveBeenCalledWith(location);
      expect(mockElaborateQuery).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockChatHistory);
    });
  });

  describe("refineQuery", () => {
    it("should call summarise when type is 'summarise'", async () => {
      const mockChatHistory = [{ question: "test", answer: "summary" }];
      mockSummariseQuery.mockResolvedValue(mockChatHistory);

      const location = "Tokyo";
      const result = await refineQuery("summarise", location);

      expect(mockSummariseQuery).toHaveBeenCalledWith(location);
      expect(mockElaborateQuery).not.toHaveBeenCalled();
      expect(result).toEqual(mockChatHistory);
    });

    it("should call elaborate when type is 'elaborate'", async () => {
      const mockChatHistory = [
        { question: "test", answer: "elaborated response" },
      ];
      mockElaborateQuery.mockResolvedValue(mockChatHistory);

      const location = "Berlin";
      const result = await refineQuery("elaborate", location);

      expect(mockElaborateQuery).toHaveBeenCalledWith(location);
      expect(mockSummariseQuery).not.toHaveBeenCalled();
      expect(result).toEqual(mockChatHistory);
    });

    it("should return empty array when summarise returns null/undefined", async () => {
      mockSummariseQuery.mockResolvedValue(null as any);

      const result = await refineQuery("summarise", "location");

      expect(result).toEqual([]);
    });

    it("should return empty array when elaborate returns null/undefined", async () => {
      mockElaborateQuery.mockResolvedValue(undefined as any);

      const result = await refineQuery("elaborate", "location");

      expect(result).toEqual([]);
    });

    it("should return empty array for invalid type", async () => {
      const result = await refineQuery("invalid" as any, "location");

      expect(result).toEqual([]);
      expect(mockSummariseQuery).not.toHaveBeenCalled();
      expect(mockElaborateQuery).not.toHaveBeenCalled();
    });
  });

  describe("generateFollowUps", () => {
    it("should call generateFollowUpQs with correct parameters and return chat history", async () => {
      const mockChatHistory = [
        { question: "follow-up", answer: "follow-up response" },
      ];
      mockGenerateFollowUpQs.mockResolvedValue(mockChatHistory);

      const question = "What is AI?";
      const answer = "AI is artificial intelligence";
      const citations: Citations = [
        { title: "Wikipedia", url: "https://wikipedia.org", chunks: "" },
      ];
      const location = "San Francisco";

      const result = await generateFollowUps(
        question,
        answer,
        citations,
        location,
      );

      expect(mockGenerateFollowUpQs).toHaveBeenCalledWith(
        question,
        answer,
        citations,
        location,
      );
      expect(mockGenerateFollowUpQs).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockChatHistory);
    });

    it("should handle empty parameters", async () => {
      const mockChatHistory: any[] = [];
      mockGenerateFollowUpQs.mockResolvedValue(mockChatHistory);

      const result = await generateFollowUps("", "", [], "");

      expect(mockGenerateFollowUpQs).toHaveBeenCalledWith("", "", [], "");
      expect(result).toEqual(mockChatHistory);
    });

    it("should handle complex citations object", async () => {
      const mockChatHistory = [
        { question: "complex", answer: "complex response" },
      ];
      mockGenerateFollowUpQs.mockResolvedValue(mockChatHistory);

      const citations: Citations = [
        { title: "Source 1", url: "https://example1.com", chunks: "Title 1" },
        { title: "Source 2", url: "https://example2.com", chunks: "Title 2" },
      ];

      const result = await generateFollowUps(
        "Complex question",
        "Complex answer",
        citations,
        "Complex location",
      );

      expect(mockGenerateFollowUpQs).toHaveBeenCalledWith(
        "Complex question",
        "Complex answer",
        citations,
        "Complex location",
      );
      expect(result).toEqual(mockChatHistory);
    });
  });

  describe("Error handling", () => {
    it("should propagate errors from sendQueryMessage", async () => {
      const error = new Error("sendQueryMessage failed");
      mockSendQueryMessage.mockRejectedValue(error);

      await expect(sendQuery("test", "location")).rejects.toThrow(
        "sendQueryMessage failed",
      );
    });

    it("should propagate errors from summariseQuery", async () => {
      const error = new Error("summariseQuery failed");
      mockSummariseQuery.mockRejectedValue(error);

      await expect(summarise("location")).rejects.toThrow(
        "summariseQuery failed",
      );
    });

    it("should propagate errors from elaborateQuery", async () => {
      const error = new Error("elaborateQuery failed");
      mockElaborateQuery.mockRejectedValue(error);

      await expect(elaborate("location")).rejects.toThrow(
        "elaborateQuery failed",
      );
    });

    it("should propagate errors from refineQuery when summarise fails", async () => {
      const error = new Error("refine summarise failed");
      mockSummariseQuery.mockRejectedValue(error);

      await expect(refineQuery("summarise", "location")).rejects.toThrow(
        "refine summarise failed",
      );
    });

    it("should propagate errors from refineQuery when elaborate fails", async () => {
      const error = new Error("refine elaborate failed");
      mockElaborateQuery.mockRejectedValue(error);

      await expect(refineQuery("elaborate", "location")).rejects.toThrow(
        "refine elaborate failed",
      );
    });

    it("should propagate errors from generateFollowUpQs", async () => {
      const error = new Error("generateFollowUpQs failed");
      mockGenerateFollowUpQs.mockRejectedValue(error);

      await expect(
        generateFollowUps("question", "answer", [], "location"),
      ).rejects.toThrow("generateFollowUpQs failed");
    });
  });
});
