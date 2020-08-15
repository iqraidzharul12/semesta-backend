import { Stocks } from "./controllers";

const Routes: any = [
  {
    method: "POST",
    path: "/stock",
    handler: (req: any, res: any): object =>
      Stocks.getStockByStockies(req, res),
  },
  {
    method: "GET",
    path: "/stock",
    handler: (req: any, res: any): object => Stocks.getAll(req, res),
  },
];

export default Routes;
