import { OpenIdIdentifier, OpenIdIdentifierOptions } from "../../entity";
import { randomUUID } from "crypto";
import { getRandomString } from "@lindorm-io/core";

export const getTestOpenIdIdentifier = (
  options: Partial<OpenIdIdentifierOptions> = {},
): OpenIdIdentifier =>
  new OpenIdIdentifier({
    identityId: randomUUID(),
    identifier: getRandomString(32),
    provider: "https://login.apple.com/",
    ...options,
  });
