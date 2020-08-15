import { Villages } from "./controllers";

const Routes: any = [
  {
    method: "GET",
    path: "/village",
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Villages.getAll(req, res),
  },
  {
    method: "GET",
    path: "/village/{id}",
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object =>
      Villages.getVillageByDistrictId(req, res),
  },
];

export default Routes;
