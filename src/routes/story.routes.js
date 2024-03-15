import { create, getAll, remove } from "../controllers/story.controller";

export const storyRoutes = async app => {
    app.post("/story", create);
    app.delete("/story/:id", remove);
    app.get("/story/:id", getAll);
}
