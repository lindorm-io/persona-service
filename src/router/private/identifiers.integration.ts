import MockDate from "mockdate";
import request from "supertest";
import { Email, Identity, OpenIdIdentifier, PhoneNumber } from "../../entity";
import { baseHash } from "@lindorm-io/core";
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

const basicAuth = baseHash("secret:secret");

describe("/private/identifiers", () => {
  let identity: Identity;
  let email: Email;
  let oidc: OpenIdIdentifier;
  let phone: PhoneNumber;

  beforeAll(async () => {
    await setupIntegration();

    identity = await TEST_IDENTITY_REPOSITORY.create(getTestIdentity());

    email = await TEST_EMAIL_REPOSITORY.create(
      getTestEmail({
        identityId: identity.id,
      }),
    );
    oidc = await TEST_OPEN_ID_IDENTIFIER_REPOSITORY.create(
      getTestOpenIdIdentifier({
        identityId: identity.id,
      }),
    );
    phone = await TEST_PHONE_NUMBER_REPOSITORY.create(
      getTestPhoneNumber({
        identityId: identity.id,
      }),
    );
  });

  test("POST /email/auth/verify", async () => {
    const response = await request(koa.callback())
      .post("/private/identifiers/email/auth/verify")
      .set("Authorization", `Basic ${basicAuth}`)
      .send({
        email: email.email,
      })
      .expect(200);

    expect(response.body).toStrictEqual({
      identity_id: identity.id,
    });
  });

  test("POST /phone_number/auth/verify", async () => {
    const response = await request(koa.callback())
      .post("/private/identifiers/phone_number/auth/verify")
      .set("Authorization", `Basic ${basicAuth}`)
      .send({
        phone_number: phone.phoneNumber,
      })
      .expect(200);

    expect(response.body).toStrictEqual({
      identity_id: identity.id,
    });
  });

  test("POST /oidc/auth/verify", async () => {
    const response = await request(koa.callback())
      .post("/private/identifiers/oidc/auth/verify")
      .set("Authorization", `Basic ${basicAuth}`)
      .send({
        identifier: oidc.identifier,
        provider: "https://login.apple.com/",
      })
      .expect(200);

    expect(response.body).toStrictEqual({
      identity_id: identity.id,
    });
  });

  test("POST /username/auth/verify", async () => {
    const response = await request(koa.callback())
      .post("/private/identifiers/username/auth/verify")
      .set("Authorization", `Basic ${basicAuth}`)
      .send({
        username: identity.username,
      })
      .expect(200);

    expect(response.body).toStrictEqual({
      identity_id: identity.id,
    });
  });
});
