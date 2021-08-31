import { DefaultConfiguration } from "@lindorm-io/koa-config";

export interface Configuration extends DefaultConfiguration {
  SERVER_PORT: number;
  HOST: string;

  // Basic Auth
  BASIC_AUTH_USERNAME: string;
  BASIC_AUTH_PASSWORD: string;

  // Bearer Auth
  BEARER_TOKEN_ISSUER: string;

  // Crypto
  CRYPTO_AES_SECRET: string;
  CRYPTO_SHA_SECRET: string;

  // Expiry
  EXPIRY_CONNECT_IDENTIFIER_SESSION: string;

  // Services
  AUTHENTICATION_SERVICE_HOST: string;
  COMMUNICATION_SERVICE_HOST: string;
  COMMUNICATION_SERVICE_USERNAME: string;
  COMMUNICATION_SERVICE_PASSWORD: string;
  OAUTH_SERVICE_HOST: string;

  // Redis
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;

  // Mongo
  MONGO_HOST: string;
  MONGO_PORT: number;
  MONGO_DB_NAME: string;
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
}
