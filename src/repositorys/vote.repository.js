import { prisma } from "../services/prisma";

export const createVote = async (data) => {
    const existingVote = await prisma.vote.findFirst({
        where: {
            userId: data.userId,
            storyId: data.storyId,
        }
    });

    const story = await prisma.story.findFirst({
        where: {
            id: data.storyId
        }
    })

    const nullVote = {
        vote: null,
        userVoted: true,
        userId: data.userId
    }

    if (existingVote) {
        await prisma.vote.updateMany({
            where: {
                userId: data.userId,
                storyId: data.storyId,
            },
            data: {
                vote: data.vote
            },
        });

        if (story.showVotes) { return data }

        return nullVote

    } else {
        const vote = await prisma.vote.create({
            data: {
                userId: data.userId,
                vote: data.vote,
                storyId: data.storyId
            }
        })

        if (story.showVotes) { return vote; }

        return nullVote
    }
}

export const updateVote = async (id, data) => {
    const vote = await prisma.vote.update({
        where: {
            id,
        },
        data
    });

    return vote;
}

export const votingTrue = async (data) => {
    const stories = await prisma.story.findMany({
        where: {
            roomId: data.roomId,
            voting: true
        }
    });

    for (let i = 0; i < stories.length; i++) {
        const story = stories[i];
        await prisma.story.update({
            where: {
                id: story.id
            },
            data: {
                voting: false
            }
        });
    }

    const updatedStory = await prisma.story.update({
        where: {
            roomId: data.roomId,
            story: data.story
        },
        data: {
            voting: true
        }
    });

    return updatedStory;
}

export const getNewVoteRepository = async (data) => {
    const existingVote = await prisma.vote.findFirst({
        where: {
            userId: data.userId,
            storyId: data.storyId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    Name: true,
                    Email: false,
                    Password: false
                }
            }
        }
    });

    return existingVote;
}

export const getVotesRepository = async (data) => {
    const votes = await prisma.story.findFirst({
        where: {
            id: data.id,
        },
        include: {
            votes: {
                include: {
                    user: {
                        select: {
                            id: true,
                            Name: true,
                            Email: false,
                            Password: false
                        }
                    }
                }
            }
        }
    });

    return votes;
}