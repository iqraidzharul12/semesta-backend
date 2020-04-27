 
import { Transactions } from './controllers';

const Routes: any = [
  {
    method: 'POST',
    path: '/transaction',
    handler: (req: any, res: any): object => Transactions.getTransactionByUser(req, res),
  },
];

export default Routes;
