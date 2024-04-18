import { json } from "stream/consumers";
import { watch } from "../../controllers/story.controller";
import { Console } from "console";
import { voting , roomws } from "../../../pubsub/pub-sub";

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
    app.get('/channel/room/:roomId', {websocket: true}, (connection, req) => {
        const {roomId} = req.params;
        connection.socket.send(JSON.stringify({roomId: req.params.roomId}));

        roomws.subscribe(roomId, (message) => {
            connection.socket.send(JSON.stringify(message))
        })
    })
};
