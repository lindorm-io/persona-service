import { config } from "../config";
import { keyPairJwksCacheWorker } from "@lindorm-io/koa-keystore";
import { redisConnection } from "../instance";
import { winston } from "../logger";

export const bearerTokenIssuerKeyPairJwksWorker = keyPairJwksCacheWorker({
  baseUrl: config.BEARER_TOKEN_ISSUER,
  clientName: "BearerTokenIssuer",
  redisConnection,
  winston,
});
