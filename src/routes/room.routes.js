import { create, get, getById } from "../controllers/room.controller";

export const roomRoutes = async app => {
    app.post("/room/:idUser", create);
    app.get("/room", get);
    app.get("/room/:id", getById);
}
