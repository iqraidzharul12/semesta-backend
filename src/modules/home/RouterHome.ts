 
import { Dashboard  } from './controllers';

const Routes: any = [
  {
    method: 'GET',
    path: '/',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Dashboard.welcome(req, res),
  },
];

export default Routes;
