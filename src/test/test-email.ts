import { Email, EmailOptions } from "../entity";

export const getTestEmail = (options: Partial<EmailOptions> = {}): Email =>
  new Email({
    identityId: "2796b8bc-08ce-4aec-ac42-6d026c7c6938",
    email: "test@lindorm.io",
    primary: true,
    verified: true,
    ...options,
  });
