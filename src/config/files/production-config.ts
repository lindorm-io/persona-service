import { Configuration } from "../interface";

export const productionConfig: Configuration = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: 3000,
  HOST: "https://identity.api.lindorm.io",

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
  COMMUNICATION_SERVICE_HOST: "https://communication.api.lindorm.io",
  COMMUNICATION_SERVICE_USERNAME: null,
  COMMUNICATION_SERVICE_PASSWORD: null,

  // Redis
  REDIS_HOST: null,
  REDIS_PORT: null,
  REDIS_USERNAME: null,
  REDIS_PASSWORD: null,

  // Mongo
  MONGO_HOST: null,
  MONGO_PORT: null,
  MONGO_DB_NAME: "identity",
  MONGO_USERNAME: null,
  MONGO_PASSWORD: null,
};
