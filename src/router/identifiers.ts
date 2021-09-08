import { Context } from "../typing";
import { connectSessionEntityMiddleware } from "../middleware";
import {
  createController,
  paramsMiddleware,
  Router,
  schemaMiddleware,
} from "@lindorm-io/koa";
import {
  identifierConnectVerifyController,
  identifierConnectVerifySchema,
} from "../controller";

const router = new Router<unknown, Context>();
export default router;

router.post(
  "/connect-session/:id/verify",
  paramsMiddleware,
  schemaMiddleware("data", identifierConnectVerifySchema),
  connectSessionEntityMiddleware("data.id"),
  createController(identifierConnectVerifyController),
);
