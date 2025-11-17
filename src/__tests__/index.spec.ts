import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import helmetPlugin from "@fastify/helmet";
import openapiPlugin from "@jafps/plugin-openapi";
import fastify from "fastify";
import redocPlugin from "../index.js";
import type { FastifyInstance } from "fastify";

describe("@jafps/plugin-redoc", () => {
  let app: FastifyInstance;
  before(async () => {
    app = await fastify();
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
    await app.ready();
  });

  it("should return redoc", async () => {
    const res = await app.inject({
      method: "GET",
      path: "/api/"
    });
    assert.equal(res.statusCode, 200);
  });

  it("should return css", async () => {
    const res = await app.inject({
      method: "GET",
      path: "/api/fonts/roboto/300.css"
    });
    assert.equal(res.statusCode, 200);
  });

  it("should return woff font", async () => {
    const res = await app.inject({
      method: "GET",
      path: "/api/fonts/roboto/files/roboto-latin-700-normal.woff"
    });
    assert.equal(res.statusCode, 200);
  });

  it("should return woff2 font", async () => {
    const res = await app.inject({
      method: "GET",
      path: "/api/fonts/roboto/files/roboto-latin-700-normal.woff2"
    });
    assert.equal(res.statusCode, 200);
  });

  it("should not return font", async () => {
    const res = await app.inject({
      method: "GET",
      path: "/api/fonts/roboto/files/.woff2"
    });
    assert.equal(res.statusCode, 404);
  });

  it("should return js", async () => {
    const res = await app.inject({
      method: "GET",
      path: "/api/redoc.standalone.js"
    });
    assert.equal(res.statusCode, 200);
  });

  it("should return OpenAPI json", async () => {
    const res = await app.inject({
      method: "GET",
      path: "/api/openapi.json"
    });
    assert.equal(res.statusCode, 200);
  });

  it("should redirect", async () => {
    const res = await app.inject({
      method: "GET",
      path: "/api"
    });
    assert.equal(res.statusCode, 301);
  });
});
