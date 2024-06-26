import { voting, roomws } from "../../pubsub/pub-sub";
import { createUser, getUsersRoom, getById, updateUser, deleteUser, insertUserRoom, exitUserRoom, loginUser, emailValidatorRepository, passwordRecoveryRepository, passwordCodeRepository, replacePasswordRepository, getByEmailRepository, UpdateStatusRepository, passwordValidatorRepository } from "../repositorys/user.repository";

export const create = async (req, res) => {
    try {
        const user = await createUser(req.body);
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
}

export const emailValidator = async (req, res) => {
    try {
        const Number = await emailValidatorRepository(req.body);
        res.status(200).send(Number)
    } catch (e) {
        res.status(400).send(e)
    }

}

export const getUsersRoom = async (req, res) => {
    try {
        const users = await getUsersRoom(Number(req.params.roomId));
        voting.publish(req.params.roomId, users)
        res.status(200).send(users)
    } catch (e) {
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

export const getByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        console.log('Email:', email);
        if (!email) {
            return res.status(400).send({ error: "Email is required" });
        }
        const user = await getByEmailRepository(email);
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
        const userRoom = await insertUserRoom(req.body);
        userRoom.type = 'insertUser';
        roomws.publish(req.body.roomId, userRoom)
        res.status(200).send(userRoom)
    } catch (e) {
        res.status(400).send(e)
    }
}

export const leaveRoom = async (req, res) => {
    try {
        const user = await exitUserRoom(req.body);
        user.type = 'removeUser';
        roomws.publish(req.body.roomId, user)
        res.status(200).send(user)
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

export const passwordCode = async (req, res) => {
    try {
        const user = await passwordCodeRepository(req.body);
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
}

export const replacePassword = async (req, res) => {
    try {
        const user = await replacePasswordRepository(req.body);
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
}

export const updateStatus = async (req, res) => {
    try {
        const object = {}
        object.userRoom = await UpdateStatusRepository(req.body);
        object.type = 'updateStatus';
        roomws.publish(req.body.roomId, object)
        res.status(200).send(object);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const passwordValidator = async (req, res) => {
    try {
        const validation = {}
        validation.message = await passwordValidatorRepository(req.body);
        res.status(200).send(validation)
    } catch (e) {
        res.status(400).send(e)
    }
}