import { getConnection } from "typeorm";
import { ProductExcellence } from "../../../model/entities";
import { HttpResponse } from "../../../utilities";

class ProductExcellences {
  static getAllProductExcellence = async (req: any, res: any): Promise<object> => {
    try {
      let productExcellencesRepository = getConnection().getRepository(ProductExcellence);

      const data = await productExcellencesRepository.find({isActive: true});
      if (data) {
        return HttpResponse(200, data);
      }
      return HttpResponse(401, 'Data not found.');
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }
}

export default ProductExcellences;