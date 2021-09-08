import MockDate from "mockdate";
import { ClientError } from "@lindorm-io/errors";
import { ConnectSession, Email } from "../../entity";
import { EntityNotFoundError } from "@lindorm-io/entity";
import { connectEmailInitialise } from "./connect-email-initialise";
import { getTestIdentity, logger } from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

jest.mock("uuid", () => ({
  v4: () => "93aea58b-f3de-44fe-b7de-8db0dd97117b",
}));

describe("connectEmailInitialise", () => {
  const email1 = new Email({
    id: "206a2773-4b19-4bbf-bd01-5a53657a5298",
    identityId: "identityId",
    email: "email1",
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
        emailRepository: {
          find: jest.fn().mockResolvedValue(email1),
          create: jest.fn().mockImplementation(async (entity: any) => entity),
        },
      },
    };

    identity = getTestIdentity();
  });

  test("should initialise connection for existing email", async () => {
    await expect(connectEmailInitialise(ctx, identity, "email")).resolves.toStrictEqual(
      expect.any(ConnectSession),
    );

    expect(ctx.cache.connectSessionCache.create).toHaveBeenCalledWith(
      expect.objectContaining({
        code: expect.any(String),
        identifier: "email1",
        type: "email",
      }),
      7200,
    );

    expect(ctx.axios.communicationClient.post).toHaveBeenCalledWith(
      "/private/send/email",
      {
        data: {
          code: expect.any(Number),
          email: "email1",
          expiresIn: 7200,
          name: "givenName familyName",
          template: "connect-email",
        },
      },
    );
  });

  test("should initialise connection for new email", async () => {
    ctx.repository.emailRepository.find.mockRejectedValue(
      new EntityNotFoundError("message"),
    );

    await expect(connectEmailInitialise(ctx, identity, "email")).resolves.toStrictEqual(
      expect.any(ConnectSession),
    );

    expect(ctx.cache.connectSessionCache.create).toHaveBeenCalledWith(
      expect.objectContaining({
        code: expect.any(String),
        identifier: "email",
        type: "email",
      }),
      7200,
    );

    expect(ctx.axios.communicationClient.post).toHaveBeenCalledWith(
      "/private/send/email",
      {
        data: {
          code: expect.any(Number),
          email: "email",
          expiresIn: 7200,
          name: "givenName familyName",
          template: "connect-email",
        },
      },
    );
  });

  test("should throw if email is already verified", async () => {
    email1.verified = true;

    await expect(connectEmailInitialise(ctx, identity, "email")).rejects.toThrow(
      ClientError,
    );
  });
});
