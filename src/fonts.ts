import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Type } from "typebox";
import type { FastifyInstance } from "fastify";

export function addFontsRoutes(app: FastifyInstance, prefix: string): void {
  const fonts = ["montserrat", "roboto"];
  const sizes = [300, 400, 700];
  for (const font of fonts) {
    const fontRoot = resolve(dirname(fileURLToPath(import.meta.resolve(`@fontsource/${font}`))));
    for (const size of sizes) {
      app.get(
        `${prefix}/fonts/${font}/${size}.css`,
        { config: { openapi: { hide: true } } },
        async (_req, res) => {
          await res.sendFile(`${size}.css`, fontRoot, { immutable: true });
        }
      );
    }
    app.get(
      `${prefix}/fonts/${font}/files/:name.woff2`,
      {
        config: { openapi: { hide: true } },
        schema: { params: Type.Object({ name: Type.String() }) }
      },
      async (req, res) => {
        const name = req.params.name;
        await res.sendFile(`files/${name}.woff2`, fontRoot, { immutable: true });
      }
    );
    app.get(
      `${prefix}/fonts/${font}/files/:name.woff`,
      {
        config: { openapi: { hide: true } },
        schema: { params: Type.Object({ name: Type.String() }) }
      },
      async (req, res) => {
        const name = req.params.name;
        await res.sendFile(`files/${name}.woff`, fontRoot, { immutable: true });
      }
    );
  }
}
