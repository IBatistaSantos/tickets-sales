import { Elysia } from 'elysia';
import { join } from 'path';

export const setupRoutes = async (app: Elysia): Promise<Elysia> => {
  const glob = new Bun.Glob("./src/modules/**/main/routes/*.routes.ts");

  for await (const path of glob.scan()) {
    const absolutePath = join(process.cwd(), path);
    const route = (await import(absolutePath)).default;
    route(app);
  }

  return app;
};
