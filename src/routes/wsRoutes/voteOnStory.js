import { json } from "stream/consumers";
import { watch } from "../../controllers/story.controller";
import { Console } from "console";
import { voting } from "../../../pubsub/voting-pub-sub";

const connections = [];

export const wsRoutes = async (app) => {
    //ouvinte de voto
    app.get('/channel/voto/:storyId', { websocket: true }, (connection, req) => {
        const {storyId} = req.params;
        connection.socket.send(JSON.stringify({ storyId: req.params.storyId }));

        voting.subscribe(storyId, (message) => {
            connection.socket.send(JSON.stringify(message))
        });
    });

    //ouvinte da room
    app.get('/channel/room/:roomId', { websocket: true }, (connection, req) => {
        const { roomId } = req.params;
        connection.socket.send(JSON.stringify({ roomId: req.params.roomId }));
    
        // Função para enviar mensagem para todos os clientes conectados
        const sendToAllClients = (message) => {
            connection.socket.send(JSON.stringify(message));
        };
    
        // Subscrever para receber mensagens de votação
        voting.subscribe(roomId, sendToAllClients);
    
        // Receber mensagens do cliente
        connection.socket.on('message', async (message) => {
            try {
                const data = JSON.parse(message);
                if (data.type === 'story_deleted') {
                    // Enviar a mensagem para todos os clientes conectados
                    sendToAllClients(data);
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        });
    });

    //ouvinte de usuario
    app.get('/channel/user/:roomId', {websocket: true}, (connection, req) => {
        const {roomId} = req.params;
        connection.socket.send(JSON.stringify({roomId: req.params.roomId}));

        voting.subscribe(roomId, (message) => {
            connection.socket.send(JSON.stringify(message))
        })
    })
};
