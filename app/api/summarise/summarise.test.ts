/**
 * @jest-environment node
 */

import "@testing-library/jest-dom";
import { NextRequest, NextResponse } from "next/server";

import { POST } from "./route";
const { NEXT_PUBLIC_BASE_URL } = process.env;

const MOCK_RESPONSE = [
  { question: "", answer: "", citations: [], error: "", code: 200, type: "" },
];

const MOCK_BODY = {
  prev_chat: {
    historyObject: { ...MOCK_RESPONSE },
    citations: [],
  },
};

describe("POST /api/summarise", () => {
  let fetchSpy: jest.SpyInstance;
  let jsonMock: jest.SpyInstance;

  beforeEach(() => {
    // Spy on the global fetch method
    fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue(MOCK_BODY),
      ok: true,
      status: 200,
    } as any);

    // Mock NextResponse.json to return a valid JSON response

    jsonMock = jest.spyOn(NextResponse, "json").mockReturnValue({
      status: 200,
      json: jest.fn().mockResolvedValue(MOCK_RESPONSE),
    } as any);
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    jsonMock.mockRestore(); // Restore the original NextResponse.json method after each test
  });

  it("handles POST request and returns a JSON response", async () => {
    const body = MOCK_BODY;

    // Mock the NextRequest with necessary properties
    const req = {
      json: jest.fn().mockResolvedValue(body),
      method: "POST",
      headers: {
        get: jest.fn().mockReturnValue("application/json"),
      },
      url: `${NEXT_PUBLIC_BASE_URL}/api/summarise`,
    } as unknown as NextRequest;

    // Call the POST method with the mock request object
    const response = await POST(req);
    const json = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(json).toEqual(MOCK_RESPONSE);

    // Ensure fetch was called with the correct arguments
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(`${NEXT_PUBLIC_BASE_URL}/summarise`, {
      method: "POST",
      body: JSON.stringify(MOCK_BODY),
      headers: {
        "Content-Type": "application/json",
        "x-access-token": "application/json",
        "session-id": "application/json",
      },
    });
  });
});

describe("POST /api/summarise - Error Handling", () => {
  let fetchSpy: jest.SpyInstance;
  let jsonMock: jest.SpyInstance;

  beforeEach(() => {
    // Mock the global fetch method to throw an error
    fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() => {
      throw new Error("Network Error|500");
    });

    // Mock NextResponse.json to return an error response
    jsonMock = jest.spyOn(NextResponse, "json").mockReturnValue({
      status: 500,
      json: jest.fn().mockResolvedValue({
        error: "Network Error",
        code: 500,
      }),
    } as any);
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    jsonMock.mockRestore(); // Restore the original NextResponse.json method after each test
  });

  it("returns an error response when an exception is thrown", async () => {
    const body = MOCK_BODY;

    // Mock the NextRequest with necessary properties
    const req = {
      json: jest.fn().mockResolvedValue(body),
      method: "POST",
      headers: {
        get: jest.fn().mockReturnValue("application/json"),
      },
      url: `${NEXT_PUBLIC_BASE_URL}/api/summarise`,
    } as unknown as NextRequest;

    // Call the POST method with the mock request object
    const response = await POST(req);

    // Assertions
    expect(response.status).toBe(500);
    expect(jsonMock).toHaveBeenCalledWith(
      {
        error: "Network Error",
        code: 500,
      },
      { status: 500 },
    );
  });
});

describe("POST /api/summarise - Error Handling for !response.ok", () => {
  let fetchSpy: jest.SpyInstance;
  let jsonMock: jest.SpyInstance;

  beforeEach(() => {
    // Mock the fetch call to simulate a failed response
    fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({ message: "Internal Server Error" }),
    } as any);

    // Mock NextResponse.json to handle the response
    jsonMock = jest.spyOn(NextResponse, "json").mockReturnValue({
      status: 500,
      json: jest.fn().mockResolvedValue({
        error: "Internal Server Error",
        code: 500,
      }),
    } as any);
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    jsonMock.mockRestore(); // Restore the original NextResponse.json method after each test
  });

  it("throws an error and returns a JSON response when response.ok is false", async () => {
    const body = MOCK_BODY;

    // Mock the NextRequest with necessary properties
    const req = {
      json: jest.fn().mockResolvedValue(body),
      method: "POST",
      headers: {
        get: jest.fn().mockReturnValue("application/json"),
      },
      url: `${NEXT_PUBLIC_BASE_URL}/api/summarise`,
    } as unknown as NextRequest;

    // Call the POST method with the mock request object
    const response = await POST(req);

    // Assertions
    expect(response.status).toBe(500);
    expect(jsonMock).toHaveBeenCalledWith(
      {
        error: "Internal Server Error",
        code: 500,
      },
      { status: 500 },
    );
  });
});
