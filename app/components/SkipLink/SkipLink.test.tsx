import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SkipLink from "./SkipLink";
import { usePathname } from "next/navigation";
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

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("SkipLink renders correctly", () => {
  it("SkipLink text renders correctly", () => {
    render(
      <AllProviders>
        <SkipLink />
      </AllProviders>,
    );
    const skiplink = screen.getAllByTestId("skip-link");
    expect(skiplink[0]).toBeInTheDocument();
  });
});

describe("SkipLink Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders SkipLink with href="#main" when the pathname is "/"', () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    render(
      <AllProviders>
        <SkipLink />
      </AllProviders>,
    );
    const skiplink = screen.getAllByTestId("skip-link");
    expect(skiplink[0]).toBeInTheDocument();
    expect(skiplink[0]).toHaveAttribute("href", "#main");
  });
});
