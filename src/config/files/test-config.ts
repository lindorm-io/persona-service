import { Configuration } from "../interface";

export const testConfig: Configuration = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: 3002,
  HOST: "https://identity.test.api.lindorm.io",

  // Basic Auth
  BASIC_AUTH_USERNAME: "secret",
  BASIC_AUTH_PASSWORD: "secret",

  // Bearer Auth
  BEARER_TOKEN_ISSUER: "https://oauth.test.api.lindorm.io",

  // Crypto
  CRYPTO_AES_SECRET: "secret",
  CRYPTO_SHA_SECRET: "secret",

  // Expiry
  EXPIRY_CONNECT_IDENTIFIER_SESSION: "2 hours",

  // Services
  COMMUNICATION_SERVICE_HOST: "https://communication.test.api.lindorm.io",
  COMMUNICATION_SERVICE_USERNAME: "secret",
  COMMUNICATION_SERVICE_PASSWORD: "secret",

  // Redis
  REDIS_HOST: "localhost",
  REDIS_PORT: 6379,
  REDIS_PASSWORD: "secret",

  // Mongo
  MONGO_HOST: "localhost",
  MONGO_PORT: 27017,
  MONGO_DB_NAME: "authorization",
  MONGO_USERNAME: "secret",
  MONGO_PASSWORD: "secret",
};
