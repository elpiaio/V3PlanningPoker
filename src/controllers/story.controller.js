import { voting } from "../../pubsub/voting-pub-sub";
import { RefreshRep, VotedRep, VotingRep, createStory, deleteStory, get, showVotesRep, showResultsRep, finishVotationRep } from "../repositorys/story.repository";

export const create = async (req, res) => {
    try {
        const story = await createStory(req.body);
        story.type = "add_story";
        console.log(story.type);
        voting.publish(req.body.roomId, story);
        res.status(200).send(story);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const remove = async (req, res) => {
    try {
        const story = await deleteStory(Number(req.params.id));
        story.type = "story_deleted";
        console.log(story.type);
        voting.publish(story.roomId, story)
        res.status(200).send(story);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const getAll = async (req, res) => {
    try {
        const stories = await get(Number(req.params.id));
        voting.publish(req.params.id, stories)
        res.status(200).send(stories);
    } catch (e) {
        res.status(400).send(e);
    }
}


//configurações de admin

export const Voted = async (req, res) => {
    try {
        const story = await VotedRep(Number(req.params.id), req.body);
        story.type = "Voted";
        voting.publish(req.params.id, story)
        res.status(200).send(story);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const Voting = async (req, res) => {
    try {
        const story = await VotingRep(Number(req.params.id), req.body);
        story.type = "Voting";
        voting.publish(req.params.id, story)
        res.status(200).send(story);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const finishVotation = async (req, res) => {
    try {
        const story = await finishVotationRep(Number(req.params.id), req.body);
        story.type = "finish_Votation";
        voting.publish(req.params.id, story)
        res.status(200).send(story);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const showVotes = async (req, res) => {
    try {
        const story = await showVotesRep(Number(req.params.id), req.body);
        story.type = "show_Votes";
        voting.publish(req.params.id, story)
        res.status(200).send(story);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const showResults = async (req, res) => {
    try {
        const story = await showResultsRep(Number(req.params.id));
        story.type = "show_Results";
        voting.publish(req.params.id, story)
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
            voting.publish(req.params.id, status)
            res.status(200).send(status);
        }
    } catch (e) {
        res.status(400).send(e);
    }
}