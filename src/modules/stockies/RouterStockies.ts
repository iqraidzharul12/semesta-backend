import { Stockies } from "./controllers";

const Routes: any = [
  {
    method: "GET",
    path: "/stockies",
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Stockies.getAllStockies(req, res),
  },
  {
    method: "POST",
    path: "/stockies/data",
    handler: (req: any, res: any): object => Stockies.getStockiesData(req, res),
  },
  {
    method: "GET",
    path: "/stockies/village/{id}",
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object =>
      Stockies.getStockiesDataByVillage(req, res),
  },
];

export default Routes;
