import { ConnectSessionCache } from "../infrastructure";
import { KeyPairCache } from "@lindorm-io/koa-keystore";
import { getTestRedis } from "./test-infrastructure";
import { winston } from "../logger";

interface TestCache {
  connectSessionCache: ConnectSessionCache;
  keyPairCache: KeyPairCache;
}

export const getTestCache = async (): Promise<TestCache> => {
  const redis = await getTestRedis();
  const client = redis.client();
  const logger = winston;
  return {
    connectSessionCache: new ConnectSessionCache({ client, logger }),
    keyPairCache: new KeyPairCache({ client, logger }),
  };
};
