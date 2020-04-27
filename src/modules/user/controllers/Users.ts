 
import { getConnection } from 'typeorm';
import { User } from '../../../model/entities';
import { HttpResponse, getUserFromToken} from '../../../utilities';

class Users {
  static getAllUser = async (req: any, res: any): Promise<object> => {
    try {
      let userRepository = getConnection().getRepository(User);

      const person = await userRepository.find({});
      if (person) {
        person.forEach(element => {
          delete element.password;
        });
        return HttpResponse(200, person);
      }
      return HttpResponse(401, 'User not found.');
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }
  static getUserByUsername = async (req: any, res: any): Promise<object> => {
    try {
      let userRepository = getConnection().getRepository(User);

      const person = await userRepository.findOne({
        relations: ["downLines"],
        where: { userName: req.payload.username },
      });
      if (person) {
        if (!person.isActive) return HttpResponse(401, 'This account is not activated yet, please contact your admin to activate it.');
        delete person.password;
        person.downLines.forEach(element => {
          delete element.password;
        });
        return HttpResponse(200, person);
      }
      return HttpResponse(401, 'User not found.');
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }

  static getDirectDownline = async (req: any, res: any): Promise<object> => {
    try {
      let userRepository = getConnection().getRepository(User);

      const person = await userRepository.findOne({
        where: { userName: req.payload.username },
      });

      if (person) {
        if (!person.isActive) return HttpResponse(401, 'This account is not activated yet, please contact your admin to activate it.');
        delete person.password;

        const directDownline = await userRepository.find({
          relations: ["downLines"],
          where: { upLine: person },
        });

        directDownline.forEach(async element => {
          delete element.password;
          element.downLines.forEach(async element => {
            delete element.password;
          });
        });

        // person.downLines.forEach(async element => {
        //   delete element.password;
        // });
        return HttpResponse(200, directDownline);
      }
      return HttpResponse(401, 'User not found.');
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }

  static testAuth = async (req: any, res: any): Promise<object> => {
    try {
      const user = getUserFromToken(req.headers.content)
      if(user) return HttpResponse(200, user.userName);
      return HttpResponse(400, "Invalid token")
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }
}

export default Users;
