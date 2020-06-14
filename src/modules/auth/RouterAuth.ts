 
import { Auths } from './controllers';

const Routes: any = [
  {
    method: 'POST',
    path: '/signin',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Auths.signIn(req, res),
  },
  {
    method: 'POST',
    path: '/signin/stockies',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Auths.stockiesSignIn(req, res),
  },
  {
    method: 'POST',
    path: '/signup',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Auths.signUp(req, res),
  },
  {
    method: 'GET',
    path: '/auth-check',
    handler: (req: any, res: any): object => Auths.authCheck(req, res),
  },
];

export default Routes;
