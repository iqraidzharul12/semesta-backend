 
import { getConnection } from 'typeorm';
import { User } from '../../../model/entities';
import { HttpResponse, getUserFromToken, sha256, randomUserName, randomKey} from '../../../utilities';
import * as Crypto from 'crypto-js';
import { validate } from 'class-validator';
import { getAllDownLines, countDownline } from '../helper/helper';

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
        where: { username: req.payload.username },
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
        where: { username: req.payload.username },
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

  static generateUser = async (req: any, res: any): Promise<object> =>{
    try {
      let userRepository = getConnection().getRepository(User);

      const count = req.payload.count;

      let savedUser = 0;

      const addedUser: User[] = [];

      for (let i = 0; i < count; i++) {
        const user = new User();
        user.key = randomKey();
        user.password = sha256("Password").toString();
        user.isActive = false;
        let existed = true;
        while(existed){
          user.username = randomUserName("ETC", "001");
          const existingUser = await userRepository.findOne({
            where: {username: user.username}
          });
          if(!existingUser){
            existed = false;
            await userRepository.save(user);
            savedUser++;
            delete user.password;
            addedUser.push(user);
          }
        }
      }

      const res = {
        message: "Successfully generate "+savedUser+" user.",
        user: addedUser,
      }

      return HttpResponse(200, res);

      // return HttpResponse(400, "error at generating user");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }

  static activateUser = async (req: any, res: any): Promise<object> => {
    try {
      let userRepository = getConnection().getRepository(User);

      const user = await userRepository.findOne({
        where: {
          username:  req.payload.username,
          key: req.payload.key,
          isActive: false,
        },
      });
      if(user){
        user.email = req.payload.email;
        user.fullName = req.payload.fullname;
        user.password = sha256("Password").toString();
        user.isActive = true;

        const userEmail = await userRepository.count({
          where: {email: user.email}
        })
        if(userEmail){
          return HttpResponse(401, 'Duplicate email address, please use a different email address.');
        }

        const upliner = await userRepository.findOne({
          where: {
            username: req.payload.upliner,
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
          throw errors;
        }
  
        await userRepository.save(user);
  
        const person = await userRepository.findOne({
          select: [ "id", "email", "username", "fullName", "isActive" ],
          where: {
            username: req.payload.username,
          },
        });
  
        if (person) return HttpResponse(200, person);
        return HttpResponse(204, {});
      }
      return HttpResponse(401, 'User not found or already activated, please make sure you input correct user id and key.');
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }

  static getAllDownLines = async (req: any, res: any): Promise<object> => {
    try {
      let userRepository = getConnection().getRepository(User);

      const person = await userRepository.findOne({
        where: { username: req.payload.username },
      });

      if (person) {
        if (!person.isActive) return HttpResponse(401, 'This account is not activated yet, please contact your admin to activate it.');
        delete person.password;

        const level = 0

        const user = await getAllDownLines(person, level);

        const count = countDownline(user)

        const result = {
          user: [user],
          count
        }


        return HttpResponse(200, result);
      }
      return HttpResponse(401, 'User not found.');
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }
}

export default Users;
