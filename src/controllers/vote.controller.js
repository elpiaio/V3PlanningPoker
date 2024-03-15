import { createVote, updateVote , votingTrue } from "../repositorys/vote.repository";
import { voting } from "../../pubsub/voting-pub-sub";

export const create = async (req, res) => {
    try {
        const vote = await createVote(req.body);
        voting.publish(vote.storyId, vote)
        res.status(200).send(vote)
    } catch (e) {
        res.status(400).send(e)
    }
}

export const update = async (req, res) => {
    try {
        const vote = await updateVote(Number(req.params.id), req.body);
        voting.publish(vote.storyId, vote)
        res.status(200).send(vote)
    } catch (e) {
        res.status(400).send(e)
    }
}

export const votingAlt = async (req, res) => {
    try {
        const vote = await votingTrue(req.body);
        res.status(200).send(vote)
    } catch (e) {
        res.status(400).send(e)
    }
}

