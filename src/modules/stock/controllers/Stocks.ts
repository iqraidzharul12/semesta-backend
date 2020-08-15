import { getConnection } from "typeorm";
import { Stock } from "../../../model/entities";
import { HttpResponse } from "../../../utilities";

class Stocks {
  static getAll = async (req: any, res: any): Promise<object> => {
    try {
      const stockies = req.payload.stockies;

      let stockRepository = getConnection().getRepository(Stock);

      const stocks = await stockRepository.find({});
      if (stocks) {
        return HttpResponse(200, stocks);
      }
      return HttpResponse(401, "User not found.");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
  static getStockByStockies = async (req: any, res: any): Promise<object> => {
    try {
      const stockies = req.payload.stockies;

      let stockRepository = getConnection().getRepository(Stock);

      const stocks = await stockRepository.find({
        where: { stockies: stockies },
        relations: ["product"],
      });
      if (stocks) {
        return HttpResponse(200, stocks);
      }
      return HttpResponse(401, "Transaction not found.");
    } catch (error) {
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
}

export default Stocks;
