import { getConnection } from "typeorm";
import {
  MonthlyBonus,
  Period,
  MonthlyLevelBonus,
} from "../../../model/entities";
import { HttpResponse, getUserFromToken } from "../../../utilities";
import { getManager } from "typeorm";

class MonthlyLevelBonuss {
  static getActiveMonthLevelBonusByUser = async (
    req: any,
    res: any
  ): Promise<object> => {
    try {
      const user = getUserFromToken(req.headers.content);
      let periodRepository = getConnection().getRepository(Period);
      const period = await periodRepository.findOne({
        where: { status: "OPEN" },
      });
      if (user) {
        let monthlyLevelBonusRepository = getConnection().getRepository(
          MonthlyLevelBonus
        );
        const monthlyLevelBonus = await monthlyLevelBonusRepository.find({
          where: { user: user, period: period },
        });
        if (monthlyLevelBonus) {
          return HttpResponse(200, monthlyLevelBonus);
        }
        return HttpResponse(401, "Monthly Bonus not found.");
      }
      return HttpResponse(401, "User not found.");
    } catch (error) {
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
  static getActiveMonthLevelBonusByUserByPeriod = async (
    req: any,
    res: any
  ): Promise<object> => {
    try {
      const periodId = req.params.id;
      const user = getUserFromToken(req.headers.content);
      let periodRepository = getConnection().getRepository(Period);
      const period = await periodRepository.findOne({
        where: { id: periodId },
      });
      if (user) {
        let monthlyLevelBonusRepository = getConnection().getRepository(
          MonthlyLevelBonus
        );
        const monthlyLevelBonus = await monthlyLevelBonusRepository.find({
          where: { user: user, period: period },
        });
        if (monthlyLevelBonus) {
          return HttpResponse(200, monthlyLevelBonus);
        }
        return HttpResponse(401, "Monthly Bonus not found.");
      }
      return HttpResponse(401, "User not found.");
    } catch (error) {
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };

  static getMonthlyBonusByStockies = async (
    req: any,
    res: any
  ): Promise<object> => {
    try {
      const stockies = req.payload.stockies;

      const user = await getManager().query(
        `SELECT * FROM public.monthly_bonus mb LEFT JOIN public.user u ON mb.userId = u.id`
      );

      if (user) {
        return HttpResponse(200, user);
      }
      return HttpResponse(401, "User not found.");
    } catch (error) {
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
}

export default MonthlyLevelBonuss;
