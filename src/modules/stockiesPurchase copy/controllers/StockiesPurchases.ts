import { getConnection } from "typeorm";
import {
  User,
  Transaction,
  MonthlyBonus,
  Period,
  Product,
  Stockies,
  StockiesPurchase,
  InternalMonthlyBonus,
} from "../../../model/entities";
import { HttpResponse } from "../../../utilities";

class Transactions {
  static getAll = async (req: any, res: any): Promise<object> => {
    try {
      let transactionRepository = getConnection().getRepository(Transaction);

      const transactions = await transactionRepository.find({});
      if (transactions) {
        return HttpResponse(200, transactions);
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

      if (stockies) {
        let stockiesPurchaseRepository = getConnection().getRepository(
          StockiesPurchase
        );
        const count = await stockiesPurchaseRepository.count({
          where: { stockies: stockies },
        });
        const content = await stockiesPurchaseRepository.find({
          where: { stockies: stockies },
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
  static createTransaction = async (req: any, res: any): Promise<object> => {
    try {
      const username = req.payload.username;
      const date = req.payload.date;
      const stockiesID = req.payload.stockies;
      const productID = req.payload.product;
      const count = req.payload.count;

      let userRepository = getConnection().getRepository(User);
      let user = await userRepository.findOne({
        where: { username: username },
        relations: ["upLine"],
      });
      let companyAccount = await userRepository.findOne({
        where: { username: "BRS001" },
        relations: ["upLine"],
      });
      let periodRepository = getConnection().getRepository(Period);
      const period = await periodRepository.findOne({
        where: { status: "OPEN" },
      });
      let productRepository = getConnection().getRepository(Product);
      const product = await productRepository.findOne({
        where: { id: productID },
      });
      let stockiesRepository = getConnection().getRepository(Stockies);
      const stockies = await stockiesRepository.findOne({
        where: { id: stockiesID },
      });
      if (user && period && product && stockies && companyAccount) {
        let transactionRepository = getConnection().getRepository(Transaction);
        const transaction = new Transaction();
        transaction.count = count;
        transaction.date = date;
        transaction.user = user;
        transaction.product = product;
        transaction.stockies = stockies;

        await transactionRepository.save(transaction);
        // const queryRunner = getConnection().createQueryRunner();
        // await queryRunner.startTransaction();
        try {
          // await queryRunner.query(`INSERT INTO public.transaction(
          //   date, "userId", "stockiesId", "productId", count)
          //   VALUES ('`+ date +`', '`+ user.id +`', '`+ stockies +`', '`+ product +`', '`+ count +`');`);

          let level = 0;
          let nextUserLevel = user;

          while (level < 11) {
            let currentUser = await userRepository.findOne({
              where: { username: nextUserLevel.username },
              relations: ["upLine"],
            });
            if (currentUser) {
              let monthlyBonusRepository = getConnection().getRepository(
                MonthlyBonus
              );
              let monthlyBonus = await monthlyBonusRepository.findOne({
                where: { user: currentUser, period: period },
              });
              if (!monthlyBonus) {
                monthlyBonus = new MonthlyBonus();
                monthlyBonus.user = currentUser;
                monthlyBonus.period = period;
                monthlyBonus.isActive = true;
                monthlyBonus.level0 = 0;
                monthlyBonus.level1 = 0;
                monthlyBonus.level2 = 0;
                monthlyBonus.level3 = 0;
                monthlyBonus.level4 = 0;
                monthlyBonus.level5 = 0;
                monthlyBonus.level6 = 0;
                monthlyBonus.level7 = 0;
                monthlyBonus.level8 = 0;
                monthlyBonus.level9 = 0;
                monthlyBonus.level0 = 0;
                monthlyBonus.totalBonus = 0;
              }
              switch (level) {
                case 0:
                  monthlyBonus.level0 += product.weight * count * 100;
                  monthlyBonus.totalBonus += product.weight * count * 100;
                  break;
                case 1:
                  monthlyBonus.level1 += product.weight * count * 100;
                  monthlyBonus.totalBonus += product.weight * count * 100;
                  break;
                case 2:
                  monthlyBonus.level2 += product.weight * count * 100;
                  monthlyBonus.totalBonus += product.weight * count * 100;
                  break;
                case 3:
                  monthlyBonus.level3 += product.weight * count * 100;
                  monthlyBonus.totalBonus += product.weight * count * 100;
                  break;
                case 4:
                  monthlyBonus.level4 += product.weight * count * 100;
                  monthlyBonus.totalBonus += product.weight * count * 100;
                  break;
                case 5:
                  monthlyBonus.level5 += product.weight * count * 50;
                  monthlyBonus.totalBonus += product.weight * count * 50;
                  break;
                case 6:
                  monthlyBonus.level6 += product.weight * count * 50;
                  monthlyBonus.totalBonus += product.weight * count * 50;
                  break;
                case 7:
                  monthlyBonus.level7 += product.weight * count * 50;
                  monthlyBonus.totalBonus += product.weight * count * 50;
                  break;
                case 8:
                  monthlyBonus.level8 += product.weight * count * 50;
                  monthlyBonus.totalBonus += product.weight * count * 50;
                  break;
                case 9:
                  monthlyBonus.level9 += product.weight * count * 50;
                  monthlyBonus.totalBonus += product.weight * count * 50;
                  break;
                case 10:
                  monthlyBonus.level10 += product.weight * count * 50;
                  monthlyBonus.totalBonus += product.weight * count * 50;
                  break;
              }
              await monthlyBonusRepository.save(monthlyBonus);
              if (currentUser.upLine) {
                level++;
                nextUserLevel = currentUser.upLine;
              } else {
                level++;
                break;
              }
            } else {
              break;
            }
          }
          while (level < 11) {
            let monthlyBonusRepository = getConnection().getRepository(
              MonthlyBonus
            );
            let monthlyBonus = await monthlyBonusRepository.findOne({
              where: { user: companyAccount, period: period },
            });
            if (!monthlyBonus) {
              monthlyBonus = new MonthlyBonus();
              monthlyBonus.user = companyAccount;
              monthlyBonus.period = period;
              monthlyBonus.isActive = true;
              monthlyBonus.level0 = 0;
              monthlyBonus.level1 = 0;
              monthlyBonus.level2 = 0;
              monthlyBonus.level3 = 0;
              monthlyBonus.level4 = 0;
              monthlyBonus.level5 = 0;
              monthlyBonus.level6 = 0;
              monthlyBonus.level7 = 0;
              monthlyBonus.level8 = 0;
              monthlyBonus.level9 = 0;
              monthlyBonus.level0 = 0;
              monthlyBonus.totalBonus = 0;
            }
            switch (level) {
              case 0:
                monthlyBonus.level0 += product.weight * count * 100;
                monthlyBonus.totalBonus += product.weight * count * 100;
                break;
              case 1:
                monthlyBonus.level1 += product.weight * count * 100;
                monthlyBonus.totalBonus += product.weight * count * 100;
                break;
              case 2:
                monthlyBonus.level2 += product.weight * count * 100;
                monthlyBonus.totalBonus += product.weight * count * 100;
                break;
              case 3:
                monthlyBonus.level3 += product.weight * count * 100;
                monthlyBonus.totalBonus += product.weight * count * 100;
                break;
              case 4:
                monthlyBonus.level4 += product.weight * count * 100;
                monthlyBonus.totalBonus += product.weight * count * 100;
                break;
              case 5:
                monthlyBonus.level5 += product.weight * count * 50;
                monthlyBonus.totalBonus += product.weight * count * 50;
                break;
              case 6:
                monthlyBonus.level6 += product.weight * count * 50;
                monthlyBonus.totalBonus += product.weight * count * 50;
                break;
              case 7:
                monthlyBonus.level7 += product.weight * count * 50;
                monthlyBonus.totalBonus += product.weight * count * 50;
                break;
              case 8:
                monthlyBonus.level8 += product.weight * count * 50;
                monthlyBonus.totalBonus += product.weight * count * 50;
                break;
              case 9:
                monthlyBonus.level9 += product.weight * count * 50;
                monthlyBonus.totalBonus += product.weight * count * 50;
                break;
              case 10:
                monthlyBonus.level10 += product.weight * count * 50;
                monthlyBonus.totalBonus += product.weight * count * 50;
                break;
            }
            await monthlyBonusRepository.save(monthlyBonus);
            level++;
          }

          let opAccount = await userRepository.findOne({
            where: { username: "BRS002" },
            relations: ["upLine"],
          });
          let itAccount = await userRepository.findOne({
            where: { username: "BRS003" },
            relations: ["upLine"],
          });
          if (opAccount && itAccount && companyAccount) {
            let internalMonthlyBonusRepository = getConnection().getRepository(
              InternalMonthlyBonus
            );

            const internalMonthlyBonusOp = new InternalMonthlyBonus();
            internalMonthlyBonusOp.user = opAccount;
            internalMonthlyBonusOp.period = period;
            internalMonthlyBonusOp.isActive = true;
            internalMonthlyBonusOp.totalBonus = product.weight * count * 150;
            internalMonthlyBonusOp.transaction = transaction;

            const internalMonthlyBonusIt = new InternalMonthlyBonus();
            internalMonthlyBonusIt.user = itAccount;
            internalMonthlyBonusIt.period = period;
            internalMonthlyBonusIt.isActive = true;
            internalMonthlyBonusIt.totalBonus = product.weight * count * 150;
            internalMonthlyBonusIt.transaction = transaction;

            const internalMonthlyBonusCompany = new InternalMonthlyBonus();
            internalMonthlyBonusCompany.user = companyAccount;
            internalMonthlyBonusCompany.period = period;
            internalMonthlyBonusCompany.isActive = true;
            internalMonthlyBonusCompany.totalBonus =
              product.weight * count * 300;
            internalMonthlyBonusCompany.transaction = transaction;

            await internalMonthlyBonusRepository.save(internalMonthlyBonusOp);
            await internalMonthlyBonusRepository.save(internalMonthlyBonusIt);
            await internalMonthlyBonusRepository.save(
              internalMonthlyBonusCompany
            );
          }
          // await queryRunner.commitTransaction();
          return HttpResponse(200, "Transaction succsesfully added");
        } catch (err) {
          // await queryRunner.rollbackTransaction();
          return HttpResponse(400, err);
        } finally {
          // await queryRunner.release();
        }
      }
      return HttpResponse(400, "User not found");
    } catch (error) {
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
}

export default Transactions;
