import { EntityNotFoundError } from "@lindorm-io/entity";
import { Identity, PhoneNumber } from "../../entity";
import { verifyPhoneNumber } from "./verify-phone-number";

describe("verifyPhoneNumber", () => {
  const phone1 = new PhoneNumber({
    identityId: "identityId",
    phoneNumber: "phoneNumber",
    primary: true,
    verified: true,
  });

  let ctx: any;

  beforeEach(() => {
    ctx = {
      repository: {
        phoneNumberRepository: {
          create: jest.fn(),
          find: jest.fn().mockResolvedValue(phone1),
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

  test("should resolve identity when found with phone number", async () => {
    await expect(verifyPhoneNumber(ctx, "phoneNumber")).resolves.toStrictEqual(
      expect.any(Identity),
    );

    expect(ctx.repository.identityRepository.create).not.toHaveBeenCalled();
    expect(ctx.repository.phoneNumberRepository.create).not.toHaveBeenCalled();
  });

  test("should fallback and resolve new identity and phone number when entity cannot be found", async () => {
    ctx.repository.phoneNumberRepository.find.mockRejectedValue(
      new EntityNotFoundError("message"),
    );

    await expect(verifyPhoneNumber(ctx, "phoneNumber")).resolves.toStrictEqual(
      expect.any(Identity),
    );

    expect(ctx.repository.identityRepository.create).toHaveBeenCalled();
    expect(ctx.repository.phoneNumberRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        identityId: "identityId",
        phoneNumber: "phoneNumber",
        primary: true,
        verified: true,
      }),
    );
  });
});
