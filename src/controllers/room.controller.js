import { createRoom, getRoom, getRoomById, getRoomByIdSimple, getRoomByUserId } from "../repositorys/room.repository";
import { voting } from "../../pubsub/voting-pub-sub";

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
        const rooms = await getRoom();
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

export const getByIdSimple = async (req, res) => {
    try {
        const room = await getRoomByIdSimple(Number(req.params.id));
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




