import { prisma } from "../services/prisma";

export const createStory = async (data) => {
    await prisma.story.create({
        data
    })
    
    const stories = await prisma.story.findMany()
    return stories;
}

export const deleteStory = async (id) => {
    await prisma.story.delete({
        where: {
            id,
        }
    })

    const story = await prisma.story.findMany()
    return story;
}

export const get = async (id) => {
    const stories = await prisma.story.findMany({
        where: {
            roomId:id
        }
    });
    return stories;
}