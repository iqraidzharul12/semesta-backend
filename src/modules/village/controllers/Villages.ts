import { getConnection } from "typeorm";
import {
  Stockies,
  Village,
  Province,
  Regency,
  District,
} from "../../../model/entities";
import { HttpResponse } from "../../../utilities";

class Villages {
  static getAll = async (req: any, res: any): Promise<object> => {
    try {
      const villageRepository = getConnection().getRepository(Village);

      const village = await villageRepository.find({});
      if (village) {
        return HttpResponse(200, village);
      }
      return HttpResponse(401, "Villages not found.");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
  static getVillageByDistrictId = async (
    req: any,
    res: any
  ): Promise<object> => {
    try {
      const districtId = req.params.id;

      const districtRepository = getConnection().getRepository(District);
      const district = await districtRepository.findOne({
        where: { id: districtId },
      });

      const villageRepository = getConnection().getRepository(Village);

      const villages = await villageRepository.find({
        where: { district: district },
      });

      if (villages) {
        return HttpResponse(200, villages);
      }
      return HttpResponse(401, "Villages not found.");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
}

export default Villages;
