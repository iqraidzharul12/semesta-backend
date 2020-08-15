import { Districts } from "./controllers";

const Routes: any = [
  {
    method: "GET",
    path: "/district",
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Districts.getAll(req, res),
  },
  {
    method: "GET",
    path: "/district/{id}",
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object =>
      Districts.getDistrictByRegencyId(req, res),
  },
];

export default Routes;
