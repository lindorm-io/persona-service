import { Context } from "../../typing";
import {
  createController,
  paramsMiddleware,
  Router,
  schemaMiddleware,
} from "@lindorm-io/koa";
import {
  identifierAuthVerifyController,
  identifierAuthVerifySchema,
} from "../../controller";
import { basicAuthMiddleware } from "../../middleware";

const router = new Router<unknown, Context>();
export default router;

router.use(basicAuthMiddleware);

router.post(
  "/:type/auth/verify",
  paramsMiddleware,
  schemaMiddleware("data", identifierAuthVerifySchema),
  createController(identifierAuthVerifyController),
);
