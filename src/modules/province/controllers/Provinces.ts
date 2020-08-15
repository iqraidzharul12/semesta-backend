import { getConnection } from "typeorm";
import { Stockies, Village, Province } from "../../../model/entities";
import { HttpResponse } from "../../../utilities";

class Provinces {
  static getAll = async (req: any, res: any): Promise<object> => {
    try {
      let ProvinceRepository = getConnection().getRepository(Province);

      const province = await ProvinceRepository.find({});
      if (province) {
        return HttpResponse(200, province);
      }
      return HttpResponse(401, "Provinces not found.");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
}

export default Provinces;
