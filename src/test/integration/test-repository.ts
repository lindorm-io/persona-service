import { mongoConnection } from "../../instance";
import { winston } from "../../logger";
import {
  DisplayNameRepository,
  EmailRepository,
  IdentityRepository,
  OpenIdIdentifierRepository,
  PhoneNumberRepository,
} from "../../infrastructure";

interface TestRepository {
  displayNameRepository: DisplayNameRepository;
  emailRepository: EmailRepository;
  identityRepository: IdentityRepository;
  openIdIdentifierRepository: OpenIdIdentifierRepository;
  phoneNumberRepository: PhoneNumberRepository;
}

export const getTestRepository = async (): Promise<TestRepository> => {
  await mongoConnection.waitForConnection();
  const db = mongoConnection.database();
  const logger = winston;

  return {
    displayNameRepository: new DisplayNameRepository({ db, logger }),
    emailRepository: new EmailRepository({ db, logger }),
    identityRepository: new IdentityRepository({ db, logger }),
    openIdIdentifierRepository: new OpenIdIdentifierRepository({ db, logger }),
    phoneNumberRepository: new PhoneNumberRepository({ db, logger }),
  };
};
