import { OpenIdIdentifier } from "../../entity";
import { userinfoOpenIdIdentifierAdd } from "./userinfo-open-id-identifier-add";
import { EntityNotFoundError } from "@lindorm-io/entity";

describe("userinfoOpenIdIdentifierAdd", () => {
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
        openIdIdentifierRepository: {
          create: jest.fn().mockImplementation(async (entity: any) => entity),
          find: jest.fn().mockResolvedValue(identifier1),
        },
      },
    };
    options = {
      identityId: "identityId",
      identifier: "identifier",
      provider: "provider",
    };
  });

  test("should resolve with found identifier", async () => {
    await expect(userinfoOpenIdIdentifierAdd(ctx, options)).resolves.toStrictEqual(
      identifier1,
    );
  });

  test("should resolve with new identifier", async () => {
    ctx.repository.openIdIdentifierRepository.find.mockRejectedValue(
      new EntityNotFoundError("message"),
    );

    await expect(userinfoOpenIdIdentifierAdd(ctx, options)).resolves.toStrictEqual(
      expect.objectContaining({
        identityId: "identityId",
        identifier: "identifier",
        provider: "provider",
      }),
    );
  });
});
