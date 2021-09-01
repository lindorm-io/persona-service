import { getConnectedProviders } from "./get-connected-providers";
import { logger } from "../../test";

describe("getConnectedProviders", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      logger,
      repository: {
        openIdIdentifierRepository: {
          findMany: jest
            .fn()
            .mockResolvedValue([
              { provider: "https://apple.com/" },
              { provider: "https://github.com/" },
              { provider: "https://google.com/" },
              { provider: "https://twitter.com/" },
            ]),
        },
      },
    };
  });

  test("should resolve a list of connected providers", async () => {
    await expect(getConnectedProviders(ctx, "identityId")).resolves.toStrictEqual([
      "https://apple.com/",
      "https://github.com/",
      "https://google.com/",
      "https://twitter.com/",
    ]);
  });
});
