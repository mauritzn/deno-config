import { Application, Router } from "https://deno.land/x/denotrain@v0.4.0/mod.ts";

const app = new Application({ port: 3001 });
const router = new Router();

router.get("/", (ctx) => {
  // Returning a string, JSON, Reader or Uint8Array automatically sets
  // Content-Type header and no further router will match
  return new Promise((resolve) => resolve("This is the admin interface!"));
});
router.get("/edit", async (ctx) => {
  console.log(ctx);
  return "This is an edit mode!";
});

router.get("/test", (ctx) => {
  // Returning a json
  return { "hello": "world" };
});

app.use("", router);
await app.run();