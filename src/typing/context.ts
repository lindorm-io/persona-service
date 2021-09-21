import { Axios } from "@lindorm-io/axios";
import { IssuerVerifyData, TokenIssuer } from "@lindorm-io/jwt";
import { KeyPair, Keystore } from "@lindorm-io/key-pair";
import { KeyPairCache } from "@lindorm-io/koa-keystore";
import { KoaContext } from "@lindorm-io/koa";
import { MongoConnection } from "@lindorm-io/mongo";
import { RedisConnection } from "@lindorm-io/redis";
import {
  ConnectSession,
  DisplayName,
  Email,
  Identity,
  OpenIdIdentifier,
  PhoneNumber,
} from "../entity";
import {
  ConnectSessionCache,
  DisplayNameRepository,
  EmailRepository,
  IdentityRepository,
  OpenIdIdentifierRepository,
  PhoneNumberRepository,
} from "../infrastructure";

export interface Context<
  RequestData extends Record<string, any> = Record<string, any>,
  ResponseBody = unknown,
> extends KoaContext<RequestData, ResponseBody> {
  axios: {
    axiosClient: Axios;
    communicationClient: Axios;
  };
  cache: {
    connectSessionCache: ConnectSessionCache;
    keyPairCache: KeyPairCache;
  };
  connection: {
    mongo: MongoConnection;
    redis: RedisConnection;
  };
  entity: {
    connectSession: ConnectSession;
    displayName: DisplayName;
    email: Email;
    identity: Identity;
    openIdIdentifier: OpenIdIdentifier;
    phoneNumber: PhoneNumber;
  };
  jwt: TokenIssuer;
  keys: Array<KeyPair>;
  keystore: Keystore;
  repository: {
    displayNameRepository: DisplayNameRepository;
    emailRepository: EmailRepository;
    identityRepository: IdentityRepository;
    openIdIdentifierRepository: OpenIdIdentifierRepository;
    phoneNumberRepository: PhoneNumberRepository;
  };
  token: {
    bearerToken: IssuerVerifyData<never, never>;
  };
}
