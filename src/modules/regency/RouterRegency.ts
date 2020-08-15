import { Regencies } from "./controllers";

const Routes: any = [
  {
    method: "GET",
    path: "/regency",
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Regencies.getAll(req, res),
  },
  {
    method: "GET",
    path: "/regency/{id}",
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object =>
      Regencies.getRegencyByProvinceId(req, res),
  },
];

export default Routes;
