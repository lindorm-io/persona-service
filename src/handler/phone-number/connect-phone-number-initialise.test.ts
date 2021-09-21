import MockDate from "mockdate";
import { ClientError } from "@lindorm-io/errors";
import { ConnectSession, PhoneNumber } from "../../entity";
import { EntityNotFoundError } from "@lindorm-io/entity";
import { connectPhoneNumberInitialise } from "./connect-phone-number-initialise";
import { getTestIdentity, logger } from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

jest.mock("uuid", () => ({
  v4: () => "93aea58b-f3de-44fe-b7de-8db0dd97117b",
}));

describe("connectPhoneNumberInitialise", () => {
  const phone1 = new PhoneNumber({
    id: "206a2773-4b19-4bbf-bd01-5a53657a5298",
    identityId: "identityId",
    phoneNumber: "phoneNumber1",
    primary: false,
    verified: false,
  });

  let ctx: any;
  let identity: any;

  beforeEach(() => {
    ctx = {
      axios: {
        communicationClient: {
          post: jest.fn(),
        },
      },
      cache: {
        connectSessionCache: {
          create: jest.fn().mockImplementation(async (entity: any) => entity),
        },
      },
      logger,
      repository: {
        phoneNumberRepository: {
          find: jest.fn().mockResolvedValue(phone1),
          create: jest.fn().mockImplementation(async (entity: any) => entity),
        },
      },
    };

    identity = getTestIdentity();
  });

  test("should initialise connection for existing phone number", async () => {
    await expect(
      connectPhoneNumberInitialise(ctx, identity, "phoneNumber"),
    ).resolves.toStrictEqual(expect.any(ConnectSession));

    expect(ctx.cache.connectSessionCache.create).toHaveBeenCalledWith(
      expect.objectContaining({
        code: expect.any(String),
        identifier: "phoneNumber1",
        type: "phone_number",
      }),
      7200,
    );

    expect(ctx.axios.communicationClient.post).toHaveBeenCalledWith("/private/send/sms", {
      data: {
        code: expect.any(String),
        expiresIn: 7200,
        name: "givenName familyName",
        phoneNumber: "phoneNumber1",
        template: "connect-phone-number",
      },
    });
  });

  test("should initialise connection for new phone number", async () => {
    ctx.repository.phoneNumberRepository.find.mockRejectedValue(
      new EntityNotFoundError("message"),
    );

    await expect(
      connectPhoneNumberInitialise(ctx, identity, "phoneNumber"),
    ).resolves.toStrictEqual(expect.any(ConnectSession));

    expect(ctx.cache.connectSessionCache.create).toHaveBeenCalledWith(
      expect.objectContaining({
        code: expect.any(String),
        identifier: "phoneNumber",
        type: "phone_number",
      }),
      7200,
    );

    expect(ctx.axios.communicationClient.post).toHaveBeenCalledWith("/private/send/sms", {
      data: {
        code: expect.any(String),
        expiresIn: 7200,
        name: "givenName familyName",
        phoneNumber: "phoneNumber",
        template: "connect-phone-number",
      },
    });
  });

  test("should throw if phone number is already verified", async () => {
    phone1.verified = true;

    await expect(
      connectPhoneNumberInitialise(ctx, identity, "phoneNumber"),
    ).rejects.toThrow(ClientError);
  });
});
