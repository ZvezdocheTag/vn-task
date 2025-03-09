import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OnboardingForm from "./OnboardingForm";
import { describe, it, expect } from "vitest";
import '@testing-library/jest-dom';

describe("OnboardingForm Component", () => {
  it("submit the form with valid fields", () => {
    render(<OnboardingForm />);

    const firstNameInput = screen.getByLabelText(/First Name:/i);
    const lastNameInput = screen.getByLabelText(/Last Name:/i);
    const phoneInput = screen.getByLabelText(/Phone Number:/i);
    const corpNumberInput = screen.getByLabelText(/Corporation Number:/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    firstNameInput.focus();
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.blur(firstNameInput);

    lastNameInput.focus();
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.blur(lastNameInput);

    phoneInput.focus();
    fireEvent.change(phoneInput, { target: { value: '+14165551234' } });
    fireEvent.blur(phoneInput);

    corpNumberInput.focus();
    fireEvent.change(corpNumberInput, { target: { value: '123456789' } });
    fireEvent.blur(corpNumberInput);

    // Verify all inputs have the correct values
    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('Doe');
    expect(phoneInput).toHaveValue('+14165551234');
    expect(corpNumberInput).toHaveValue('123456789');

    expect(firstNameInput.nextElementSibling).toHaveClass('error-message');
    expect(firstNameInput.nextElementSibling).not.toHaveClass('visible');

    expect(lastNameInput.nextElementSibling).toHaveClass('error-message');
    expect(lastNameInput.nextElementSibling).not.toHaveClass('visible');

    expect(phoneInput.nextElementSibling).toHaveClass('error-message');
    expect(phoneInput.nextElementSibling).not.toHaveClass('visible');

    expect(corpNumberInput.nextElementSibling).toHaveClass('error-message');
    expect(corpNumberInput.nextElementSibling).not.toHaveClass('visible');

    fireEvent.click(submitButton);
  });


  it("submit the form with invalid phoneInput and lastName fields", async () => {
    render(<OnboardingForm />);
  
    const firstNameInput = screen.getByLabelText(/First Name:/i);
    const lastNameInput = screen.getByLabelText(/Last Name:/i);
    const phoneInput = screen.getByLabelText(/Phone Number:/i);
    const corpNumberInput = screen.getByLabelText(/Corporation Number:/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
  
    firstNameInput.focus();
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.blur(firstNameInput);
  
    lastNameInput.focus();
    fireEvent.blur(lastNameInput);
  
    phoneInput.focus();
    fireEvent.blur(phoneInput);
  
    corpNumberInput.focus();
    fireEvent.change(corpNumberInput, { target: { value: '123456789' } });
    fireEvent.blur(corpNumberInput);
  
    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('');
    expect(phoneInput).toHaveValue('');
    expect(corpNumberInput).toHaveValue('123456789');
  
    await waitFor(() => {
      expect(firstNameInput.nextElementSibling).toHaveClass('error-message');
      expect(firstNameInput.nextElementSibling).not.toHaveClass('visible');
      
      expect(corpNumberInput.nextElementSibling).toHaveClass('error-message');
      expect(corpNumberInput.nextElementSibling).not.toHaveClass('visible');
      
      expect(lastNameInput.nextElementSibling).toHaveClass('error-message');
      expect(lastNameInput.nextElementSibling).toHaveClass('visible');
      
      expect(phoneInput.nextElementSibling).toHaveClass('error-message');
      expect(phoneInput.nextElementSibling).toHaveClass('visible');
    });
  
    expect(lastNameInput.nextElementSibling).toHaveTextContent('Required');
    expect(phoneInput.nextElementSibling).toHaveTextContent('"+" is required and only canadien numbers');
  
    fireEvent.click(submitButton);
  });
});