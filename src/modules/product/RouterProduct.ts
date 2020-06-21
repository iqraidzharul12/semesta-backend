 
import { Products } from './controllers';

const Routes: any = [
  {
    method: 'GET',
    path: '/product',
    config: {
      auth: false
    },
    handler: (req: any, res: any): object => Products.getAllProduct(req, res),
  }
];

export default Routes;
