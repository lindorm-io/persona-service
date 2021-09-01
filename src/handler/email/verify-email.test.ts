import { EntityNotFoundError } from "@lindorm-io/entity";
import { Identity, Email } from "../../entity";
import { verifyEmail } from "./verify-email";
import { logger } from "../../test";

describe("verifyEmail", () => {
  const email1 = new Email({
    identityId: "identityId",
    email: "email",
    primary: true,
    verified: true,
  });

  let ctx: any;

  beforeEach(() => {
    ctx = {
      logger,
      repository: {
        emailRepository: {
          create: jest.fn(),
          find: jest.fn().mockResolvedValue(email1),
        },
        identityRepository: {
          create: jest.fn().mockResolvedValue(
            new Identity({
              id: "identityId",
            }),
          ),
          find: jest.fn().mockResolvedValue(new Identity({})),
        },
      },
    };
  });

  test("should resolve identity when found with email", async () => {
    await expect(verifyEmail(ctx, "email")).resolves.toStrictEqual(expect.any(Identity));

    expect(ctx.repository.identityRepository.create).not.toHaveBeenCalled();
    expect(ctx.repository.emailRepository.create).not.toHaveBeenCalled();
  });

  test("should fallback and resolve new identity and email when entity cannot be found", async () => {
    ctx.repository.emailRepository.find.mockRejectedValue(
      new EntityNotFoundError("message"),
    );

    await expect(verifyEmail(ctx, "email")).resolves.toStrictEqual(expect.any(Identity));

    expect(ctx.repository.identityRepository.create).toHaveBeenCalled();
    expect(ctx.repository.emailRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        identityId: "identityId",
        email: "email",
        primary: true,
        verified: true,
      }),
    );
  });
});
