type ValidationFunction = (value: string) => boolean | Promise<boolean>;

function Input({
    id,
    label,
    handleBlur,
    handleFocus,
    validationFn,
    isValid,
    validationMessage,
    maxLength
}: {
    id: string;
    label: string;
    handleBlur: (fieldName: string, fnValidation: ValidationFunction | null | undefined) =>
        (e: React.FocusEvent<HTMLInputElement>) => Promise<void>;
    handleFocus: (fieldNameInput: string) => () => void;
    validationFn?: ValidationFunction | null;
    isValid: boolean;
    validationMessage?: string;
    maxLength?: number;
}) {
    return <>
        <label htmlFor={id} className="form-label">
            {label + ':'}
        </label>
        <input
            type="text"
            id={id}
            name={id}
            className={`form-input`}
            onBlur={handleBlur(id, validationFn)}
            onFocus={handleFocus(id)}
            maxLength={maxLength}
        />
        <span className={`error-message ${isValid ? "visible" : ''}`}>
            {validationMessage ? validationMessage : "Required"}
        </span>
    </>
}

export default Input;