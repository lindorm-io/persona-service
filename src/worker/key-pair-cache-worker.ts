import { config, REDIS_CONNECTION_OPTIONS } from "../config";
import { keyPairJwksCacheWorker } from "@lindorm-io/koa-keystore";
import { winston } from "../logger";

export const bearerTokenIssuerKeyPairJwksWorker = keyPairJwksCacheWorker({
  baseUrl: config.BEARER_TOKEN_ISSUER,
  clientName: "BearerTokenIssuer",
  redisConnectionOptions: REDIS_CONNECTION_OPTIONS,
  winston,
});
