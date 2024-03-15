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

export const getRoom = async (data) => {
    //console.log(data)
    const room = await prisma.room.findMany({
        data
    })
    return room
}

export const getRoomById = async (id) => {
    const room = await prisma.room.findUnique({
        where: {
            id
        },
        include: {
            UserRoom: true
        }
    });
    if (!room) throw new Error(`Room with ID ${id} not found`);

    room.stories = await prisma.story.findMany({
        where: {
            roomId: id
        }
    });
    room.UserRoom = await prisma.UserRoom.findMany({
        where: {
            roomId: id
        }
    });

    for (let story of room.stories) {
        story.votes = await prisma.vote.findMany({
            where: {
                storyId: story.id
            }
        });
    }
    return room;
}