import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OnboardingForm from "./OnboardingForm";
import { describe, it, expect, vi, beforeEach } from "vitest";
import '@testing-library/jest-dom';

describe("OnboardingForm Input", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("validate name input", () => {
    render(<OnboardingForm />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(4);

    const firstNameInput = inputs[0];
    const nextBlock = firstNameInput.nextElementSibling;
    expect(nextBlock).toHaveClass('error-message');
    expect(nextBlock).not.toHaveClass('visible');

    firstNameInput.focus();
    expect(firstNameInput).toHaveFocus();
    fireEvent.change(firstNameInput, { target: { value: "Hello" } });
    expect(firstNameInput).toHaveValue("Hello");
    fireEvent.change(firstNameInput, { target: { value: "" } });
    expect(firstNameInput).toHaveValue("");
    firstNameInput.blur();

    waitFor(() => {
      expect(nextBlock).toHaveClass('visible');
    });    
  });
});