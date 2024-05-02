import { create,getById, update, remove, insert, leaveRoom, login, getUsersRoom, emailValidator } from "../controllers/user.controller";

export const userRoutes = async app => {
    app.post("/user", create);
    app.post("/emailValidator", emailValidator);
    app.get("/room/users/:roomId", getUsersRoom);
    app.get("/user/:id", getById);
    app.put("/user/:id", update);
    app.delete("/user/:id", remove);
    app.post("/user/insert", insert);
    app.delete("/user/remove/:userId/:roomId", leaveRoom);
    app.post("/user/login", login);
}

