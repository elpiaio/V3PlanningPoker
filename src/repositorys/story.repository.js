import { ok } from "assert";
import { prisma } from "../services/prisma";

export const createStory = async (data) => {
    const story = await prisma.story.create({
        data
    })

    return story;
}

export const deleteStory = async (id) => {
    try {
        // Encontre o story pelo ID
        const story = await prisma.story.findUnique({
            where: {
                id: id,
            },
            include: {
                votes: true, // Inclua os votos associados ao story
            },
        });

        if (!story) {
            throw new Error('Story not found');
        }

        // Exclua todos os votos associados ao story
        await prisma.vote.deleteMany({
            where: {
                storyId: id,
            },
        });

        // Finalmente, exclua o story
        const result = await prisma.story.delete({
            where: {
                id: id,
            },
        });

        return result;
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}

export const get = async (id) => {
    const stories = await prisma.story.findMany({
        where: {
            roomId: id
        }
    });
    return stories;
}


//configuração de adm

export const VotedRep = async (id, data) => {
    const story = await prisma.story.update({
        where: {
            id: id
        },
        data: { ...data, finishAt: new Date() }
    });
    return story;
}

export const VotingRep = async (id, data) => {
    const updatedStory = await prisma.story.update({
        where: {
            id: data.storyId
        },
        data: {
            voting: true,
            finishAt: null,
            voted: false
        }
    });

    const stories = await prisma.story.updateMany({
        where: {
            roomId: id,
            id: {
                not: data.storyId
            }
        },
        data: {
            voting: false
        }
    });

    return stories;
}

export const showVotesRep = async (id, data) => {
    if (!data.storyId) {
        throw new Error('Invalid storyId');
    }

    const story = await prisma.story.findUnique({
        where: {
            id: data.storyId
        }
    });

    if (!story) {
        throw new Error(`Story with id ${data.storyId} not found.`);
    }

    const newShowVotesValue = !story.showVotes;

    const updatedStory = await prisma.story.update({
        where: {
            id: data.storyId
        },
        data: {
            showVotes: newShowVotesValue
        }
    });

    return updatedStory;
}


export const finishVotationRep = async (id, data) => {
    const story = await prisma.story.update({
        where: {
            id: data.storyId
        },
        data: {
            showResults: true,
            voted: true,
            showVotes: true,
            finishAt: new Date()
        }
    })
    return story;
}

export const RefreshRep = async (id,data) => {
    try {
        const result = await prisma.vote.deleteMany({
            where: {
                storyId: data.storyId
            }
        })
        return result;

    } catch (e) {
        return e;
    }
}