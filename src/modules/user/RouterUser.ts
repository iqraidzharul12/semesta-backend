 
import { Users } from './controllers';

const Routes: any = [
  {
    method: 'GET',
    path: '/user',
    config: {
      auth: false
    },
    handler: (req: any, res: any): object => Users.getAllUser(req, res),
  },
  {
    method: 'POST',
    path: '/user/current',
    handler: (req: any, res: any): object => Users.getUserByUsername(req, res),
  },
  {
    method: 'POST',
    path: '/user/downline',
    handler: (req: any, res: any): object => Users.getDirectDownline(req, res),
  },
  {
    method: 'POST',
    path: '/user/generate',
    config: {
      auth: false
    },
    handler: (req: any, res: any): object => Users.generateUser(req, res),
  },
  {
    method: 'POST',
    path: '/user/activate',
    config: {
      auth: false
    },
    handler: (req: any, res: any): object => Users.activateUser(req, res),
  },
];

export default Routes;
