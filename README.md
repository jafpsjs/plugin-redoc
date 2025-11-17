# @jafps/plugin-redoc

Fastify plugin for OpenAPI 3.1 API reference documentation.

It depends on [@fastify/helmet] and [@jafps/plugin-openapi].

## Usage

```ts
import redocPlugin from "@jafps/plugin-redoc";
import helmetPlugin from "@fastify/helmet";
import openapiPlugin from "@jafps/plugin-openapi";

await app.register(helmetPlugin, { global: false });
await app.register(openapiPlugin, {
  openapi: {
    info: {
      title: "API",
      version: "1.0.0"
    }
  }
});
await app.register(redocPlugin);
```

If [@fastify/static] is used, `staticOptions.decorateReply` need to be set to `false`.

[@fastify/static]: https://github.com/fastify/fastify-static
[@fastify/helmet]: https://github.com/fastify/fastify-helmet
[@jafps/plugin-openapi]: https://github.com/jafpsjs/plugin-openapi
