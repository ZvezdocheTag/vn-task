import {
    isValidCanadianPhoneNumber,
    isValidateName
} from '../utils/validation';
import { isCorporateNumberValidAsync } from '../utils/validation-backend';
import './OnboardingForm.css';
import Input from './Input';
import { useForm } from '../hooks/use-form.ts'

function OnboardingForm() {
    const [
        isPending, 
        handleSubmit, 
        handleBlur, 
        handleFocus, 
        invalidFields,
        submitStatus
    ] = useForm();

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