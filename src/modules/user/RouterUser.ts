 
import { Users } from './controllers';

const Routes: any = [
  {
    method: 'GET',
    path: '/user',
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
    method: 'GET',
    path: '/test-auth',
    handler: (req: any, res: any): object => Users.testAuth(req, res),
  },
];

export default Routes;
