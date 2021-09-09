import { getTestCache } from "./test-cache";
import { getTestKeyPairEC } from "./test-key-pair";
import { getTestRepository } from "./test-repository";
import {
  ConnectSessionCache,
  DisplayNameRepository,
  EmailRepository,
  IdentityRepository,
  OpenIdIdentifierRepository,
  PhoneNumberRepository,
} from "../../infrastructure";

export let TEST_CONNECT_SESSION_CACHE: ConnectSessionCache;

export let TEST_DISPLAY_NAME_REPOSITORY: DisplayNameRepository;
export let TEST_EMAIL_REPOSITORY: EmailRepository;
export let TEST_IDENTITY_REPOSITORY: IdentityRepository;
export let TEST_OPEN_ID_IDENTIFIER_REPOSITORY: OpenIdIdentifierRepository;
export let TEST_PHONE_NUMBER_REPOSITORY: PhoneNumberRepository;

export const setupIntegration = async (): Promise<void> => {
  const { connectSessionCache, keyPairCache } = await getTestCache();
  const {
    displayNameRepository,
    emailRepository,
    identityRepository,
    openIdIdentifierRepository,
    phoneNumberRepository,
  } = await getTestRepository();

  TEST_CONNECT_SESSION_CACHE = connectSessionCache;

  TEST_DISPLAY_NAME_REPOSITORY = displayNameRepository;
  TEST_EMAIL_REPOSITORY = emailRepository;
  TEST_IDENTITY_REPOSITORY = identityRepository;
  TEST_OPEN_ID_IDENTIFIER_REPOSITORY = openIdIdentifierRepository;
  TEST_PHONE_NUMBER_REPOSITORY = phoneNumberRepository;

  await keyPairCache.create(getTestKeyPairEC());
};
