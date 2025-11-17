import { join, resolve } from "node:path";
import staticPlugin from "@fastify/static";
import fp from "fastify-plugin";
import { addFontsRoutes } from "./fonts.js";
import type {} from "@fastify/helmet";
import type {} from "@jafps/plugin-openapi";
import type {} from "@jafps/plugin-schema";
import type { LogLevel } from "fastify";

/* node:coverage disable */
export type RedocPluginOptions = {
  /**
   * Prefix for API documentation and related files.
   *
   * Default to `/api`.
   */
  prefix?: string;
  staticOptions?: {
    /**
     * Default to `true`.
     */
    decorateReply?: boolean;

    /**
     * Default to `true`.
     */
    immutable?: boolean;

    /**
     * Default to `"silent"`.
     */
    logLevel?: LogLevel;

    /**
     * Default to `"30d"`.
     */
    maxAge?: number | string;
  };
};

/* node:coverage enable */

export const name = "@jafps/plugin-redoc";

export default fp<RedocPluginOptions>(
  async (app, opts) => {
    const {
      prefix = "/api",
      staticOptions: {
        decorateReply = true,
        immutable = true,
        logLevel = "silent",
        maxAge = "30d"
      } = {}
    } = opts;
    await app.register(staticPlugin, {
      decorateReply,
      immutable,
      logLevel,
      maxAge,
      prefix,
      root: [
        resolve(join(import.meta.dirname, "..", "public"))
      ],
      serve: false
    });

    app.get(prefix, { config: { openapi: { hide: true } } }, async (_req, res) => {
      await res.redirect(`${prefix}/`, 301);
    });

    app.get(
      `${prefix}/`,
      {
        config: { openapi: { hide: true } },
        helmet: {
          contentSecurityPolicy: {
            directives: {
              "font-src": ["'self'"],
              "style-src": ["'self'", "'unsafe-inline'"],
              "worker-src": ["'self'", "blob:"]
            },
            useDefaults: true
          },
          crossOriginEmbedderPolicy: true,
          crossOriginOpenerPolicy: true,
          crossOriginResourcePolicy: true,
          originAgentCluster: true,
          referrerPolicy: { policy: "no-referrer" },
          xContentTypeOptions: true,
          xDnsPrefetchControl: { allow: false },
          xDownloadOptions: true,
          xFrameOptions: { action: "deny" },
          xPermittedCrossDomainPolicies: { permittedPolicies: "none" },
          xXssProtection: true
        }
      },
      async (_req, res) => {
        await res.sendFile("redoc.html");
      }
    );
    const files = ["redoc.standalone.js", "redoc.standalone.js.map", "favicon.svg"];
    for (const file of files) {
      app.get(
        `${prefix}/${file}`,
        { config: { openapi: { hide: true } } },
        async (_req, res) => {
          await res.sendFile(file);
        }
      );
    }
    app.get(
      `${prefix}/openapi.json`,
      { config: { openapi: { hide: true } } },
      async function (_req, res) {
        await res.send(this.openapi());
      }
    );
    addFontsRoutes(app, prefix);
  },
  {
    decorators: {},
    dependencies: ["@jafps/plugin-openapi", "@fastify/helmet"],
    fastify: "5.x",
    name
  }
);
