import { PhoneNumber, PhoneNumberOptions } from "../../entity";

export const getTestPhoneNumber = (
  options: Partial<PhoneNumberOptions> = {},
): PhoneNumber =>
  new PhoneNumber({
    identityId: "2796b8bc-08ce-4aec-ac42-6d026c7c6938",
    phoneNumber: "+46701234567",
    primary: true,
    verified: true,
    ...options,
  });
