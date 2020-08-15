import { getConnection } from "typeorm";
import {
  Stockies,
  Village,
  Province,
  Regency,
  District,
} from "../../../model/entities";
import { HttpResponse } from "../../../utilities";

class Districts {
  static getAll = async (req: any, res: any): Promise<object> => {
    try {
      const districtRepository = getConnection().getRepository(District);

      const district = await districtRepository.find({});
      if (district) {
        return HttpResponse(200, district);
      }
      return HttpResponse(401, "Districts not found.");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
  static getDistrictByRegencyId = async (
    req: any,
    res: any
  ): Promise<object> => {
    try {
      const regencyId = req.params.id;

      const regencyRepository = getConnection().getRepository(Regency);
      const regency = await regencyRepository.findOne({
        where: { id: regencyId },
      });

      const districtRepository = getConnection().getRepository(District);

      const districts = await districtRepository.find({
        where: { regency: regency },
      });

      if (districts) {
        return HttpResponse(200, districts);
      }
      return HttpResponse(401, "Districts not found.");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
}

export default Districts;
