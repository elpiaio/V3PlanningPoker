import { create,update} from "../controllers/vote.controller";

export const voteRoutes = async app => {
    app.post("/vote", create);
    app.put("/vote/:id", update);
    app.put("/vote/voting", update);
}
