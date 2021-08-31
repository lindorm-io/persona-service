import { KoaApp } from "@lindorm-io/koa";
import { config, IS_TEST } from "../config";
import { join } from "path";
import { bearerTokenIssuerKeyPairJwksWorker } from "../worker";
import { serverMiddlewares } from "../middleware";
import { winston } from "../logger";

export const koa = new KoaApp({
  host: config.HOST,
  logger: winston,
  port: config.SERVER_PORT,
});

koa.addMiddlewares(serverMiddlewares);
koa.addRoutesAutomatically(join(__dirname, "..", "router"));

// workers
if (!IS_TEST) {
  koa.addWorker(bearerTokenIssuerKeyPairJwksWorker);
}
