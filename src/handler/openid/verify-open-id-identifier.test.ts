import { EntityNotFoundError } from "@lindorm-io/entity";
import { Identity, OpenIdIdentifier } from "../../entity";
import { verifyOpenIdIdentifier } from "./verify-open-id-identifier";

describe("verifyOpenIdIdentifier", () => {
  const identifier1 = new OpenIdIdentifier({
    identityId: "identityId",
    identifier: "identifier1",
    provider: "provider1",
  });

  let ctx: any;
  let options: any;

  beforeEach(() => {
    ctx = {
      repository: {
        identityRepository: {
          create: jest.fn().mockResolvedValue(
            new Identity({
              id: "identityId",
            }),
          ),
          find: jest.fn().mockResolvedValue(new Identity({})),
        },
        openIdIdentifierRepository: {
          create: jest.fn(),
          find: jest.fn().mockResolvedValue(identifier1),
        },
      },
    };
    options = {
      identifier: "identifier",
      provider: "provider",
    };
  });

  test("should resolve identity when found with identifier", async () => {
    await expect(verifyOpenIdIdentifier(ctx, options)).resolves.toStrictEqual(
      expect.any(Identity),
    );

    expect(ctx.repository.identityRepository.create).not.toHaveBeenCalled();
    expect(ctx.repository.openIdIdentifierRepository.create).not.toHaveBeenCalled();
  });

  test("should fallback and resolve new identity and identifier when entity cannot be found", async () => {
    ctx.repository.openIdIdentifierRepository.find.mockRejectedValue(
      new EntityNotFoundError("message"),
    );

    await expect(verifyOpenIdIdentifier(ctx, options)).resolves.toStrictEqual(
      expect.any(Identity),
    );

    expect(ctx.repository.identityRepository.create).toHaveBeenCalled();
    expect(ctx.repository.openIdIdentifierRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        identityId: "identityId",
        identifier: "identifier",
        provider: "provider",
      }),
    );
  });
});
