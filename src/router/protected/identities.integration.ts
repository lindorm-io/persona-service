import MockDate from "mockdate";
import request from "supertest";
import { ConnectSession, Email } from "../../entity";
import { EntityNotFoundError } from "@lindorm-io/entity";
import { koa } from "../../server/koa";
import { randomUUID } from "crypto";
import {
  TEST_CONNECT_SESSION_CACHE,
  TEST_DISPLAY_NAME_REPOSITORY,
  TEST_EMAIL_REPOSITORY,
  TEST_IDENTITY_REPOSITORY,
  TEST_OPEN_ID_IDENTIFIER_REPOSITORY,
  TEST_PHONE_NUMBER_REPOSITORY,
  getAxiosResponse,
  getTestAccessToken,
  getTestDisplayName,
  getTestEmail,
  getTestIdentity,
  getTestOpenIdIdentifier,
  getTestPhoneNumber,
  setAxiosResponse,
  setupIntegration,
} from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

jest.mock("@lindorm-io/axios", () => ({
  ...(jest.requireActual("@lindorm-io/axios") as Record<string, any>),
  Axios: class Axios {
    private readonly name: string;
    public constructor(opts: any) {
      this.name = opts.name;
    }
    public async get(path: string): Promise<any> {
      return getAxiosResponse("GET", this.name, path);
    }
    public async post(path: string): Promise<any> {
      return getAxiosResponse("POST", this.name, path);
    }
  },
}));

