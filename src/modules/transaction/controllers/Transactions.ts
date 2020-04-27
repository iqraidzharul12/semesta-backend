 
import { getConnection } from 'typeorm';
import { User, Transaction } from '../../../model/entities';
import { HttpResponse} from '../../../utilities';
import { getUserFromToken } from '../../../utilities/HashEncrypt';

class Transactions {
  static getAll = async (req: any, res: any): Promise<object> => {
    try {
      let transactionRepository = getConnection().getRepository(Transaction);

      const transactions = await transactionRepository.find({});
      if (transactions) {
        return HttpResponse(200, transactions);
      }
      return HttpResponse(401, 'Transaction not found.');
    } catch (error) {
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }
  static getTransactionByUser = async (req: any, res: any): Promise<object> => {
    try {
      const pageNumber = req.payload.pageNumber;
      const pageSize = req.payload.pageSize;
      const first = pageNumber * pageSize;

      const user = getUserFromToken(req.headers.content)
      if(user){
        let transactionRepository = getConnection().getRepository(Transaction);
        const count = await transactionRepository.count();
        const content = await transactionRepository.find({
          where: {user: user},
          skip: first,
          take: pageSize,
          order: { 
            date: 'ASC' 
          }, 
          relations: ["stockies", "product"],
        });

        if (content) {
          const data = {
            totalElements: count,
            pageSize,
            pageNumber,
            first: first+1,
            last: first+content.length,
            content,
          }
          return HttpResponse(200, data);
        }
        return HttpResponse(401, 'Transaction not found.');
      }
      return HttpResponse(401, 'User not found.');
    } catch (error) {
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }
}

export default Transactions;
