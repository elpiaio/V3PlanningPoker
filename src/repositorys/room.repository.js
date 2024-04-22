import { prisma } from "../services/prisma";

export const createRoom = async (data, userId) => {
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

export const getRoomByIdGuidSimple = async (id) => {
    const room = await prisma.room.findFirst({
        where: {
            ServerId: id
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


export const activeStoryRepository = async (id, data) => {
    const story = await prisma.story.update({
        where: {
            id: data.storyActive
        },
        data: {
            startedAt: new Date()
        }
    })

    const room = await prisma.room.update({
        where: {
            id
        },
        data: {
            storyActive: data.storyActive
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


export const visualizationModeRep = async (id, data) => {
    const room = await prisma.room.update({
        where: {
            id
        },
        data: {
            storyActive: data.storyActive
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