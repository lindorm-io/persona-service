import { Context } from "../../typing";
import { Scope } from "../../enum";
import { bearerAuthMiddleware, identityEntityMiddleware } from "../../middleware";
import {
  Router,
  createController,
  paramsMiddleware,
  schemaMiddleware,
} from "@lindorm-io/koa";
import {
  identifierConnectInitialiseController,
  identifierConnectInitialiseSchema,
  identifierRemoveController,
  identifierRemoveSchema,
  identifierSetPrimaryController,
  identifierSetPrimarySchema,
  identityGetController,
  identityGetSchema,
  identityRemoveController,
  identityRemoveSchema,
  identityUpdateController,
  identityUpdateSchema,
} from "../../controller";

const router = new Router<unknown, Context>();
export default router;

router.get(
  "/:id",
  paramsMiddleware,
  schemaMiddleware("data", identityGetSchema),
  bearerAuthMiddleware({
    scopes: [Scope.OPENID],
    fromPath: { subject: "data.id" },
  }),
  identityEntityMiddleware("data.id"),
  createController(identityGetController),
);

router.put(
  "/:id",
  paramsMiddleware,
  schemaMiddleware("data", identityUpdateSchema),
  bearerAuthMiddleware({
    scopes: [Scope.OPENID, Scope.UPDATE_IDENTITY],
    fromPath: { subject: "data.id" },
  }),
  identityEntityMiddleware("data.id"),
  createController(identityUpdateController),
);

router.delete(
  "/:id",
  paramsMiddleware,
  schemaMiddleware("data", identityRemoveSchema),
  bearerAuthMiddleware({
    scopes: [Scope.OPENID, Scope.REMOVE_IDENTITY],
    fromPath: { subject: "data.id" },
  }),
  identityEntityMiddleware("data.id"),
  createController(identityRemoveController),
);

router.post(
  "/:id/identifiers/:type",
  paramsMiddleware,
  schemaMiddleware("data", identifierConnectInitialiseSchema),
  bearerAuthMiddleware({
    scopes: [Scope.OPENID, Scope.UPDATE_IDENTITY],
    fromPath: { subject: "data.id" },
  }),
  identityEntityMiddleware("data.id"),
  createController(identifierConnectInitialiseController),
);

router.delete(
  "/:id/identifiers/:type",
  paramsMiddleware,
  schemaMiddleware("data", identifierRemoveSchema),
  bearerAuthMiddleware({
    scopes: [Scope.OPENID, Scope.UPDATE_IDENTITY],
    fromPath: { subject: "data.id" },
  }),
  identityEntityMiddleware("data.id"),
  createController(identifierRemoveController),
);

router.put(
  "/:id/identifiers/:type/set-primary",
  paramsMiddleware,
  schemaMiddleware("data", identifierSetPrimarySchema),
  bearerAuthMiddleware({
    scopes: [Scope.OPENID, Scope.UPDATE_IDENTITY],
    fromPath: { subject: "data.id" },
  }),
  identityEntityMiddleware("data.id"),
  createController(identifierSetPrimaryController),
);
