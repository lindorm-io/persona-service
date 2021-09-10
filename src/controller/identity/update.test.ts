import { Scope } from "../../enum";
import { getTestIdentity, logger } from "../../test";
import { identityUpdateController } from "./update";
import { updateIdentityDisplayName as _updateIdentityDisplayName } from "../../handler";

jest.mock("../../handler", () => ({
  updateIdentityDisplayName: jest.fn(),
}));

const updateIdentityDisplayName = _updateIdentityDisplayName as jest.Mock;

describe("identityUpdateController", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      data: {
        address: {
          country: "new-country",
          locality: "new-locality",
          postalCode: "new-postalCode",
          region: "new-region",
          streetAddress: ["new-streetAddress"],
        },
        birthDate: "new-birthDate",
        displayName: "new-displayName",
        familyName: "new-familyName",
        gender: "new-gender",
        givenName: "new-givenName",
        gravatar: "new-gravatar",
        locale: "new-locale",
        middleName: "new-middleName",
        namingSystem: "new-namingSystem",
        nickname: "new-nickname",
        picture: "new-picture",
        preferredAccessibility: ["new-setting"],
        preferredUsername: "new-preferredUsername",
        profile: "new-profile",
        pronouns: "new-pronouns",
        socialSecurityNumber: "new-socialSecurityNumber",
        username: "new-username",
        website: "new-website",
        zoneInfo: "new-zoneInfo",
      },
      entity: {
        identity: getTestIdentity({
          id: "identityId",
        }),
      },
      logger,
      repository: {
        identityRepository: {
          update: jest.fn(),
        },
      },
      token: {
        bearerToken: {
          scopes: [
            Scope.OPENID,
            Scope.ADDRESS,
            Scope.EMAIL,
            Scope.PHONE,
            Scope.PROFILE,
            Scope.PRIVATE,
          ],
          subject: "identityId",
        },
      },
    };
  });

  test("should update identity", async () => {
    await expect(identityUpdateController(ctx)).resolves.toStrictEqual({
      data: {},
    });

    expect(updateIdentityDisplayName).toHaveBeenCalled();
    expect(ctx.repository.identityRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        address: {
          country: "new-country",
          locality: "new-locality",
          postalCode: "new-postalCode",
          region: "new-region",
          streetAddress: ["new-streetAddress"],
        },
        birthDate: "new-birthDate",
        familyName: "new-familyName",
        gender: "new-gender",
        givenName: "new-givenName",
        gravatar: "new-gravatar",
        locale: "new-locale",
        middleName: "new-middleName",
        namingSystem: "new-namingSystem",
        nickname: "new-nickname",
        picture: "new-picture",
        preferredAccessibility: ["new-setting"],
        preferredUsername: "new-preferredUsername",
        profile: "new-profile",
        pronouns: "new-pronouns",
        socialSecurityNumber: "new-socialSecurityNumber",
        username: "new-username",
        website: "new-website",
        zoneInfo: "new-zoneInfo",
      }),
    );
  });
});
