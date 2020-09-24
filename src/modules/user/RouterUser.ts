import { Users } from "./controllers";

const Routes: any = [
  {
    method: "GET",
    path: "/user",
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Users.getAllUser(req, res),
  },
  {
    method: "POST",
    path: "/user/current",
    handler: (req: any, res: any): object => Users.getUserByUsername(req, res),
  },
  {
    method: "POST",
    path: "/user/downline",
    handler: (req: any, res: any): object => Users.getDirectDownline(req, res),
  },
  {
    method: "POST",
    path: "/user/downline/all",
    handler: (req: any, res: any): object => Users.getAllDownLines(req, res),
  },
  {
    method: "POST",
    path: "/user/generate",
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Users.generateUser(req, res),
  },
  {
    method: "POST",
    path: "/user/activate",
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Users.activateUser(req, res),
  },
  {
    method: "POST",
    path: "/user/by-stockies",
    handler: (req: any, res: any): object =>
      Users.getAllUserByStockies(req, res),
  },
  {
    method: "GET",
    config: {
      auth: false,
    },
    path: "/user/rename/{username}/{fullName}",
    handler: (req: any, res: any): object => Users.editUserByUsername(req, res),
  },
];

export default Routes;
