import { Context } from "../../typing";
import {
  createController,
  paramsMiddleware,
  Router,
  schemaMiddleware,
} from "@lindorm-io/koa";
import { basicAuthMiddleware, identityEntityMiddleware } from "../../middleware";
import {
  identityGetAuthMethodsController,
  identityGetAuthMethodsSchema,
  userinfoAddController,
  userinfoAddSchema,
  userinfoGetController,
  userinfoGetSchema,
} from "../../controller";

const router = new Router<unknown, Context>();
export default router;

router.use(basicAuthMiddleware);

router.get(
  "/:id/auth-methods",
  paramsMiddleware,
  schemaMiddleware("data", identityGetAuthMethodsSchema),
  createController(identityGetAuthMethodsController),
);

router.get(
  "/:id/userinfo",
  paramsMiddleware,
  schemaMiddleware("data", userinfoGetSchema),
  identityEntityMiddleware("data.id"),
  createController(userinfoGetController),
);

router.put(
  "/:id/userinfo",
  paramsMiddleware,
  schemaMiddleware("data", userinfoAddSchema),
  identityEntityMiddleware("data.id"),
  createController(userinfoAddController),
);
