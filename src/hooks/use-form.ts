import { useState, useTransition } from 'react';
import { OnboardFormSubmitRes, submitOnboardingFrom } from '../actions/submit-onboarding-form';

export type OnbordinForm = {
    firstName: string;
    lastName: string;
    phone: string;
    corporationNumber: string;
}

type UseFrom = [
    boolean, 
    (e: React.FormEvent<HTMLFormElement>) => Promise<void>, 
    any, 
    any, 
    string[], 
    OnboardFormSubmitRes | null
];

export function useForm(): UseFrom {
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

    return [isPending, handleSubmit, handleBlur, handleFocus, invalidFields, submitStatus]
}