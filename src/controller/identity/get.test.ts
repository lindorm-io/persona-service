import { Scope } from "../../enum";
import { getTestIdentity } from "../../test";
import { identityGetController } from "./get";

jest.mock("../../handler", () => ({
  getConnectedProviders: jest.fn().mockImplementation(() => "getConnectedProviders"),
}));
jest.mock("../../util", () => ({
  getDisplayName: jest.fn().mockImplementation(() => "getDisplayName"),
}));

describe("identityGetController", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      entity: {
        identity: getTestIdentity({
          id: "identityId",
        }),
      },
      repository: {
        emailRepository: {
          findMany: jest.fn().mockResolvedValue([
            { email: "email1", primary: true, verified: true },
            { email: "email2", primary: false, verified: true },
            { email: "email3", primary: false, verified: false },
          ]),
        },
        phoneNumberRepository: {
          findMany: jest.fn().mockResolvedValue([
            { phoneNumber: "phoneNumber1", primary: true, verified: true },
            { phoneNumber: "phoneNumber2", primary: false, verified: true },
            { phoneNumber: "phoneNumber3", primary: false, verified: false },
          ]),
        },
      },
      token: {
        bearerToken: {
          scopes: [Scope.OPENID],
          subject: "identityId",
        },
      },
    };
  });

  test("should resolve with address data", async () => {
    ctx.token.bearerToken.scopes.push(Scope.ADDRESS);

    await expect(identityGetController(ctx)).resolves.toStrictEqual({
      data: {
        address: {
          country: "country",
          locality: "locality",
          postalCode: "postalCode",
          region: "region",
          streetAddress: ["streetAddress1", "streetAddress2"],
        },
      },
    });
  });

  test("should resolve with email data", async () => {
    ctx.token.bearerToken.scopes.push(Scope.EMAIL);

    await expect(identityGetController(ctx)).resolves.toStrictEqual({
      data: {
        emails: [
          {
            email: "email1",
            primary: true,
            verified: true,
          },
          {
            email: "email2",
            primary: false,
            verified: true,
          },
          {
            email: "email3",
            primary: false,
            verified: false,
          },
        ],
      },
    });
  });

  test("should resolve with phone data", async () => {
    ctx.token.bearerToken.scopes.push(Scope.PHONE);

    await expect(identityGetController(ctx)).resolves.toStrictEqual({
      data: {
        phoneNumbers: [
          {
            phoneNumber: "phoneNumber1",
            primary: true,
            verified: true,
          },
          {
            phoneNumber: "phoneNumber2",
            primary: false,
            verified: true,
          },
          {
            phoneNumber: "phoneNumber3",
            primary: false,
            verified: false,
          },
        ],
      },
    });
  });

  test("should resolve with profile data", async () => {
    ctx.token.bearerToken.scopes.push(Scope.PROFILE);

    await expect(identityGetController(ctx)).resolves.toStrictEqual({
      data: {
        birthDate: "2000-01-01",
        displayName: "getDisplayName",
        familyName: "familyName",
        gender: "gender",
        givenName: "givenName",
        gravatar: "https://gravatar.url/",
        locale: "sv-SE",
        middleName: "middleName",
        nickname: "nickname",
        picture: "https://picture.url/",
        preferredUsername: "username",
        profile: "https://profile.url/",
        pronouns: "she/her",
        website: "https://website.url/",
        zoneInfo: "Europe/Stockholm",
      },
    });
  });

  test("should resolve with private data", async () => {
    ctx.token.bearerToken.scopes.push(Scope.PRIVATE);

    await expect(identityGetController(ctx)).resolves.toStrictEqual({
      data: {
        connectedProviders: "getConnectedProviders",
        socialSecurityNumber: "198412301545",
        username: "username",
      },
    });
  });
});
