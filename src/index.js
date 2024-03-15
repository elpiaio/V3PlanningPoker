import fastify from "fastify";
import websocket from "@fastify/websocket";
import { userRoutes } from "./routes/user.routes";
import { roomRoutes } from "./routes/room.routes.js";
import { storyRoutes } from "./routes/story.routes.js";
import { voteRoutes } from "./routes/vote.routes.js";
import { wsRoutes } from "./routes/wsRoutes/voteOnStory.js";

const app = fastify();
app.register(websocket);

app.register(userRoutes);
app.register(roomRoutes);
app.register(storyRoutes);
app.register(voteRoutes);
app.register(wsRoutes);

app.listen({ port: 3005 }, (err) => {
  if (err) {
    console.error("Erro ao iniciar o servidor:", err);
  }

  console.log("Servidor iniciado na porta 3005");
});

