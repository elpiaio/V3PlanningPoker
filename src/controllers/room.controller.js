import { activeStoryRepository, createRoom, getRoom, getRoomById, getRoomByIdGuidSimple, getRoomByUserId, getRooms, visualizationModeRep } from "../repositorys/room.repository";
import { voting, roomws } from "../../pubsub/pub-sub";

export const create = async (req, res) => {
    try {
        const room = await createRoom(req.body, Number(req.params.idUser));
        res.status(200).send(room);

    } catch (e) {
        res.status(400).send(e);
    }
}

export const get = async (req, res) => {
    try {
        const rooms = await getRooms();
        res.status(200).send(rooms);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const getById = async (req, res) => {
    try {
        const room = await getRoomById(Number(req.params.id));
        res.status(200).send(room);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const getByIdGuid = async (req, res) => {
    try {
        const room = await getRoomByIdGuidSimple(req.params.id);
        res.status(200).send(room);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const getRoomByUser = async (req, res) => {
    try {
        const room = await getRoomByUserId(Number(req.params.id));
        res.status(200).send(room);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const activeStory = async (req, res) => {
    try {
        const room = await activeStoryRepository(Number(req.params.id), req.body);
        room.type = "voting";
        roomws.publish(req.params.id, room)
        res.status(200).send(room);
    } catch (e) {
        res.status(400).send(e);
    }
}

export const visualizationMode = async (req, res) => {
    try {
        const story = await visualizationModeRep(Number(req.params.id), req.body);
        story.type = "voting";
        roomws.publish(req.params.id, story)
        res.status(200).send(story);
    } catch (e) {
        res.status(400).send(e);
    }
}