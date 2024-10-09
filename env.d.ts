import type { Env } from "@/utils/env";

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var prisma: PrismaClient | undefined;
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
