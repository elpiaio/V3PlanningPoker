import { json } from "stream/consumers";
import { watch } from "../../controllers/story.controller";
import { Console } from "console";
import { voting, roomws } from "../../../pubsub/pub-sub";
import { UpdateStatusRepository } from "../../repositorys/user.repository";

const clients = new Set();
const connections = [];

export const wsRoutes = async (app) => {
    //ouvinte de voto
    app.get('/channel/voto/:storyId', { websocket: true }, (connection, req) => {
        const { storyId } = req.params;
        connection.socket.send(JSON.stringify({ storyId: req.params.storyId }));

        voting.subscribe(storyId, (message) => {
            connection.socket.send(JSON.stringify(message))
        });
    });

    //ouvinte da room
    app.get('/channel/room/:roomId/:userId', { websocket: true }, (connection, req) => {
        const { roomId, userId } = req.params;
        clients.add({ userId });
        connection.socket.send(JSON.stringify({ roomId: req.params.roomId }));

        roomws.subscribe(roomId, (message) => {
            connection.socket.send(JSON.stringify(message))
        })

        connection.socket.on('close', async () => {
            clients.delete({ userId });

            const object = {}
            const body = {
                userId: Number(userId),
                roomId: Number(roomId),
                status: false
            }
            
            object.userRoom = await UpdateStatusRepository(body);
            object.type = 'updateStatus';
            roomws.publish(roomId, object)
        });
    })
};