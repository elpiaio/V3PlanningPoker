import { create, get, getById, getByIdSimple, getRoomByUser } from "../controllers/room.controller";

export const roomRoutes = async app => {
    app.post("/room/:idUser", create);
    app.get("/room", get);
    app.get("/room/:id", getById);
    app.get("/room/simple/:id", getByIdSimple)
    app.get("/user/rooms/:id", getRoomByUser)
}
