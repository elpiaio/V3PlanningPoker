import { prisma } from "../services/prisma";

export const createRoom = async (data, userId) => {
    const room = await prisma.room.create({
        data: {
            ...data,
            idAdmin: userId,
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
                    user: {
                        select: {
                            id: true,
                            Name: true,
                            Password: false
                        }
                    }
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
            startedAt: new Date(),
            finishAt: null,
            showVotes: false,
            voted: false
        }
    })

    await prisma.vote.deleteMany({
        where: {
            storyId: data.storyActive
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

export const newAdmRepository = async (id, data) => {
    const room = await prisma.room.update({
        where: {
            id
        },
        data: {
            idAdmin: data.idAdmin
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

export const deleteRoomRepository = async (id, data) => {
    try {
        const stories = await prisma.story.findMany({
            where: {
                roomId: id
            }
        });

        for (const story of stories) {
            await prisma.vote.deleteMany({
                where: {
                    storyId: story.id
                }
            });
        }

        await prisma.story.deleteMany({
            where: {
                roomId: id
            }
        });

        await prisma.userRoom.deleteMany({
            where: {
                roomId: id
            }
        });

        const room = await prisma.room.delete({
            where: {
                id
            }
        });

        return room;
    } catch (error) {
        throw new Error(error);
    }
}