 
import { MonthlyBonuss } from './controllers';

const Routes: any = [
  {
    method: 'GET',
    path: '/bonus',
    handler: (req: any, res: any): object => MonthlyBonuss.getMonthlyBonusByUser(req, res),
  },
];

export default Routes;
