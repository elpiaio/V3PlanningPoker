import { prisma } from "../services/prisma";

export const createUser = async (data) => {
    // Verifica se já existe um usuário com o mesmo nome
    const existingUser = await prisma.user.findFirst({
        where: {
            Name: data.Name
        }
    });

    if (existingUser) {
        throw new Error('Usuário já existe');
    }

    // Cria o usuário caso ele não exista
    const user = await prisma.user.create({
        data
    });
    user.UserRoom = await prisma.userRoom.findMany({
        where: {
            userId: user.id
        }
    });
    return user;
};

export const getUsersRoom = async (roomId) => {
    const users = await prisma.user.findMany({
        where: {
            UserRoom: {
                some: {
                    roomId: roomId
                }
            }
        }
    });
    return users;
}

export const getById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id,  //id:id
        }
    });

    user.UserRoom = await prisma.userRoom.findMany({
        where: {
            userId: user.id
        }
    });

    return user;
}

export const updateUser = async (id, data) => {
    const user = await prisma.user.update({
        where: {
            id,
        },
        data
    });

    return user;
}

export const deleteUser = async (id) => {
    const user = await prisma.user.delete({
        where: {
            id,
        }
    })
    return user;
}

export const joinUserRoom = async (data) => {
    const existingUserRoom = await prisma.userRoom.findFirst({
        where: {
            userId: data.userId,
            roomId: data.roomId
        }
    });

    if (existingUserRoom) throw new Error("User is already in the room");

    await prisma.userRoom.create({
        data: {
            userId: data.userId,
            roomId: data.roomId
        }
    });

    const userRoom = prisma.userRoom.findMany({
        where: {
            roomId: data.roomId
        }
    })

    return userRoom;
}

export const exitUserRoom = async (userId, roomId) => {
    try {
        await prisma.userRoom.deleteMany({
            where: {
                userId: userId,
                roomId: roomId,
            }
        });
        return userId;

    } catch (e) {
        console.log(e)
    }
}

export const loginUser = async (data) => {
    const user = await prisma.user.findFirstOrThrow({
        where: {
            Password: data.Password,
            Name: data.Name
        }
    });
    return user;
}
