import { ClientError } from "@lindorm-io/errors";
import { Email } from "../../entity";
import { connectEmailVerify } from "./connect-email-verify";

jest.mock("../../instance", () => ({
  cryptoLayered: {
    assert: jest.fn().mockImplementation(async () => {}),
  },
}));

describe("connectEmailVerify", () => {
  const email1 = new Email({
    identityId: "identityId",
    email: "email",
    primary: false,
    verified: false,
  });

  let ctx: any;
  let session: any;

  beforeEach(() => {
    ctx = {
      repository: {
        emailRepository: {
          find: jest.fn().mockResolvedValue(email1),
          update: jest.fn(),
        },
      },
    };
    session = {
      code: "code",
      identifier: "email",
    };
  });

  test("should verify connect session and set email as verified", async () => {
    await expect(connectEmailVerify(ctx, session, "code")).resolves.toBeUndefined();

    expect(ctx.repository.emailRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "email",
        verified: true,
      }),
    );
  });

  test("should throw if email is already verified", async () => {
    email1.verified = true;

    await expect(connectEmailVerify(ctx, session, "code")).rejects.toThrow(ClientError);
  });
});
