import { useState, useTransition } from 'react';
import {
    isValidCanadianPhoneNumber,
    isValidateName
} from '../utils/validation';
import { isCorporateNumberValidAsync } from '../utils/validation-backend';
import './OnboardingForm.css';
import { OnboardFormSubmitRes, submitOnboardingFrom } from '../actions/submit-onboarding-form';
import Input from './Input';

export type OnbordinForm = {
    firstName: string;
    lastName: string;
    phone: string;
    corporationNumber: string;
}

function OnboardingForm() {
    const [isPending, startTransition] = useTransition();
    const [invalidFields, setInvalidField] = useState<string[]>([]);
    const [untouchedFields, setUntouchedFields] = useState<string[]>([
        "firstName",
        "lastName",
        "phone",
        "corporationNumber"
    ]);
    const [submitStatus, setSubmitStatus] = useState<OnboardFormSubmitRes | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        startTransition(
            async () => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const formObject = Object.fromEntries(formData.entries()) as OnbordinForm;

                if (invalidFields.length === 0 && untouchedFields.length === 0) {
                    const result = await submitOnboardingFrom(formObject);
                    setSubmitStatus(result);
                } else {
                    setInvalidField(prev => [...new Set([...prev, ...untouchedFields])]);
                }
            });

    }

    const handleBlur = (fieldName: string, fnValidation: any | undefined | null) => {
        return async (e: React.FocusEvent<HTMLInputElement>) => {
            if (fnValidation && !await fnValidation(e.target.value.trim())) {
                setInvalidField(prev => [...new Set([...prev, fieldName])]);
            }
        }
    }

    const handleFocus = (fieldNameInput: string) => {
        return () => {
            if (submitStatus !== null) {
                setSubmitStatus(null);
            }
            const removeMatchedField = (prev: string[]) => prev.filter(fieldName => fieldName !== fieldNameInput);
            setInvalidField(removeMatchedField);
            if (untouchedFields.includes(fieldNameInput)) {
                setUntouchedFields(removeMatchedField);
            }
        }
    }

    return <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-fieldset">
            <Input
                id="firstName"
                label="First Name"
                handleBlur={handleBlur}
                handleFocus={handleFocus}
                isValid={invalidFields.includes('firstName')}
                validationFn={isValidateName}
                maxLength={50}
            />
        </div>
        <div className="form-fieldset">
            <Input
                id="lastName"
                label="Last Name"
                handleBlur={handleBlur}
                handleFocus={handleFocus}
                isValid={invalidFields.includes('lastName')}
                validationFn={isValidateName}
                maxLength={50}
            />
        </div>
        <div className="form-fieldset full-width">
            <Input
                id="phone"
                label="Phone Number"
                handleBlur={handleBlur}
                handleFocus={handleFocus}
                isValid={invalidFields.includes("phone")}
                validationFn={isValidCanadianPhoneNumber}
                maxLength={12}
                validationMessage={`"+" is required and only canadien numbers`}
            />
        </div>
        <div className="form-fieldset full-width" >
            <Input
                id="corporationNumber"
                label="Corporation Number"
                handleBlur={handleBlur}
                handleFocus={handleFocus}
                isValid={invalidFields.includes("corporationNumber")}
                validationFn={isCorporateNumberValidAsync}
                maxLength={9}
                validationMessage={`Invalid corporation number`}
            />
        </div>
        {submitStatus ?
            <div className={`form-fieldset full-width`}>
                <span className={`visible ${submitStatus.status === "succeeded" ? 'success-message' : 'error-message'}`}>{submitStatus.message}</span>
            </div> : null
        }
        <button type="submit" disabled={isPending} className={`submit-btn full-width ${isPending ? "loading" : ''}`}>
            <span>Submit</span>
            <div className="arrow">→</div>
            <div className="loader"></div>
        </button>
    </form>
}

export default OnboardingForm;