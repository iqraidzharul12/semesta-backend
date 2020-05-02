 
import { getConnection } from 'typeorm';
import { User, MonthlyBonus, Period } from '../../../model/entities';
import { HttpResponse, getUserFromToken } from '../../../utilities';

class MonthlyBonuss {
  static getMonthlyBonusByUser = async (req: any, res: any): Promise<object> => {
    try {
      const user = getUserFromToken(req.headers.content);
      let periodRepository = getConnection().getRepository(Period);
      const period = await periodRepository.findOne({
        where: {name: 'APR-20'}
      });
      if(user){
        let monthlyBonusRepository = getConnection().getRepository(MonthlyBonus);
        const monthlyBonus = await monthlyBonusRepository.find({
          where: {user: user, period: period}
        });
        if(monthlyBonus){
          return HttpResponse(200, monthlyBonus);
        }
        return HttpResponse(401, 'Monthly Bonus not found.');
      }
      return HttpResponse(401, 'User not found.');
    } catch (error) {
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }
}

export default MonthlyBonuss;
