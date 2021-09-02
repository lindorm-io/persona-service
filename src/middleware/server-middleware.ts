import { MongoConnectionType } from "@lindorm-io/mongo";
import { RedisConnectionType } from "@lindorm-io/redis";
import { axiosMiddleware } from "@lindorm-io/koa-axios";
import { cacheMiddleware, redisMiddleware } from "@lindorm-io/koa-redis";
import { inMemoryCache, inMemoryStore } from "../test";
import { mongoMiddleware, repositoryMiddleware } from "@lindorm-io/koa-mongo";
import { tokenIssuerMiddleware } from "@lindorm-io/koa-jwt";
import {
  KeyPairCache,
  cacheKeysMiddleware,
  keystoreMiddleware,
} from "@lindorm-io/koa-keystore";
import {
  IS_TEST,
  MONGO_CONNECTION_OPTIONS,
  REDIS_CONNECTION_OPTIONS,
  config,
} from "../config";
import {
  ConnectSessionCache,
  DisplayNameRepository,
  EmailRepository,
  IdentityRepository,
  OpenIdIdentifierRepository,
  PhoneNumberRepository,
} from "../infrastructure";

export const serverMiddlewares = [
  // Axios

  axiosMiddleware({
    clientName: "axiosClient",
  })(),
  axiosMiddleware({
    baseUrl: config.COMMUNICATION_SERVICE_HOST,
    basicAuth: {
      username: config.COMMUNICATION_SERVICE_USERNAME,
      password: config.COMMUNICATION_SERVICE_PASSWORD,
    },
    clientName: "communicationClient",
  })(),

  // Repository

  mongoMiddleware({
    ...MONGO_CONNECTION_OPTIONS,
    type: IS_TEST ? MongoConnectionType.MEMORY : MONGO_CONNECTION_OPTIONS.type,
    inMemoryStore: IS_TEST ? inMemoryStore : undefined,
  }),
  repositoryMiddleware(DisplayNameRepository),
  repositoryMiddleware(EmailRepository),
  repositoryMiddleware(IdentityRepository),
  repositoryMiddleware(OpenIdIdentifierRepository),
  repositoryMiddleware(PhoneNumberRepository),

  // Cache

  redisMiddleware({
    ...REDIS_CONNECTION_OPTIONS,
    type: IS_TEST ? RedisConnectionType.MEMORY : REDIS_CONNECTION_OPTIONS.type,
    inMemoryCache: IS_TEST ? inMemoryCache : undefined,
  }),
  cacheMiddleware(ConnectSessionCache),
  cacheMiddleware(KeyPairCache),

  // JWT

  cacheKeysMiddleware,
  keystoreMiddleware,
  tokenIssuerMiddleware({
    issuer: config.BEARER_TOKEN_ISSUER,
  }),
];
