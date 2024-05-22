import { activeStory, create, deleteRoom, get, getById, getByIdGuid, getRoomByUser, newAdm, visualizationMode, } from "../controllers/room.controller";

export const roomRoutes = async app => {
    app.post("/room/:idUser", create);
    app.get("/room", get);
    app.get("/room/:id", getById);
    app.get("/room/uuid/:id", getByIdGuid)
    app.get("/user/rooms/:id", getRoomByUser)
    app.put("/activeStory/:id", activeStory)
    app.put("/story/visualizationMode/:id", visualizationMode) 
    app.put("/room/newAdm/:id", newAdm)
    app.delete("/room/deleteRoom/:id", deleteRoom)
}
