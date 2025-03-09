import { useState, useTransition } from 'react';
import {
    isValidCanadianPhoneNumber,
    isValidateName
} from '../utils/validation';
import { isCorporateNumberValidAsync } from '../utils/validation-backend';
import './OnboardingForm.css';
import { OnboardFormSubmitRes, submitOnboardingFrom } from '../actions/submit-onboarding-form';

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
        if(submitStatus !== null) {
            setSubmitStatus(null);
        }
        return () => {
            const removeMatchedField = (prev: string[]) => prev.filter(fieldName => fieldName !== fieldNameInput);
            setInvalidField(removeMatchedField);
            if (untouchedFields.includes(fieldNameInput)) {
                setUntouchedFields(removeMatchedField);
            }
        }
    }

    return <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-fieldset">
            <label htmlFor="firstName" className="form-label">
                First Name:
            </label>
            <input
                type="text"
                id="firstName"
                name="firstName"
                className={`form-input`}
                onBlur={handleBlur('firstName', isValidateName)}
                onFocus={handleFocus('firstName')}
                maxLength={50}
            />
            <span className={`error-message ${invalidFields.includes('firstName') ? "visible" : ''}`}>Required</span>
        </div>
        <div className="form-fieldset">
            <label htmlFor="lastName" className="form-label">
                Last Name:
            </label>
            <input
                type="text"
                id="lastName"
                name="lastName"
                className={`form-input`}
                onBlur={handleBlur('lastName', isValidateName)}
                onFocus={handleFocus('lastName')}
                maxLength={50}
            />
            <span className={`error-message ${invalidFields.includes('lastName') ? "visible" : ''}`}>Required</span>
        </div>
        <div className="form-fieldset full-width">
            <label htmlFor="phone" className="form-label">
                Phone Number:
            </label>
            <input
                type="text"
                name="phone"
                id="phone"
                className={`form-input`}
                onBlur={handleBlur('phone', isValidCanadianPhoneNumber)}
                onFocus={handleFocus('phone')}
                maxLength={12}
            />
            <span className={`error-message ${invalidFields.includes('phone') ? "visible" : ''}`}>"+" is required and only canadien numbers</span>
        </div>
        <div className="form-fieldset full-width" >
            <label htmlFor="corporationNumber" className="form-label">
                Corporation Number:
            </label>
            <input
                type="text"
                id="corporationNumber"
                name="corporationNumber"
                className={`form-input`}
                onBlur={handleBlur('corporationNumber', isCorporateNumberValidAsync)}
                onFocus={handleFocus('corporationNumber')}
                maxLength={9}
            />
            <span className={`error-message ${invalidFields.includes('corporationNumber') ? "visible" : ''}`}>Invalid corporation number</span>
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