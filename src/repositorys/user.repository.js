import { prisma } from "../services/prisma";
import { sendEmail } from "../services/nodemailer";

export const createUser = async (data) => {
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                Email: data.Email
            }
        });

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

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
        console.log(error);
        return error;
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

        await sendEmail(data.Email, 'Tunad | PlanningPoker', `código de verificação ${randomNumber}`);

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

export const getByEmailRepository = async (email) => {
    try {
        console.log(email)
        const user = await prisma.user.findFirstOrThrow({
            where: {
                Email: email
            },
            select: {
                id: true,
                Email: true,
                Name: true,
                Password: false
            }
        });

        return user;
    } catch (error) {
        throw error
    }

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
    const userRooms = await prisma.userRoom.findMany({
        where: {
            userId: id,
        }
    });

    for (const userRoom of userRooms) {
        await prisma.userRoom.delete({
            where: {
                roomId_userId: {
                    roomId: userRoom.roomId,
                    userId: id
                }
            }
        });
    }

    await prisma.vote.deleteMany({
        where: {
            userId: id,
        }
    });

    const user = await prisma.user.delete({
        where: {
            id: id,
        }
    });

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
    return userRoom;
}

export const exitUserRoom = async (data) => {
    try {
        var wasAdmin = false
        var newRoomUpdated;

        const roomAndUsers = await prisma.room.findFirst({
            where: {
                id: data.roomId
            },
            include: {
                UserRoom: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!roomAndUsers) {
            throw new Error('Room not found');
        }

        if (roomAndUsers.idAdmin == data.userId) {
            const newAdmin = roomAndUsers.UserRoom.find(ur => ur.userId !== data.userId);
            const newAdminId = newAdmin ? newAdmin.userId : null;

            if (newAdminId) {
                newRoomUpdated = await updateAdm(newAdminId, data.roomId);
                console.log()
                wasAdmin = true;
            } else {
                throw new Error('No suitable new admin found');
            }
        }

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

            if (wasAdmin === true) {
                user.wasAdmin = true;
                user.newAdminId = newRoomUpdated.idAdmin;
            }

            return user;
        }
    } catch (e) {
        console.log(e);
    }
}

async function updateAdm(newAdminId, roomId) {
    const room = await prisma.room.update({
        where: {
            id: roomId
        },
        data: {
            idAdmin: newAdminId
        },
        include: {
            UserRoom: {
                include: {
                    user: true
                }
            }
        }
    });

    return room;
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

export const passwordCodeRepository = async (data) => {
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                Email: data.Email,
            }
        });
        if (!existingUser) { throw new Error('Usuário não existe'); }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.Email)) {
            throw new Error('E-mail inválido');
        }

        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        console.log(randomNumber);

        await sendEmail(data.Email, 'Tunad | PlanningPoker', `código de recuperação ${randomNumber}`);

        return randomNumber;
    } catch (error) {
        console.log(error)
        return error
    }
}

export const replacePasswordRepository = async (data) => {
    try {
        const user = await prisma.user.updateMany({
            where: {
                Email: data.Email
            },
            data: {
                Password: data.newPassword
            }
        });

        return user;
    } catch (error) {
        console.log(error)
        return error
    }
}