import { getTestIdentity, logger } from "../../test";
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
          displayName: {
            name: "name",
            number: 1234,
          },
        }),
      },
      logger,
      repository: {
        emailRepository: {
          destroyMany: jest.fn(),
        },
        identityRepository: {
          destroy: jest.fn(),
        },
        openIdIdentifierRepository: {
          destroyMany: jest.fn(),
        },
        phoneNumberRepository: {
          destroyMany: jest.fn(),
        },
      },
      token: {
        bearerToken: {
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
    expect(ctx.repository.emailRepository.destroyMany).toHaveBeenCalled();
    expect(ctx.repository.openIdIdentifierRepository.destroyMany).toHaveBeenCalled();
    expect(ctx.repository.phoneNumberRepository.destroyMany).toHaveBeenCalled();
    expect(ctx.repository.identityRepository.destroy).toHaveBeenCalled();
  });
});
