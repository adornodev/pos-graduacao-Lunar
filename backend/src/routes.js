import { Router } from 'express';
import 'express-async-errors';

import EventController from './app/controllers/EventController';

const routes = Router();

routes.get('/events', EventController.index);
routes.post('/events', EventController.store);

export default routes;
