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
    try {
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

        if (room && room.story.length > 0) {
            const activeStory = room.story.find(s => s.id === room.storyActive);

            if (activeStory && activeStory.showVotes) {
                room.story.forEach(story => {
                    story.votes = story.votes.map(vote => {
                        return {
                            id: vote.id,
                            userId: vote.userId,
                            storyId: vote.storyId,
                            vote: activeStory.showVotes ? vote.vote : null
                        };
                    });
                });
            } else {
                room.story.forEach(story => {
                    story.votes = story.votes.map(vote => {
                        return {
                            id: vote.id,
                            userId: vote.userId,
                            storyId: vote.storyId,
                            vote: null
                        };
                    });
                });
            }
        }

        return room;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

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

export const apdateAdmOfNullRepository = async (data) => {
    try {
        const rooms = await prisma.room.findMany({
            where: {
                idAdmin: null
            },
            include: {
                UserRoom: true
            }
        });

        const updatedRooms = await Promise.all(
            rooms.map(async (room) => {
                if (room.UserRoom.length > 0) {
                    const updatedRoom = await prisma.room.update({
                        where: {
                            id: room.id
                        },
                        data: {
                            idAdmin: room.UserRoom[0].userId
                        }
                    });

                    return updatedRoom;
                } else {
                    return room;
                }
            })
        );

        return updatedRooms;
    } catch (error) {
        throw new Error(error);
    }
}
