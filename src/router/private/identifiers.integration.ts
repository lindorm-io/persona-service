import MockDate from "mockdate";
import request from "supertest";
import { koa } from "../../server/koa";
import {
  TEST_EMAIL_REPOSITORY,
  TEST_IDENTITY_REPOSITORY,
  TEST_OPEN_ID_IDENTIFIER_REPOSITORY,
  TEST_PHONE_NUMBER_REPOSITORY,
  getTestEmail,
  getTestIdentity,
  getTestOpenIdIdentifier,
  getTestPhoneNumber,
  setupIntegration,
} from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("/private/identifiers", () => {
  beforeAll(async () => {
    await setupIntegration();

    await TEST_IDENTITY_REPOSITORY.create(getTestIdentity());
    await TEST_EMAIL_REPOSITORY.create(getTestEmail());
    await TEST_PHONE_NUMBER_REPOSITORY.create(getTestPhoneNumber());
    await TEST_OPEN_ID_IDENTIFIER_REPOSITORY.create(getTestOpenIdIdentifier());
  });

  test("POST /email/auth/verify", async () => {
    const response = await request(koa.callback())
      .post("/private/identifiers/email/auth/verify")
      .send({
        email: "test@lindorm.io",
      })
      .expect(200);

    expect(response.body).toStrictEqual({
      identity_id: "2796b8bc-08ce-4aec-ac42-6d026c7c6938",
    });
  });

  test("POST /phone_number/auth/verify", async () => {
    const response = await request(koa.callback())
      .post("/private/identifiers/phone_number/auth/verify")
      .send({
        phone_number: "+46701234567",
      })
      .expect(200);

    expect(response.body).toStrictEqual({
      identity_id: "2796b8bc-08ce-4aec-ac42-6d026c7c6938",
    });
  });

  test("POST /oidc/auth/verify", async () => {
    const response = await request(koa.callback())
      .post("/private/identifiers/oidc/auth/verify")
      .send({
        identifier: "6f705339272d4ba3b4392ab628b000f3",
        provider: "https://apple.com/",
      })
      .expect(200);

    expect(response.body).toStrictEqual({
      identity_id: "2796b8bc-08ce-4aec-ac42-6d026c7c6938",
    });
  });

  test("POST /username/auth/verify", async () => {
    const response = await request(koa.callback())
      .post("/private/identifiers/username/auth/verify")
      .send({
        username: "username",
      })
      .expect(200);

    expect(response.body).toStrictEqual({
      identity_id: "2796b8bc-08ce-4aec-ac42-6d026c7c6938",
    });
  });
});
