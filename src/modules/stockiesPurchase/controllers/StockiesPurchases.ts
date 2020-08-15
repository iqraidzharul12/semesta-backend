import { getConnection } from "typeorm";
import {
  User,
  Transaction,
  MonthlyBonus,
  Period,
  Product,
  Stockies,
  StockiesPurchase,
  Stock,
} from "../../../model/entities";
import { HttpResponse } from "../../../utilities";

class StockiesPurchases {
  static getAll = async (req: any, res: any): Promise<object> => {
    try {
      let stockiesPurchaseRepository = getConnection().getRepository(
        StockiesPurchase
      );

      const stockiesPurchases = await stockiesPurchaseRepository.find({});
      if (stockiesPurchases) {
        return HttpResponse(200, stockiesPurchases);
      }
      return HttpResponse(401, "Transaction not found.");
    } catch (error) {
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
  static getStockiesPurchase = async (req: any, res: any): Promise<object> => {
    try {
      const pageNumber = req.payload.pageNumber;
      const pageSize = req.payload.pageSize;
      const first = pageNumber * pageSize;
      const stockies = req.payload.stockies;

      let condition = {};
      if (stockies !== "all") condition = { stockies: stockies };

      if (stockies) {
        let stockiesPurchaseRepository = getConnection().getRepository(
          StockiesPurchase
        );

        const count = await stockiesPurchaseRepository.count({
          where: condition,
        });

        const content = await stockiesPurchaseRepository.find({
          where: condition,
          skip: first,
          take: pageSize,
          order: {
            date: "DESC",
          },
          relations: ["stockies", "product"],
        });

        if (content) {
          const data = {
            totalElements: count,
            pageSize,
            pageNumber,
            first: first + 1,
            last: first + content.length,
            content,
          };
          return HttpResponse(200, data);
        }
        return HttpResponse(401, "Transaction not found.");
      }
      return HttpResponse(401, "Stockies not found.");
    } catch (error) {
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
  static createStockiesPurchase = async (
    req: any,
    res: any
  ): Promise<object> => {
    try {
      const date = req.payload.date;
      const stockiesID = req.payload.stockies;
      const productID = req.payload.product;
      const count = req.payload.count;

      let productRepository = getConnection().getRepository(Product);
      const product = await productRepository.findOne({
        where: { id: productID },
      });
      let stockiesRepository = getConnection().getRepository(Stockies);
      const stockies = await stockiesRepository.findOne({
        where: { id: stockiesID },
      });
      if (product && stockies) {
        let stockiesPurchaseRepository = getConnection().getRepository(
          StockiesPurchase
        );
        const stockiesPurchase = new StockiesPurchase();
        stockiesPurchase.count = count;
        stockiesPurchase.date = date;
        stockiesPurchase.product = product;
        stockiesPurchase.stockies = stockies;

        await stockiesPurchaseRepository.save(stockiesPurchase);

        let stockRepository = getConnection().getRepository(Stock);
        let stock = await stockRepository.findOne({
          where: { product: product, stockies: stockies },
        });
        if (!stock) {
          stock = new Stock();
          stock.product = product;
          stock.stockies = stockies;
          stock.count = 0;
        }
        stock.count += Number.parseFloat(count);
        stockies.currentStock += Number.parseFloat(count);
        await stockiesRepository.save(stockies);
        await stockRepository.save(stock);
        return HttpResponse(200, "Transaction succsesfully added");
      }
      return HttpResponse(400, "Stockies not found ");
    } catch (error) {
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
}

export default StockiesPurchases;