describe("/protected/identities", () => {
  beforeAll(setupIntegration);

  test("GET /:id", async () => {
    const identity = await TEST_IDENTITY_REPOSITORY.create(
      getTestIdentity({
        id: randomUUID(),
      }),
    );
    const email = await TEST_EMAIL_REPOSITORY.create(
      getTestEmail({
        identityId: identity.id,
      }),
    );
    const oidc = await TEST_OPEN_ID_IDENTIFIER_REPOSITORY.create(
      getTestOpenIdIdentifier({
        identityId: identity.id,
      }),
    );
    const phone = await TEST_PHONE_NUMBER_REPOSITORY.create(
      getTestPhoneNumber({
        identityId: identity.id,
      }),
    );

    const accessToken = getTestAccessToken({
      subject: identity.id,
    });

    const response = await request(koa.callback())
      .get(`/protected/identities/${identity.id}/`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toStrictEqual({
      address: {
        care_of: "careOf",
        country: "country",
        locality: "locality",
        postal_code: "postalCode",
        region: "region",
        street_address: ["streetAddress1", "streetAddress2"],
      },
      birth_date: "2000-01-01",
      connected_providers: [oidc.provider],
      display_name: null,
      emails: [
        {
          email: email.email,
          primary: true,
          verified: true,
        },
      ],
      family_name: "familyName",
      gender: "gender",
      given_name: "givenName",
      gravatar: "https://gravatar.url/",
      locale: "sv-SE",
      middle_name: "middleName",
      nickname: "nickname",
      phone_numbers: [
        {
          phoneNumber: phone.phoneNumber,
          primary: true,
          verified: true,
        },
      ],
      picture: "https://picture.url/",
      preferred_username: "username",
      profile: "https://profile.url/",
      pronouns: "she/her",
      social_security_number: identity.socialSecurityNumber,
      username: identity.username,
      website: "https://website.url/",
      zone_info: "Europe/Stockholm",
    });
  });

  test("PUT /:id", async () => {
    const identity = await TEST_IDENTITY_REPOSITORY.create(
      getTestIdentity({
        id: randomUUID(),
      }),
    );

    const accessToken = getTestAccessToken({
      subject: identity.id,
    });

    await request(koa.callback())
      .put(`/protected/identities/${identity.id}/`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        birth_date: "2010-01-01",
        family_name: "new_familyName",
        gender: "new_gender",
        given_name: "new_givenName",
        locale: "en-GB",
        middle_name: "new_middleName",
        nickname: "new_nickname",
        picture: "https://picture.url/new/",
        preferred_username: "new_username",
        profile: "https://profile.url/new/",
        website: "https://website.url/new/",
        zone_info: "Europe/Berlin",
      })
      .expect(200);

    await expect(
      TEST_IDENTITY_REPOSITORY.find({ id: identity.id }),
    ).resolves.toStrictEqual(
      expect.objectContaining({
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
        website: "https://website.url/new/",
        zoneInfo: "Europe/Berlin",
      }),
    );
  });

  test("DELETE /:id", async () => {
    const identity = await TEST_IDENTITY_REPOSITORY.create(
      getTestIdentity({
        id: randomUUID(),
        displayName: {
          name: "removeThisName",
          number: 9999,
        },
      }),
    );
    await TEST_DISPLAY_NAME_REPOSITORY.create(
      getTestDisplayName({
        name: identity.displayName.name,
        numbers: [identity.displayName.number],
      }),
    );

    const accessToken = getTestAccessToken({
      subject: identity.id,
    });

    await request(koa.callback())
      .delete(`/protected/identities/${identity.id}/`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    await expect(TEST_IDENTITY_REPOSITORY.find({ id: identity.id })).rejects.toThrow(
      EntityNotFoundError,
    );
    await expect(
      TEST_DISPLAY_NAME_REPOSITORY.find({ name: identity.displayName.name }),
    ).resolves.toStrictEqual(
      expect.objectContaining({
        numbers: [],
      }),
    );
  });

  test("POST /:id/identifiers/:type", async () => {
    const identity = await TEST_IDENTITY_REPOSITORY.create(
      getTestIdentity({
        id: randomUUID(),
      }),
    );

    setAxiosResponse("POST", "communicationClient", "/private/connect-email", {});

    const accessToken = getTestAccessToken({
      subject: identity.id,
    });

    await request(koa.callback())
      .post(`/protected/identities/${identity.id}/identifiers/email`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        email: "new-identity-email@lindorm.io",
      })
      .expect(200);

    await expect(
      TEST_EMAIL_REPOSITORY.find({ email: "new-identity-email@lindorm.io" }),
    ).resolves.toStrictEqual(expect.any(Email));

    await expect(TEST_CONNECT_SESSION_CACHE.findMany({})).resolves.toStrictEqual(
      expect.arrayContaining([expect.any(ConnectSession)]),
    );
  });

  test("DELETE /:id/identifiers/:type", async () => {
    const identity = await TEST_IDENTITY_REPOSITORY.create(
      getTestIdentity({
        id: randomUUID(),
      }),
    );

    await TEST_EMAIL_REPOSITORY.create(
      getTestEmail({
        identityId: identity.id,
        email: "remove-identity-email@lindorm.io",
        primary: false,
      }),
    );

    const accessToken = getTestAccessToken({
      subject: identity.id,
    });

    await request(koa.callback())
      .delete(`/protected/identities/${identity.id}/identifiers/email`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        email: "remove-identity-email@lindorm.io",
      })
      .expect(200);

    await expect(
      TEST_EMAIL_REPOSITORY.find({ email: "remove-identity-email@lindorm.io" }),
    ).rejects.toThrow(EntityNotFoundError);
  });

  test("PUT /:id/identifiers/:type/set-primary", async () => {
    const identity = await TEST_IDENTITY_REPOSITORY.create(
      getTestIdentity({
        id: randomUUID(),
      }),
    );

    await TEST_EMAIL_REPOSITORY.create(
      getTestEmail({
        identityId: identity.id,
        email: "primary-identity-email@lindorm.io",
        primary: false,
      }),
    );

    const accessToken = getTestAccessToken({
      subject: identity.id,
    });

    await request(koa.callback())
      .put(`/protected/identities/${identity.id}/identifiers/email/set-primary`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        email: "primary-identity-email@lindorm.io",
      })
      .expect(200);

    await expect(
      TEST_EMAIL_REPOSITORY.find({ email: "primary-identity-email@lindorm.io" }),
    ).resolves.toStrictEqual(
      expect.objectContaining({
        primary: true,
      }),
    );
  });
});
