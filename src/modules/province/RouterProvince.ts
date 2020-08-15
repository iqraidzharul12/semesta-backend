import { Provinces } from "./controllers";

const Routes: any = [
  {
    method: "GET",
    path: "/province",
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Provinces.getAll(req, res),
  },
];

export default Routes;
