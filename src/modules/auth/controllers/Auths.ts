 
import { getConnection } from 'typeorm';
import { validate } from 'class-validator';
import { User } from '../../../model/entities';
import { HttpResponse, sha256, generateToken, getUserFromToken } from '../../../utilities';

class Auths {
  static signIn = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      let userRepository = getConnection().getRepository(User);

      const person = await userRepository.findOne({
        relations: ["downLines"],
        // where: { userName: req.payload.username, password: sha256(req.headers.information).toString() },
        where: { userName: req.payload.username, password: sha256(req.payload.password).toString() },
      });
      if (person) {
        if (!person.isActive) return HttpResponse(401, 'This account is not activated yet, please contact your admin to activate it.');
        const exp: any = Math.floor(new Date().getTime()/1000) + 1*24*60*60;
        const token: string = generateToken(person, exp);
        delete person.password;
        return res.response(HttpResponse(200, person)).header('content', token).header('exp', exp);
      }
      return HttpResponse(401, 'Wrong combination username and password.');
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }

  static signUp = async (req: any, res: any): Promise<object> => {
    try {
      let user = new User();
      user.email = req.payload.email;
      user.userName = req.payload.username;
      user.firstName = req.payload.firstname;
      user.lastName = req.payload.lastname;
      const uplinerID = req.payload.upliner;
      // user.password = sha256(req.headers.information).toString();
      // user.isActive = req.headers.post === 'true' ? true : false;
      user.password = sha256("Password").toString();
      user.isActive = true;

      let userRepository = getConnection().getRepository(User);

      const upliner = await userRepository.findOne({
        where: {
          userName: uplinerID,
        },
      });
 
      if (upliner) {
        if (!upliner.isActive) return HttpResponse(401, 'Upliner is not activated yet, please contact your admin to activate it.');
        const uplinerCount = await userRepository.count({
          where:{
            upLine: upliner,
          }
        });
        if(uplinerCount >= 5) return HttpResponse(401, 'Upliner already has maximum downline.');
        user.upLine = upliner;
      }else{
        return HttpResponse(401, 'Upliner not found, please make sure you input correct id.');
      }

      const validation = await validate(user);
      if (validation.length) {
        let errors: any = Object.values(validation[0].constraints);
        // if (req.headers.information.length < 8) {
        //   errors = [
        //     ...errors,
        //     'minimum password is 8 character.',
        //   ];
        // }
        throw errors;
      }

      await userRepository.save(user);

      const person = await userRepository.findOne({
        select: [ "id", "email", "userName", "firstName", "lastName", "isActive" ],
        where: {
          userName: req.payload.username,
        },
      });

      if (person) return HttpResponse(200, person);
      return HttpResponse(204, {});
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }

  static authCheck = async (req: any, res: any): Promise<object> => {
    try {
      const user = getUserFromToken(req.headers.content);
      if(user) {
        delete user.password;
        return HttpResponse(200, user);
      }
      return HttpResponse(400, "Invalid token")
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }
}

export default Auths;
