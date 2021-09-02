import { Scope } from "../enum";
import { ScopeHint } from "../typing";

export const SCOPE_HINT: ScopeHint = {
  [Scope.ADDRESS]: ["address"],
  [Scope.EMAIL]: ["email", "emailVerified"],
  [Scope.PHONE]: ["phoneNumber", "phoneNumberVerified"],
  [Scope.PROFILE]: [
    "birthDate",
    "displayName",
    "familyName",
    "gender",
    "givenName",
    "gravatar",
    "locale",
    "middleName",
    "name",
    "nickname",
    "picture",
    "preferredUsername",
    "profile",
    "pronouns",
    "website",
    "zoneInfo",
  ],
  [Scope.PRIVATE]: ["preferredAccessibility", "socialSecurityNumber", "username"],
};
