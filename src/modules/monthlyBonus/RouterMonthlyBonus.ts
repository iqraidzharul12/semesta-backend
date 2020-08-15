import { MonthlyBonuss } from "./controllers";

const Routes: any = [
  {
    method: "GET",
    path: "/bonus",
    handler: (req: any, res: any): object =>
      MonthlyBonuss.getMonthlyBonusByUser(req, res),
  },
  {
    method: "POST",
    path: "/bonus/by-stockies",
    handler: (req: any, res: any): object =>
      MonthlyBonuss.getMonthlyBonusByStockies(req, res),
  },
];

export default Routes;
