import { getConnection } from "typeorm";
import { HttpResponse } from "../../../utilities";
import { Product } from "../../../model/entities";

class Products {
  static getAllProduct = async (req: any, res: any): Promise<object> => {
    try {
      let productRepository = getConnection().getRepository(Product);

      const data = await productRepository.find({isActive:true});
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

export default Products;