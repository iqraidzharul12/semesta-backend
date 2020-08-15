import { StockiesPurchases } from "./controllers";

const Routes: any = [
  {
    method: "POST",
    path: "/stockies-purchase",
    handler: (req: any, res: any): object =>
      StockiesPurchases.getStockiesPurchase(req, res),
  },
  {
    method: "POST",
    path: "/stockies-purchase/create",
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object =>
      StockiesPurchases.createStockiesPurchase(req, res),
  },
];

export default Routes;
