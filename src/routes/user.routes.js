import { create,getById, update, remove, insert, leaveRoom, login, getUsersRoom, emailValidator, passwordCode, replacePassword, getByEmail, updateStatus, passwordValidator } from "../controllers/user.controller";

export const userRoutes = async app => {
    app.post("/user", create);
    app.post("/emailValidator", emailValidator);
    app.get("/room/users/:roomId", getUsersRoom);
    app.get("/user/:id", getById);
    app.get("/user/email/:email", getByEmail)
    app.put("/user/:id", update);
    app.delete("/user/:id", remove);
    app.post("/user/insert", insert);
    app.delete("/user/remove", leaveRoom);
    app.post("/user/login", login);
    app.post("/user/passwordCode", passwordCode)
    app.put("/user/replacePassword", replacePassword)
    app.put("/user/updateStatus", updateStatus)
    app.post("/passwordValidator", passwordValidator);
}

