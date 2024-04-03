import { prisma } from "../services/prisma";

export const createStory = async (data) => {
    const stories = await prisma.story.create({
        data
    })
    
    return stories;
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
        await prisma.story.delete({
            where: {
                id: id,
            },
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    } finally {
        await prisma.$disconnect();
    }
}

export const get = async (id) => {
    const stories = await prisma.story.findMany({
        where: {
            roomId:id
        }
    });
    return stories;
}