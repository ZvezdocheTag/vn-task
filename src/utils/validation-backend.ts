import {
    isValidCorporationNumber,
} from './validation';

const serverUrl = import.meta.env.VITE_BACKEND_API;

export const isCorporateNumberValidAsync = async (phoneNumber: string) => {
    if (!phoneNumber && !phoneNumber.length) return false;

    if (isValidCorporationNumber(phoneNumber)) {
        const result = await fetch(`${serverUrl}corporation-number/${phoneNumber}`).then(resp => resp.json());
        return result.valid;
    }

    return false;
};
