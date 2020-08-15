import { MonthlyLevelBonuss } from "./controllers";

const Routes: any = [
  {
    method: "GET",
    path: "/bonus-level",
    handler: (req: any, res: any): object =>
      MonthlyLevelBonuss.getActiveMonthLevelBonusByUser(req, res),
  },
  {
    method: "GET",
    path: "/bonus-level/{id}",
    handler: (req: any, res: any): object =>
      MonthlyLevelBonuss.getActiveMonthLevelBonusByUserByPeriod(req, res),
  },
  {
    method: "POST",
    path: "/bonus-level/by-stockies",
    handler: (req: any, res: any): object =>
      MonthlyLevelBonuss.getMonthlyBonusByStockies(req, res),
  },
];

export default Routes;
