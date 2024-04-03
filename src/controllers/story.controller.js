import { voting } from "../../pubsub/voting-pub-sub";
import { createStory, deleteStory, get } from "../repositorys/story.repository";

export const create = async (req, res) => {
    try {
        const stories = await createStory(req.body);
        voting.publish(req.body.roomId, stories);
        res.status(200).send(stories);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const remove = async (req, res) => {
    try {
        const stories = await deleteStory(Number(req.params.id));
        voting.publish(stories[0].roomId, stories)
        res.status(200).send(stories);
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


