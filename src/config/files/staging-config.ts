import { Configuration } from "../interface";

export const stagingConfig: Configuration = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: 3000,
  HOST: "https://identity.staging.api.lindorm.io",

  // Basic Auth
  BASIC_AUTH_USERNAME: null,
  BASIC_AUTH_PASSWORD: null,

  // Bearer Auth
  BEARER_TOKEN_ISSUER: null,

  // Crypto
  CRYPTO_AES_SECRET: null,
  CRYPTO_SHA_SECRET: null,

  // Expiry
  EXPIRY_CONNECT_IDENTIFIER_SESSION: "2 hours",

  // Services
  AUTHENTICATION_SERVICE_HOST: "https://authentication.staging.api.lindorm.io",
  COMMUNICATION_SERVICE_HOST: "https://communication.staging.api.lindorm.io",
  COMMUNICATION_SERVICE_USERNAME: null,
  COMMUNICATION_SERVICE_PASSWORD: null,
  OAUTH_SERVICE_HOST: "https://oauth.staging.api.lindorm.io",

  // Redis
  REDIS_HOST: null,
  REDIS_PORT: null,
  REDIS_PASSWORD: null,

  // Mongo
  MONGO_HOST: null,
  MONGO_PORT: null,
  MONGO_DB_NAME: "authorization",
  MONGO_USERNAME: null,
  MONGO_PASSWORD: null,
};
