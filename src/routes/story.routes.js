import { Refresh, Voted, Voting, create, getAll, remove, showVotes, finishVotation, } from "../controllers/story.controller";

export const storyRoutes = async app => {
    app.post("/story", create);
    app.delete("/story/:id", remove);
    app.get("/story/:id", getAll);
    //adm configurations
    app.put("/story/Voted/:id", Voted);
    app.put("/story/Voting/:id", Voting);
    app.put("/story/showVotes/:id", showVotes);
    app.put("/story/finishVotation/:id", finishVotation);
    app.put("/story/Refresh/:id", Refresh);
}
