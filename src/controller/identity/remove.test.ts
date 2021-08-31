import { Scope } from "../../enum";
import { getTestIdentity } from "../../test";
import { identityRemoveController } from "./remove";
import { removeIdentityDisplayName as _removeIdentityDisplayName } from "../../handler";

jest.mock("../../handler", () => ({
  removeIdentityDisplayName: jest.fn().mockImplementation(async () => {}),
}));

const removeIdentityDisplayName = _removeIdentityDisplayName as jest.Mock;

describe("identityRemoveController", () => {
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
          removeMany: jest.fn(),
        },
        identityRepository: {
          remove: jest.fn(),
        },
        openIdIdentifierRepository: {
          removeMany: jest.fn(),
        },
        phoneNumberRepository: {
          removeMany: jest.fn(),
        },
      },
      token: {
        bearerToken: {
          scopes: [Scope.REMOVE_IDENTITY],
          subject: "identityId",
        },
      },
    };
  });

  test("should remove identity", async () => {
    await expect(identityRemoveController(ctx)).resolves.toStrictEqual({
      data: {},
    });

    expect(removeIdentityDisplayName).toHaveBeenCalled();
    expect(ctx.repository.emailRepository.removeMany).toHaveBeenCalled();
    expect(ctx.repository.openIdIdentifierRepository.removeMany).toHaveBeenCalled();
    expect(ctx.repository.phoneNumberRepository.removeMany).toHaveBeenCalled();
    expect(ctx.repository.identityRepository.remove).toHaveBeenCalled();
  });
});
