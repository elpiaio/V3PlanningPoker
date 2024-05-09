import { prisma } from "../services/prisma";
import { enviarEmail } from "../services/sendEmail";

export const createUser = async (data) => {
    try {
        // Cria o usuário caso ele não exista
        const user = await prisma.user.create({
            data,
            select: {
                id: true,
                Name: true,
                Email: true,
                Password: false
            }
        });

        return user;
    } catch (error) {
        console.log(error)
        return error
    }

};

export const emailValidatorRepository = async (data) => {
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                Email: data.Email,
            }
        });
        if (existingUser) { throw new Error('Usuário já existe'); }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.Email)) {
            throw new Error('E-mail inválido');
        }

        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        console.log(randomNumber);

        await enviarEmail(data.Email, 'Tunad | PlanningPoker', `código de verificação ${randomNumber}`);

        return randomNumber;
    } catch (error) {
        console.log(error)
        return error
    }
}

export const getUsersRoom = async (roomId) => {
    const users = await prisma.user.findMany({
        where: {
            UserRoom: {
                some: {
                    roomId: roomId
                }
            }
        }
    });
    return users;
}

export const getById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id,  //id:id
        }
    });

    user.UserRoom = await prisma.userRoom.findMany({
        where: {
            userId: user.id
        }
    });

    return user;
}

export const updateUser = async (id, data) => {
    const user = await prisma.user.update({
        where: {
            id,
        },
        data
    });

    return user;
}

export const deleteUser = async (id) => {
    const user = await prisma.user.delete({
        where: {
            id,
        }
    })
    return user;
}

export const insertUserRoom = async (data) => {
    const existingUserRoom = await prisma.userRoom.findFirst({
        where: {
            userId: data.userId,
            roomId: data.roomId
        }
    });

    if (existingUserRoom) throw new Error("User is already in the room");

    const userRoom = await prisma.userRoom.create({
        data: {
            userId: data.userId,
            roomId: data.roomId
        },
        include: {
            user: true
        }
    });
    return userRoom;
}

export const exitUserRoom = async (data) => {
    try {
        const userRoom = await prisma.userRoom.deleteMany({
            where: {
                userId: data.userId,
                roomId: data.roomId
            }
        });

        if (userRoom) {
            const user = await prisma.user.findUnique({
                where: {
                    id: data.userId
                },
                select: {
                    id: true,
                    Email: false,
                    Name: true,
                    Password: false
                }
            });
            return user;
        }
    } catch (e) {
        console.log(e);
    }
}

export const loginUser = async (data) => {
    const user = await prisma.user.findFirstOrThrow({
        where: {
            Password: data.Password,
            Email: data.Email
        },
        select: {
            id: true,
            Name: true,
            Email: true,
            Password: false,
        }
    });
    return user;
}
