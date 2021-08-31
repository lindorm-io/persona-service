import MockDate from "mockdate";
import request from "supertest";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
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
} from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("/private/identities", () => {
  beforeAll(setupIntegration);

  test("GET /:id/userinfo", async () => {
    const identity = await TEST_IDENTITY_REPOSITORY.create(
      getTestIdentity({ id: uuid() }),
    );

    await TEST_DISPLAY_NAME_REPOSITORY.create(getTestDisplayName());
    await TEST_EMAIL_REPOSITORY.create(getTestEmail({ identityId: identity.id }));
    await TEST_PHONE_NUMBER_REPOSITORY.create(
      getTestPhoneNumber({ identityId: identity.id }),
    );

    const response = await request(koa.callback())
      .get(`/private/identities/${identity.id}/userinfo`)
      .expect(200);

    expect(response.body).toStrictEqual({
      address: {
        country: "country",
        formatted: "streetAddress1\nstreetAddress2\npostalCode locality\nregion\ncountry",
        locality: "locality",
        postal_code: "postalCode",
        region: "region",
        street_address: "streetAddress1\nstreetAddress2",
      },
      birth_date: "2000-01-01",
      display_name: "displayName#1234",
      email: "test@lindorm.io",
      email_verified: true,
      family_name: "familyName",
      gender: "gender",
      given_name: "givenName",
      gravatar: "https://gravatar.url/",
      locale: "sv-SE",
      middle_name: "middleName",
      name: "givenName familyName",
      nickname: "nickname",
      phone_number: "+46701234567",
      phone_number_verified: true,
      picture: "https://picture.url/",
      preferred_accessibility: ["setting1", "setting2", "setting3"],
      preferred_username: "username",
      profile: "https://profile.url/",
      pronouns: "she/her",
      social_security_number: "198412301545",
      sub: identity.id,
      updated_at: 1609488000,
      username: "username",
      website: "https://website.url/",
      zone_info: "Europe/Stockholm",
    });
  });

  test("PUT /:id/userinfo", async () => {
    const identity = getTestIdentity({ id: uuid() });
    identity.username = null;

    await TEST_IDENTITY_REPOSITORY.create(identity);

    await request(koa.callback())
      .put(`/private/identities/${identity.id}/userinfo`)
      .send({
        provider: "https://google.com/",
        sub: "b2f8c2e66cbc4875a39043ebb9dce576",
        updated_at: 1609489000,

        address: {
          country: "new_country",
          locality: "new_locality",
          postal_code: "new_postalCode",
          region: "new_region",
          street_address: "new_streetAddress1\nnew_streetAddress2",
        },
        birth_date: "2010-01-01",
        email: "new.test@lindorm.io",
        email_verified: true,
        family_name: "new_familyName",
        gender: "new_gender",
        given_name: "new_givenName",
        locale: "en-GB",
        middle_name: "new_middleName",
        nickname: "new_nickname",
        phone_number: "+42701234567",
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
        email: "new.test@lindorm.io",
        identityId: identity.id,
        primary: true,
        verified: false,
      }),
    );

    await expect(
      TEST_PHONE_NUMBER_REPOSITORY.find({ identityId: identity.id }),
    ).resolves.toStrictEqual(
      expect.objectContaining({
        phoneNumber: "+42701234567",
        identityId: identity.id,
        primary: true,
        verified: false,
      }),
    );

    await expect(
      TEST_OPEN_ID_IDENTIFIER_REPOSITORY.find({ identityId: identity.id }),
    ).resolves.toStrictEqual(
      expect.objectContaining({
        identifier: "b2f8c2e66cbc4875a39043ebb9dce576",
        identityId: identity.id,
        provider: "https://google.com/",
      }),
    );

    await expect(
      TEST_IDENTITY_REPOSITORY.find({ id: identity.id }),
    ).resolves.toStrictEqual(
      expect.objectContaining({
        address: {
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
