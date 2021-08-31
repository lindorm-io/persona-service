import MockDate from "mockdate";
import request from "supertest";
import { koa } from "../server/koa";
import {
  TEST_CONNECT_SESSION_CACHE,
  TEST_EMAIL_REPOSITORY,
  getTestConnectSession,
  getTestEmail,
  setupIntegration,
} from "../test";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("/identifiers", () => {
  beforeAll(setupIntegration);

  test("POST /connect-session/:session/verify", async () => {
    const email = await TEST_EMAIL_REPOSITORY.create(
      getTestEmail({
        verified: false,
      }),
    );
    const session = await TEST_CONNECT_SESSION_CACHE.create(
      await getTestConnectSession({
        identifier: email.email,
      }),
    );

    await request(koa.callback())
      .post(`/identifiers/connect-session/${session.id}/verify`)
      .send({
        code: "secret",
      })
      .expect(200);
  });
});
