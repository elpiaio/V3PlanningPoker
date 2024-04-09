import { prisma } from "../services/prisma";

export const createRoom = async (data, userId) => {
    //console.log(data)
    const room = await prisma.room.create({
        data: {
            ...data,
            UserRoom: {
                create: {
                    userId
                }
            }
        },
        include: {
            UserRoom: true
        }
    })
    return room
}

export const getRooms = async (data) => {
    const rooms = await prisma.room.findMany({
        data,
    })
    return rooms
}

export const getRoomById = async (id) => {
    const room = await prisma.room.findUnique({
        where: {
           id
        },
        include: {
            UserRoom: {
                include: {
                    user: true
                }
            },
            story: {
                include: {
                    votes: true
                }
            }
        }
    });
    return room;
}

export const getRoomByIdSimple = async (id) => {
    const room = await prisma.room.findUnique({
        where: {
            id
        }
    });

    return room
}

export const getRoomByUserId = async (id) => {
    const room = await prisma.userRoom.findMany({
        where: {
            userId: id
        },
        include: {
            room: true
        }
    });

    return room;
}