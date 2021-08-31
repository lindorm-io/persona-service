import { OpenIdIdentifier } from "../../entity";
import { removeOpenIdIdentifier } from "./remove-open-id-identifier";

describe("removeOpenIdIdentifier", () => {
  const identifier1 = new OpenIdIdentifier({
    identityId: "identityId",
    identifier: "identifier",
    provider: "provider",
  });

  let ctx: any;
  let options: any;

  beforeEach(() => {
    ctx = {
      repository: {
        openIdIdentifierRepository: {
          find: jest.fn().mockResolvedValue(identifier1),
          remove: jest.fn(),
        },
      },
    };
    options = {
      identityId: "identityId",
      identifier: "identifier",
    };
  });

  test("should find and remove identifier", async () => {
    await expect(removeOpenIdIdentifier(ctx, options)).resolves.toBeUndefined();

    expect(ctx.repository.openIdIdentifierRepository.remove).toHaveBeenCalledWith(
      identifier1,
    );
  });
});
