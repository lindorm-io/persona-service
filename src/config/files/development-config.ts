import { Configuration } from "../interface";

export const developmentConfig: Configuration = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: 3002,
  HOST: "http://localhost",

  // Basic Auth
  BASIC_AUTH_USERNAME: "secret",
  BASIC_AUTH_PASSWORD: "secret",

  // Bearer Auth
  BEARER_TOKEN_ISSUER: "http://localhost:3004",

  // Crypto
  CRYPTO_AES_SECRET: "secret",
  CRYPTO_SHA_SECRET: "secret",

  // Expiry
  EXPIRY_CONNECT_IDENTIFIER_SESSION: "2 hours",

  // Services
  AUTHENTICATION_SERVICE_HOST: "http://localhost:3005",
  COMMUNICATION_SERVICE_HOST: "http://localhost:3009",
  COMMUNICATION_SERVICE_USERNAME: "secret",
  COMMUNICATION_SERVICE_PASSWORD: "secret",
  OAUTH_SERVICE_HOST: "http://localhost:3004",

  // Redis
  REDIS_HOST: "localhost",
  REDIS_PORT: 6379,
  REDIS_PASSWORD: "secret",

  // Mongo
  MONGO_HOST: "localhost",
  MONGO_PORT: 27017,
  MONGO_DB_NAME: "identity",
  MONGO_USERNAME: "root",
  MONGO_PASSWORD: "example",
};
