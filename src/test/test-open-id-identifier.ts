import { OpenIdIdentifier, OpenIdIdentifierOptions } from "../entity";

export const getTestOpenIdIdentifier = (
  options: Partial<OpenIdIdentifierOptions> = {},
): OpenIdIdentifier =>
  new OpenIdIdentifier({
    identityId: "2796b8bc-08ce-4aec-ac42-6d026c7c6938",
    identifier: "6f705339272d4ba3b4392ab628b000f3",
    provider: "https://apple.com/",
    ...options,
  });
