 
import { Transactions } from './controllers';

const Routes: any = [
  {
    method: 'POST',
    path: '/transaction',
    handler: (req: any, res: any): object => Transactions.getTransactionByUser(req, res),
  },
  {
    method: 'POST',
    path: '/transaction/stockies',
    handler: (req: any, res: any): object => Transactions.getTransactionByStockies(req, res),
  },
  {
    method: 'POST',
    path: '/transaction/create',
    config:{
      auth: false,
    },
    handler: (req: any, res: any): object => Transactions.createTransaction(req, res),
  },
];

export default Routes;
