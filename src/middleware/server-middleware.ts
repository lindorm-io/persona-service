import { axiosMiddleware } from "@lindorm-io/koa-axios";
import { cacheMiddleware, redisMiddleware } from "@lindorm-io/koa-redis";
import { config } from "../config";
import { mongoConnection, redisConnection } from "../instance";
import { mongoMiddleware, repositoryMiddleware } from "@lindorm-io/koa-mongo";
import { tokenIssuerMiddleware } from "@lindorm-io/koa-jwt";
import {
  KeyPairCache,
  cacheKeysMiddleware,
  keystoreMiddleware,
} from "@lindorm-io/koa-keystore";
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

  mongoMiddleware(mongoConnection),
  repositoryMiddleware(DisplayNameRepository),
  repositoryMiddleware(EmailRepository),
  repositoryMiddleware(IdentityRepository),
  repositoryMiddleware(OpenIdIdentifierRepository),
  repositoryMiddleware(PhoneNumberRepository),

  // Cache

  redisMiddleware(redisConnection),
  cacheMiddleware(ConnectSessionCache),
  cacheMiddleware(KeyPairCache),

  // JWT

  cacheKeysMiddleware,
  keystoreMiddleware,
  tokenIssuerMiddleware({
    issuer: config.BEARER_TOKEN_ISSUER,
  }),
];
