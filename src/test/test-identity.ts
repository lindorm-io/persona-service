import { Identity, IdentityOptions } from "../entity";
import { NamingSystem } from "../enum";

export const getTestIdentity = (options: Partial<IdentityOptions> = {}): Identity =>
  new Identity({
    id: "2796b8bc-08ce-4aec-ac42-6d026c7c6938",
    address: {
      country: "country",
      locality: "locality",
      postalCode: "postalCode",
      region: "region",
      streetAddress: ["streetAddress1", "streetAddress2"],
    },
    birthDate: "2000-01-01",
    displayName: {
      name: "displayName",
      number: 1234,
    },
    familyName: "familyName",
    gender: "gender",
    givenName: "givenName",
    gravatar: "https://gravatar.url/",
    locale: "sv-SE",
    middleName: "middleName",
    namingSystem: NamingSystem.GIVEN_FAMILY,
    nickname: "nickname",
    picture: "https://picture.url/",
    preferredAccessibility: ["setting1", "setting2", "setting3"],
    preferredUsername: "username",
    profile: "https://profile.url/",
    pronouns: "she/her",
    socialSecurityNumber: "198412301545",
    username: "username",
    website: "https://website.url/",
    zoneInfo: "Europe/Stockholm",
    ...options,
  });
