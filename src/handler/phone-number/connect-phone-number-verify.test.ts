import { ClientError } from "@lindorm-io/errors";
import { PhoneNumber } from "../../entity";
import { connectPhoneNumberVerify } from "./connect-phone-number-verify";

jest.mock("../../instance", () => ({
  cryptoLayered: {
    assert: jest.fn().mockImplementation(async () => {}),
  },
}));

describe("connectPhoneNumberVerify", () => {
  const phone1 = new PhoneNumber({
    identityId: "identityId",
    phoneNumber: "phoneNumber",
    primary: false,
    verified: false,
  });

  let ctx: any;
  let session: any;

  beforeEach(() => {
    ctx = {
      repository: {
        phoneNumberRepository: {
          find: jest.fn().mockResolvedValue(phone1),
          update: jest.fn(),
        },
      },
    };
    session = {
      code: "code",
      identifier: "phoneNumber",
    };
  });

  test("should verify connect session and set phone number as verified", async () => {
    await expect(connectPhoneNumberVerify(ctx, session, "code")).resolves.toBeUndefined();

    expect(ctx.repository.phoneNumberRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        phoneNumber: "phoneNumber",
        verified: true,
      }),
    );
  });

  test("should throw if phone number is already verified", async () => {
    phone1.verified = true;

    await expect(connectPhoneNumberVerify(ctx, session, "code")).rejects.toThrow(
      ClientError,
    );
  });
});
