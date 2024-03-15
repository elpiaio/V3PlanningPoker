import { create,getId, update, remove, insert, leaveRoom, login, getUserRoom } from "../controllers/user.controller";

export const userRoutes = async app => {
    app.post("/user", create);
    app.get("/userRoom/:roomId", getUserRoom);
    app.get("/user/:id", getId);
    app.put("/user/:id", update);
    app.delete("/user/:id", remove);
    app.post("/user/insert/:userId/:roomId", insert);
    app.delete("/user/remove/:userId/:roomId", leaveRoom);
    app.post("/user/login", login);
}

