import { voting, roomws } from "../../pubsub/pub-sub";
import { RefreshRep, VotedRep, VotingRep, createStory, deleteStory, get, showVotesRep, finishVotationRep, visualizationModeRep, userVotesRepository } from "../repositorys/story.repository";

export const create = async (req, res) => {
    try {
        const story = await createStory(req.body);
        story.type = "add_story";
        roomws.publish(req.body.roomId, story);
        res.status(200).send(story);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const remove = async (req, res) => {
    try {
        const story = await deleteStory(Number(req.params.id));
        story.type = "story_deleted";
        roomws.publish(story.roomId, story)
        res.status(200).send(story);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const getAll = async (req, res) => {
    try {
        const story = await get(Number(req.params.id));
        roomws.publish(req.params.id, story)
        res.status(200).send(story);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const getUserVotes = async (req, res) => {
    try {
        const userVotes = await userVotesRepository(Number(req.params.id), req.body);
        roomws.publish(req.params.id, userVotes)
        res.status(200).send(userVotes);
    } catch (e) {
        res.status(400).send(e);
    }
}


//configurações de admin

// export const Voted = async (req, res) => {
//     try {
//         const story = await VotedRep(Number(req.params.id), req.body);
//         story.type = "Voted";
//         roomws.publish(req.params.id, story)
//         res.status(200).send(story);
//     } catch (e) {
//         res.status(400).send(e);
//     }
// }

export const Voting = async (req, res) => {
    try {
        const story = await VotingRep(Number(req.params.id), req.body);
        story.type = "Voting";
        roomws.publish(req.params.id, story)
        res.status(200).send(story);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const finishVotation = async (req, res) => {
    try {
        const story = await finishVotationRep(Number(req.params.id), req.body);
        story.type = "finish_Votation";
        roomws.publish(req.params.id, story)
        res.status(200).send(story);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const showVotes = async (req, res) => {
    try {
        const story = await showVotesRep(Number(req.params.id), req.body);
        story.type = "show_Votes";
        roomws.publish(req.params.id, story)
        res.status(200).send(story);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const Refresh = async (req, res) => {
    try {
        const status = await RefreshRep(Number(req.params.id), req.body);
        if (status) {
            status.type = "Refresh";
            roomws.publish(req.params.id, status)
            res.status(200).send(status);
        }
    } catch (e) {
        res.status(400).send(e);
    }
}