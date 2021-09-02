import { getTestIdentity, logger } from "../../test";
import { userinfoGetController } from "./get-userinfo";
import { SCOPE_HINT } from "../../constant";

jest.mock("../../handler", () => ({
  userinfoEmailGet: jest.fn().mockResolvedValue({
    email: "email",
    emailVerified: true,
  }),
  userinfoPhoneNumberGet: jest.fn().mockResolvedValue({
    phoneNumber: "phoneNumber",
    phoneNumberVerified: false,
  }),
}));
jest.mock("../../util", () => ({
  getAddress: jest.fn().mockImplementation(() => "address"),
  getDisplayName: jest.fn().mockImplementation(() => "displayName"),
  getName: jest.fn().mockImplementation(() => "name"),
}));

describe("userinfoGetController", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      data: { identityId: "identityId" },
      entity: {
        identity: getTestIdentity({
          id: "id",
          updated: new Date("2021-01-01T08:00:00.000Z"),
        }),
      },
      logger,
    };
  });

  test("should resolve with userinfo", async () => {
    await expect(userinfoGetController(ctx)).resolves.toStrictEqual({
      data: {
        address: "address",
        birthDate: "2000-01-01",
        displayName: "displayName",
        email: "email",
        emailVerified: true,
        familyName: "familyName",
        gender: "gender",
        givenName: "givenName",
        gravatar: "https://gravatar.url/",
        locale: "sv-SE",
        middleName: "middleName",
        name: "name",
        nickname: "nickname",
        phoneNumber: "phoneNumber",
        phoneNumberVerified: false,
        picture: "https://picture.url/",
        preferredAccessibility: ["setting1", "setting2", "setting3"],
        preferredUsername: "username",
        profile: "https://profile.url/",
        pronouns: "she/her",
        scopeHint: SCOPE_HINT,
        socialSecurityNumber: "198412301545",
        sub: "id",
        updatedAt: 1609488000,
        username: "username",
        website: "https://website.url/",
        zoneInfo: "Europe/Stockholm",
      },
    });
  });
});
