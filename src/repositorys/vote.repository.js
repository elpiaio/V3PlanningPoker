import { prisma } from "../services/prisma";

export const createVote = async (data) => {
    const existingVote = await prisma.vote.findFirst({
        where: {
            userId: data.userId,
            storyId: data.storyId,
        }
    });
    console.log(existingVote)

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
        return data;
    } else {
        const vote = await prisma.vote.create({
            data
        })
        return vote
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

    console.log(stories);

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

