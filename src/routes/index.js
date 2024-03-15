import {roomRoutes} from './room.routes';
import {userRoutes} from './user.routes';
import {storyRoutes} from './story.routes';
import {voteRoutes} from './vote.routes';

//esse codigo nao esta sendo utilizado
const routes = app => {
    roomRoutes(app);
    userRoutes(app);
    storyRoutes(app);
    voteRoutes(app);
};

export default routes;

