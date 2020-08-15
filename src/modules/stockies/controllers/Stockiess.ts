import { getConnection } from "typeorm";
import { Stockies, Village } from "../../../model/entities";
import { HttpResponse } from "../../../utilities";

class Stockiess {
  static getAllStockies = async (req: any, res: any): Promise<object> => {
    try {
      let StockiesRepository = getConnection().getRepository(Stockies);

      const person = await StockiesRepository.find({
        where: { isActive: true },
        order: { username: "ASC" },
      });
      if (person) {
        person.forEach((element) => {
          delete element.password;
        });
        return HttpResponse(200, person);
      }
      return HttpResponse(401, "Stockies not found.");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
  static getStockiesData = async (req: any, res: any): Promise<object> => {
    try {
      const stockies = req.payload.stockies;

      let StockiesRepository = getConnection().getRepository(Stockies);

      const person = await StockiesRepository.findOne({
        where: { id: stockies.id },
      });
      if (person) {
        delete person.password;
        return HttpResponse(200, person);
      }
      return HttpResponse(401, "Stockies not found.");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
  static getStockiesDataByVillage = async (
    req: any,
    res: any
  ): Promise<object> => {
    try {
      const villageId = req.params.id;

      let VillageRepository = getConnection().getRepository(Village);
      const village = await VillageRepository.findOne({
        where: { id: villageId },
      });
      let StockiesRepository = getConnection().getRepository(Stockies);

      const stockies = await StockiesRepository.find({
        where: { village: village, isActive: true },
      });

      if (stockies) {
        stockies.forEach((item) => {
          delete item.password;
        });
        return HttpResponse(200, stockies);
      }
      return HttpResponse(401, "Stockies not found.");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
}

export default Stockiess;
