/**
 * @jest-environment jsdom
 */

import summariseQuery from "../summariseQuery";
import { MOCK_RESPONSE } from "@/app/constants/ApiTests";
import {
  calculateIndex,
  loadHistory,
  catchError,
  updateHistory,
} from "../../../utils";

beforeAll(() => {
  if (!("timeout" in AbortSignal)) {
    (AbortSignal as any).timeout = (ms: number) => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), ms);
      return controller.signal;
    };
  }
});

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      status: 200,
      json: () => Promise.resolve(data),
    })),
  },
}));

jest.mock("../../../utils", () => ({
  loadHistory: jest.fn(),
  addHistory: jest.fn(),
  calculateIndex: jest.fn(),
  updateHistory: jest.fn(),
  catchError: jest.fn(),
  capitalise: jest.fn(),
}));

describe("summariseQuery", () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    const sessionStorageMock = (() => {
      let store: Record<string, string> = {
        session_id: "mock-session-id-456",
      };
      return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          store = {};
        }),
      };
    })();

    Object.defineProperty(window, "sessionStorage", {
      value: sessionStorageMock,
      configurable: true,
    });

    fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue(MOCK_RESPONSE),
      ok: true,
      status: 200,
    } as any);
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    jest.resetAllMocks();
  });

  it("should successfully call fetch with the correct params", async () => {
    (loadHistory as jest.Mock).mockReturnValue([
      { question: "", answer: "", citations: [] },
    ]);
    (calculateIndex as jest.Mock).mockReturnValue(0);

    await summariseQuery("England");

    expect(fetch).toHaveBeenCalledWith("/api/summarise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "session-id": "mock-session-id-456",
      },
      body: JSON.stringify({
        prev_chat: {
          question: "",
          answer: "",
          citations: [],
        },
        location: "England",
      }),
      signal: expect.any(AbortSignal),
    });
  });

  it("should update chat history", async () => {
    (loadHistory as jest.Mock).mockReturnValue([
      { question: "original", answer: "original answer", citations: [] },
      { question: "refined question", answer: "", citations: [] },
    ]);

    (calculateIndex as jest.Mock).mockImplementation((type) =>
      type === "refine" ? 0 : 1,
    );

    await summariseQuery("England");

    expect(updateHistory).toHaveBeenCalledWith(
      expect.objectContaining({
        question: "refined question",
        refined: true,
        generated: false,
      }),
    );
  });

  it("should handle errors and call catchError", async () => {
    const mockErrorResponse = {
      error: "Internal Server Error",
      code: 500,
    };

    (loadHistory as jest.Mock).mockReturnValue([]);

    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue(mockErrorResponse),
    } as any);

    await summariseQuery("England");

    expect(catchError).toHaveBeenCalledWith(500);
  });

  it("should handle response with error field and call catchError with specific code", async () => {
    const mockErrorResponse = {
      error: "Bad Request",
      code: 400,
    };

    (loadHistory as jest.Mock).mockReturnValue([
      { question: "original", answer: "original answer", citations: [] },
    ]);
    (calculateIndex as jest.Mock).mockReturnValue(0);

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockErrorResponse),
    } as any);

    await summariseQuery("England");

    expect(catchError).toHaveBeenCalledWith(400);
  });
});
