import { voting } from "../../pubsub/voting-pub-sub";
import { createUser, getUsersRoom, getById, updateUser, deleteUser, joinUserRoom, exitUserRoom, loginUser } from "../repositorys/user.repository";

export const create = async (req, res) => {
    try {
        const user = await createUser(req.body);
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
}

export const getUsersRoom  = async (req, res) => {
    try {
        const users = await getUsersRoom(Number(req.params.roomId));
        voting.publish(req.params.roomId, users)
        res.status(200).send(users)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

export const getById = async (req, res) => {
    try {
        const user = await getById(Number(req.params.id));
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
}

export const update = async (req, res) => {
    try {
        const user = await updateUser(Number(req.params.id), req.body);
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
}

export const remove = async (req, res) => {
    try {
        await deleteUser(Number(req.params.id))
        res.status(200).send("deletado com sucesso")
    } catch (e) {
        res.status(400).send(e)
    }
}

export const insert = async (req, res) => {
    try {
        const userRoom = await joinUserRoom(req.body);
        res.status(200).send(userRoom)
        voting.publish(req.params.userId, userRoom)
    } catch (e) {
        res.status(400).send(e)
    }
}

export const leaveRoom = async (req, res) => {
    try {
        const users = await exitUserRoom(Number(req.params.userId), Number(req.params.roomId));
        voting.publish(req.params.userId, users)
        res.status(200).send(users)
    } catch (e) {
        res.status(400).send(e)
    }
}



export const login = async (req, res) => {
    try {
        const user = await loginUser(req.body);
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
}


