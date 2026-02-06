import fastify from "fastify";

const app = fastify({ logger: true });

app.get("/health", async () => ({ status: "ok" }));

const port = Number(process.env.BACKEND_PORT || 4000);
const host = "0.0.0.0";

app.listen({ port, host }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
