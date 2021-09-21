import MockDate from "mockdate";
import request from "supertest";
import { SCOPE_HINT } from "../../constant";
import { baseHash, getRandomNumber, getRandomString } from "@lindorm-io/core";
import { koa } from "../../server/koa";
import {
  TEST_DISPLAY_NAME_REPOSITORY,
  TEST_EMAIL_REPOSITORY,
  TEST_IDENTITY_REPOSITORY,
  TEST_OPEN_ID_IDENTIFIER_REPOSITORY,
  TEST_PHONE_NUMBER_REPOSITORY,
  getTestDisplayName,
  getTestEmail,
  getTestIdentity,
  getTestPhoneNumber,
  setupIntegration,
  getTestOpenIdIdentifier,
} from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

const basicAuth = baseHash("secret:secret");

describe("/private/identities", () => {
  beforeAll(setupIntegration);

  test("GET /:id/auth-methods", async () => {
    const identity = await TEST_IDENTITY_REPOSITORY.create(getTestIdentity());

    const email = await TEST_EMAIL_REPOSITORY.create(
      getTestEmail({ identityId: identity.id }),
    );
    const oidc1 = await TEST_OPEN_ID_IDENTIFIER_REPOSITORY.create(
      getTestOpenIdIdentifier({ identityId: identity.id }),
    );
    const oidc2 = await TEST_OPEN_ID_IDENTIFIER_REPOSITORY.create(
      getTestOpenIdIdentifier({
        identityId: identity.id,
        provider: "https://auth.google.com/",
      }),
    );
    const phone = await TEST_PHONE_NUMBER_REPOSITORY.create(
      getTestPhoneNumber({ identityId: identity.id }),
    );

    const response = await request(koa.callback())
      .get(`/private/identities/${identity.id}/auth-methods`)
      .set("Authorization", `Basic ${basicAuth}`)
      .expect(200);

    expect(response.body).toStrictEqual({
      connected_open_id_providers: [oidc1.provider, oidc2.provider],
      email: email.email,
      phone_number: phone.phoneNumber,
    });
  });

  test("GET /:id/userinfo", async () => {
    const identity = await TEST_IDENTITY_REPOSITORY.create(
      getTestIdentity({
        displayName: {
          name: getRandomString(12),
          number: getRandomNumber(4),
        },
      }),
    );

    const email = await TEST_EMAIL_REPOSITORY.create(
      getTestEmail({ identityId: identity.id }),
    );
    const phone = await TEST_PHONE_NUMBER_REPOSITORY.create(
      getTestPhoneNumber({ identityId: identity.id }),
    );
    await TEST_DISPLAY_NAME_REPOSITORY.create(
      getTestDisplayName({
        name: identity.displayName.name,
        numbers: [identity.displayName.number],
      }),
    );

    const response = await request(koa.callback())
      .get(`/private/identities/${identity.id}/userinfo`)
      .set("Authorization", `Basic ${basicAuth}`)
      .expect(200);

    expect(response.body).toStrictEqual({
      address: {
        care_of: "careOf",
        country: "country",
        formatted: "streetAddress1\nstreetAddress2\npostalCode locality\nregion\ncountry",
        locality: "locality",
        postal_code: "postalCode",
        region: "region",
        street_address: "streetAddress1\nstreetAddress2",
      },
      birth_date: "2000-01-01",
      display_name: `${identity.displayName.name}#${identity.displayName.number}`,
      email: email.email,
      email_verified: true,
      family_name: "familyName",
      gender: "gender",
      given_name: "givenName",
      gravatar: "https://gravatar.url/",
      locale: "sv-SE",
      middle_name: "middleName",
      name: "givenName familyName",
      nickname: "nickname",
      phone_number: phone.phoneNumber,
      phone_number_verified: true,
      picture: "https://picture.url/",
      preferred_accessibility: ["setting1", "setting2", "setting3"],
      preferred_username: "username",
      profile: "https://profile.url/",
      pronouns: "she/her",
      scope_hint: SCOPE_HINT,
      social_security_number: identity.socialSecurityNumber,
      sub: identity.id,
      updated_at: 1609488000,
      username: identity.username,
      website: "https://website.url/",
      zone_info: "Europe/Stockholm",
    });
  });

  test("PUT /:id/userinfo", async () => {
    const identity = getTestIdentity();
    identity.username = null;

    const email = `new-${getRandomString(16)}@lindorm.io`;
    const phone = `+${getRandomNumber(12)}`;
    const sub = getRandomString(32);

    await TEST_IDENTITY_REPOSITORY.create(identity);

    await request(koa.callback())
      .put(`/private/identities/${identity.id}/userinfo`)
      .set("Authorization", `Basic ${basicAuth}`)
      .send({
        provider: "https://github.com/",
        sub,
        updated_at: 1609489000,

        address: {
          country: "new_country",
          locality: "new_locality",
          postal_code: "new_postalCode",
          region: "new_region",
          street_address: "new_streetAddress1\nnew_streetAddress2",
        },
        birth_date: "2010-01-01",
        email,
        email_verified: true,
        family_name: "new_familyName",
        gender: "new_gender",
        given_name: "new_givenName",
        locale: "en-GB",
        middle_name: "new_middleName",
        nickname: "new_nickname",
        phone_number: phone,
        phone_number_verified: true,
        picture: "https://picture.url/new/",
        preferred_username: "new_username",
        profile: "https://profile.url/new/",
        website: "https://website.url/new/",
        zone_info: "Europe/Berlin",
      })
      .expect(200);

    await expect(
      TEST_EMAIL_REPOSITORY.find({ identityId: identity.id }),
    ).resolves.toStrictEqual(
      expect.objectContaining({
        email: email,
        identityId: identity.id,
        primary: true,
        verified: false,
      }),
    );

    await expect(
      TEST_PHONE_NUMBER_REPOSITORY.find({ identityId: identity.id }),
    ).resolves.toStrictEqual(
      expect.objectContaining({
        phoneNumber: phone,
        identityId: identity.id,
        primary: true,
        verified: false,
      }),
    );

    await expect(
      TEST_OPEN_ID_IDENTIFIER_REPOSITORY.find({ identityId: identity.id }),
    ).resolves.toStrictEqual(
      expect.objectContaining({
        identifier: sub,
        identityId: identity.id,
        provider: "https://github.com/",
      }),
    );

    await expect(
      TEST_IDENTITY_REPOSITORY.find({ id: identity.id }),
    ).resolves.toStrictEqual(
      expect.objectContaining({
        address: {
          careOf: null,
          country: "new_country",
          locality: "new_locality",
          postalCode: "new_postalCode",
          region: "new_region",
          streetAddress: ["new_streetAddress1", "new_streetAddress2"],
        },
        birthDate: "2010-01-01",
        familyName: "new_familyName",
        gender: "new_gender",
        givenName: "new_givenName",
        locale: "en-GB",
        middleName: "new_middleName",
        nickname: "new_nickname",
        picture: "https://picture.url/new/",
        preferredUsername: "new_username",
        profile: "https://profile.url/new/",
        username: "new_username",
        website: "https://website.url/new/",
        zoneInfo: "Europe/Berlin",
      }),
    );
  });
});
