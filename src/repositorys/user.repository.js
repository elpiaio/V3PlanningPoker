import { prisma } from "../services/prisma";

export const createUser = async (data) => {
    const user = await prisma.user.create({
        data
    })
    return user
}

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

export const joinUserRoom = async (userId, roomId) => {
    const existingUserRoom = await prisma.userRoom.findFirst({
        where: {
            userId: userId,
            roomId: roomId
        }    
    });

    if (existingUserRoom) throw new Error("User is already in the room");

    await prisma.userRoom.create({
        data: { 
            userId: userId,
            roomId: roomId
        }
    });

    const userRoom = prisma.userRoom.findMany({
        where: {
            roomId: roomId
        }  
    })

    return userRoom;
}

export const exitUserRoom = async (userId, roomId) => {

    const existingUserRoom = await prisma.userRoom.findFirst({
        where: {
            userId: userId,
            roomId: roomId
        }
    });
    console.log(existingUserRoom)

    await prisma.userRoom.deleteMany({
        where: {
            userId: userId,
            roomId: roomId,
        }
    });

    const users = await prisma.userRoom.findMany({
        where: {
            roomId: roomId
        }  
    })

    return users;
}

export const loginUser = async (data) => {
    const user = await prisma.user.findFirstOrThrow({
        where: {
           Password: data.Password,
           Name: data.Name
        } 
    });

    user.UserRoom = await prisma.userRoom.findMany({
        where: {
            userId: user.id
        }
    });
    return user;
}
