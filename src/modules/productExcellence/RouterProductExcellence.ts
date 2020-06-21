 
import { ProductExcellences } from './controllers';

const Routes: any = [
  {
    method: 'GET',
    path: '/product-excellence',
    config: {
      auth: false
    },
    handler: (req: any, res: any): object => ProductExcellences.getAllProductExcellence(req, res),
  }
];

export default Routes;
