import { OnbordinForm } from "../onboarding-form/OnboardingForm";

const serverUrl = import.meta.env.VITE_BACKEND_API;

export interface OnboardFormSubmitRes {
    status: "succeeded" | "error";
    message?: string;
}

export const submitOnboardingFrom = async (formObject: OnbordinForm): Promise<OnboardFormSubmitRes> => {
    const result = await fetch(`${serverUrl}profile-details`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
    });
    console.log(result, "result")
    if (result.status === 400) {
        const body = await result.json();
        return {
            status: "error",
            ...body
        }
    }

    return { status: "succeeded", message: "Form successfully submitted" };
};
