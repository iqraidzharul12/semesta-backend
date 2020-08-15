import { getConnection } from "typeorm";
import { Stockies, Village, Province, Regency } from "../../../model/entities";
import { HttpResponse } from "../../../utilities";

class Regencies {
  static getAll = async (req: any, res: any): Promise<object> => {
    try {
      let RegencyRepository = getConnection().getRepository(Regency);

      const regency = await RegencyRepository.find({});
      if (regency) {
        return HttpResponse(200, regency);
      }
      return HttpResponse(401, "Regencies not found.");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
  static getRegencyByProvinceId = async (
    req: any,
    res: any
  ): Promise<object> => {
    try {
      const provinceId = req.params.id;

      let provinceRepository = getConnection().getRepository(Province);
      const province = await provinceRepository.findOne({
        where: { id: provinceId },
      });

      let regencyRepository = getConnection().getRepository(Regency);

      const regencies = await regencyRepository.find({
        where: { province: province },
      });

      if (regencies) {
        return HttpResponse(200, regencies);
      }
      return HttpResponse(401, "Regencies not found.");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
}

export default Regencies;
