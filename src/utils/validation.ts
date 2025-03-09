export function isValidatePhone(phone: string): boolean {
return phone.includes("+") && phone.length === 12;
}

export function isValidateName(name: string): boolean {
    return name.length > 1 && name.length <= 50;
}

export function isValidCorporationNumber(phone: string): boolean  {
    return phone.length === 9;
}
export function isValidCanadianPhoneNumber(phoneNumber: string): boolean {
    if (!phoneNumber) {
      return false;
    }
    const canadianPhoneRegex = /^\+1[0-9]{10}$/;
    return canadianPhoneRegex.test(phoneNumber);
  }
