import { render, screen } from "@testing-library/react";
import OnboardingForm from "./OnboardingForm";
import { describe, it, expect, vi, beforeEach } from "vitest";
import '@testing-library/jest-dom';

vi.mock("./validators", () => ({
  isValidateName: vi.fn((value) => value.length >= 2),
  isValidCanadianPhoneNumber: vi.fn((value) => /^\d{10}$/.test(value)),
  isCorporateNumberValidAsync: vi.fn(async (value) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return /^\d{8}$/.test(value);
  }),
}));

vi.mock("./utils", () => ({
  sleep: vi.fn(() => Promise.resolve()),
}));

describe("OnboardingForm Component", () => {
  const invalidForm = {
    "firstName": "john",
    "lastName": "does",
    "phone": "+1437955992",
    "corporationNumber": "123456789"
  };

  const validForm = {
    "firstName": "john",
    "lastName": "does",
    "phone": "+14379559922",
    "corporationNumber": "123456789"
  }
  beforeEach(() => {
    // consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    console.log(invalidForm, validForm);
    vi.resetAllMocks();
  });

  it("renders all form fields", () => {
    render(<OnboardingForm />);

    expect(screen.getByText("First Name:")).toBeInTheDocument();
    expect(screen.getByText("Last Name:")).toBeInTheDocument();
    expect(screen.getByText("Phone Number:")).toBeInTheDocument();
    expect(screen.getByText("Corporation Number:")).toBeInTheDocument();

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(4);

    expect(inputs[0]).toHaveAttribute("name", "firstName");
    expect(inputs[1]).toHaveAttribute("name", "lastName");
    expect(inputs[2]).toHaveAttribute("name", "phone");
    expect(inputs[3]).toHaveAttribute("name", "corporationNumber");

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).not.toBeDisabled();
  });
});