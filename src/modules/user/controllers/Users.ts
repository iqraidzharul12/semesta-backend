import { getConnection } from "typeorm";
import {
  User,
  Stockies,
  MonthlyBonus,
  Village,
  MonthlyLevelBonus,
  Period,
} from "../../../model/entities";
import {
  HttpResponse,
  sha256,
  randomUserName,
  randomKey,
} from "../../../utilities";
import { validate } from "class-validator";
import {
  getAllDownLines,
  countDownline,
  getDirectDownLines,
} from "../helper/helper";
import * as fs from "fs-extra";
import * as moment from "moment";
import { LevelBonus } from "../../../config";

class Users {
  static getAllUser = async (req: any, res: any): Promise<object> => {
    try {
      let userRepository = getConnection().getRepository(User);

      const person = await userRepository.find({});
      if (person) {
        person.forEach((element) => {
          delete element.password;
        });
        return HttpResponse(200, person);
      }
      return HttpResponse(401, "User not found.");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };

  static getAllUserByStockies = async (req: any, res: any): Promise<object> => {
    try {
      const pageNumber = req.payload.pageNumber;
      const pageSize = req.payload.pageSize;
      const first = pageNumber * pageSize;
      const stockies = req.payload.stockies;

      if (stockies) {
        let userRepository = getConnection().getRepository(User);
        const count = await userRepository.count({
          where: { stockiesReferal: stockies },
        });
        const content = await userRepository.find({
          where: { stockiesReferal: stockies },
          skip: first,
          take: pageSize,
          order: {
            username: "ASC",
          },
          relations: ["upLine", "monthlyBonus"],
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

  static getUserByUsername = async (req: any, res: any): Promise<object> => {
    try {
      let userRepository = getConnection().getRepository(User);

      const person = await userRepository.findOne({
        relations: ["downLines"],
        where: { username: req.payload.username },
      });
      if (person) {
        if (!person.isActive)
          return HttpResponse(
            401,
            "This account is not activated yet, please contact your admin to activate it."
          );
        delete person.password;
        person.downLines.forEach((element) => {
          delete element.password;
        });
        return HttpResponse(200, person);
      }
      return HttpResponse(401, "User not found.");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };

  static getDirectDownline2 = async (req: any, res: any): Promise<object> => {
    try {
      let userRepository = getConnection().getRepository(User);

      const person = await userRepository.findOne({
        where: { username: req.payload.username },
      });

      if (person) {
        if (!person.isActive)
          return HttpResponse(
            401,
            "This account is not activated yet, please contact your admin to activate it."
          );
        delete person.password;

        const directDownline = await userRepository.find({
          relations: ["downLines"],
          where: { upLine: person },
        });

        directDownline.forEach(async (element) => {
          delete element.password;
          element.downLines.forEach(async (element) => {
            delete element.password;
          });
        });

        // person.downLines.forEach(async element => {
        //   delete element.password;
        // });
        return HttpResponse(200, directDownline);
      }
      return HttpResponse(401, "User not found.");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };

  static generateUser = async (req: any, res: any): Promise<object> => {
    try {
      let userRepository = getConnection().getRepository(User);

      const count = req.payload.count;

      let savedUser = 0;

      const addedUser: User[] = [];

      let QRCode = require("qrcode");

      let path = `${process.cwd()}/uploads/QR/`;

      fs.mkdirpSync(`${path}${moment().format("YYYY")}`);

      fs.mkdirpSync(`${path}${moment().format("YYYY/MM")}`);
      fs.mkdirpSync(`${path}${moment().format("YYYY/MM/DD")}`);
      path = `${path}${moment().format(`YYYY/MM/DD`)}`;

      var fsExcel = require("fs");
      var writeStream = fsExcel.createWriteStream(`${path}/list.xls`);

      var header = "NOMOR ID" + "\t" + " KEY" + "\t" + "QR" + "\n";
      writeStream.write(header);

      for (let i = 0; i < count; i++) {
        const user = new User();
        user.key = randomKey();
        user.password = sha256("Password").toString();
        user.isActive = false;
        let existed = true;
        while (existed) {
          user.username = randomUserName("ETC", "001");
          const existingUser = await userRepository.findOne({
            where: { username: user.username },
          });
          if (!existingUser) {
            existed = false;
            await userRepository.save(user);
            savedUser++;
            delete user.password;
            addedUser.push(user);

            let text = user.username;

            QRCode.toFile(`${path}/${text}.png`, text, {}, function (err: any) {
              if (err) throw err;
            });

            var row =
              user.username +
              "\t" +
              " " +
              user.key +
              "\t" +
              user.username +
              ".png" +
              "\n";
            writeStream.write(row);
          }
        }
      }

      writeStream.close();

      const res = {
        message: "Successfully generate " + savedUser + " user.",
        user: addedUser,
      };

      return HttpResponse(200, res);

      // return HttpResponse(400, "error at generating user");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };

  static activateUser = async (req: any, res: any): Promise<object> => {
    try {
      let userRepository = getConnection().getRepository(User);
      let stockiesRepository = getConnection().getRepository(Stockies);

      let companyAccount = await userRepository.findOne({
        where: { username: "BRS001" },
        relations: ["upLine"],
      });

      let periodRepository = getConnection().getRepository(Period);
      const period = await periodRepository.findOne({
        where: { status: "OPEN" },
      });

      const user = await userRepository.findOne({
        where: {
          username: req.payload.username,
          key: req.payload.key,
          isActive: false,
        },
      });
      if (user && companyAccount && period) {
        user.email = req.payload.email;
        user.fullName = req.payload.fullname;
        user.address = req.payload.address;
        user.password = sha256(req.payload.password).toString();
        user.village = req.payload.village;
        user.isActive = true;
        user.activatedAt = new Date();

        const upliner = await userRepository.findOne({
          where: {
            username: req.payload.upliner,
          },
        });
        if (upliner) {
          if (!upliner.isActive)
            return HttpResponse(
              401,
              "Upliner is not activated yet, please contact your admin to activate it."
            );
          const uplinerCount = await userRepository.count({
            where: {
              upLine: upliner,
            },
          });
          if (uplinerCount >= 5)
            return HttpResponse(401, "Upliner already has maximum downline.");
          user.upLine = upliner;
        } else {
          return HttpResponse(
            401,
            "Upliner not found, please make sure you input correct id."
          );
        }

        const sponsor = await userRepository.findOne({
          where: {
            username: req.payload.sponsor,
          },
        });

        if (sponsor) {
          if (!sponsor.isActive)
            return HttpResponse(
              401,
              "Sponsor is not activated yet, please contact your admin to activate it."
            );
          user.sponsor = sponsor;
        } else {
          return HttpResponse(
            401,
            "Sponsor not found, please make sure you input correct id."
          );
        }

        const stockiesReferal = await stockiesRepository.findOne({
          where: {
            username: req.payload.stockies,
          },
        });

        if (!stockiesReferal) {
          return HttpResponse(
            401,
            "Stockies referal not found, please make sure you input correct id."
          );
        }

        user.stockiesReferal = stockiesReferal;

        const validation = await validate(user);

        if (validation.length) {
          let errors: any = Object.values(validation[0].constraints);
          throw errors;
        }

        await userRepository.save(user);

        try {
          let monthlyLevelBonusRepository = getConnection().getRepository(
            MonthlyLevelBonus
          );
          let monthlyLevelBonusSponsor = await monthlyLevelBonusRepository.findOne(
            {
              where: {
                user: sponsor,
                period: period,
              },
            }
          );
          if (!monthlyLevelBonusSponsor) {
            monthlyLevelBonusSponsor = new MonthlyLevelBonus();
            monthlyLevelBonusSponsor.user = sponsor;
            monthlyLevelBonusSponsor.period = period;
            monthlyLevelBonusSponsor.isActive = true;
            monthlyLevelBonusSponsor.level0 = 0;
            monthlyLevelBonusSponsor.level1 = 0;
            monthlyLevelBonusSponsor.level2 = 0;
            monthlyLevelBonusSponsor.level3 = 0;
            monthlyLevelBonusSponsor.level4 = 0;
            monthlyLevelBonusSponsor.level5 = 0;
            monthlyLevelBonusSponsor.level6 = 0;
            monthlyLevelBonusSponsor.level7 = 0;
            monthlyLevelBonusSponsor.level8 = 0;
            monthlyLevelBonusSponsor.level9 = 0;
            monthlyLevelBonusSponsor.level0 = 0;
            monthlyLevelBonusSponsor.totalBonus = 0;
          }
          monthlyLevelBonusSponsor.level0 += LevelBonus[0];
          monthlyLevelBonusSponsor.totalBonus += LevelBonus[0];
          await monthlyLevelBonusRepository.save(monthlyLevelBonusSponsor);

          let level = 1;
          let nextUserLevel = upliner;
          while (level < 10) {
            let currentUser = await userRepository.findOne({
              where: { username: nextUserLevel.username },
              relations: ["upLine"],
            });
            if (currentUser) {
              let monthlyBonusLevelRepository = getConnection().getRepository(
                MonthlyLevelBonus
              );
              let monthlyLevelBonus = await monthlyBonusLevelRepository.findOne(
                {
                  where: { user: currentUser, period: period },
                }
              );
              if (!monthlyLevelBonus) {
                monthlyLevelBonus = new MonthlyLevelBonus();
                monthlyLevelBonus.user = currentUser;
                monthlyLevelBonus.period = period;
                monthlyLevelBonus.isActive = true;
                monthlyLevelBonus.level0 = 0;
                monthlyLevelBonus.level1 = 0;
                monthlyLevelBonus.level2 = 0;
                monthlyLevelBonus.level3 = 0;
                monthlyLevelBonus.level4 = 0;
                monthlyLevelBonus.level5 = 0;
                monthlyLevelBonus.level6 = 0;
                monthlyLevelBonus.level7 = 0;
                monthlyLevelBonus.level8 = 0;
                monthlyLevelBonus.level9 = 0;
                monthlyLevelBonus.level0 = 0;
                monthlyLevelBonus.totalBonus = 0;
              }
              switch (level) {
                case 0:
                  monthlyLevelBonus.level0 += LevelBonus[level];
                  monthlyLevelBonus.totalBonus += LevelBonus[level];
                  break;
                case 1:
                  monthlyLevelBonus.level1 += LevelBonus[level];
                  monthlyLevelBonus.totalBonus += LevelBonus[level];
                  break;
                case 2:
                  monthlyLevelBonus.level2 += LevelBonus[level];
                  monthlyLevelBonus.totalBonus += LevelBonus[level];
                  break;
                case 3:
                  monthlyLevelBonus.level3 += LevelBonus[level];
                  monthlyLevelBonus.totalBonus += LevelBonus[level];
                  break;
                case 4:
                  monthlyLevelBonus.level4 += LevelBonus[level];
                  monthlyLevelBonus.totalBonus += LevelBonus[level];
                  break;
                case 5:
                  monthlyLevelBonus.level5 += LevelBonus[level];
                  monthlyLevelBonus.totalBonus += LevelBonus[level];
                  break;
                case 6:
                  monthlyLevelBonus.level6 += LevelBonus[level];
                  monthlyLevelBonus.totalBonus += LevelBonus[level];
                  break;
                case 7:
                  monthlyLevelBonus.level7 += LevelBonus[level];
                  monthlyLevelBonus.totalBonus += LevelBonus[level];
                  break;
                case 8:
                  monthlyLevelBonus.level8 += LevelBonus[level];
                  monthlyLevelBonus.totalBonus += LevelBonus[level];
                  break;
                case 9:
                  monthlyLevelBonus.level9 += LevelBonus[level];
                  monthlyLevelBonus.totalBonus += LevelBonus[level];
                  break;
                case 10:
                  monthlyLevelBonus.level10 += LevelBonus[level];
                  monthlyLevelBonus.totalBonus += LevelBonus[level];
                  break;
              }
              await monthlyBonusLevelRepository.save(monthlyLevelBonus);
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
          while (level < 10) {
            let monthlyLevelBonusRepository = getConnection().getRepository(
              MonthlyLevelBonus
            );
            let monthlyLevelBonus = await monthlyLevelBonusRepository.findOne({
              where: { user: companyAccount, period: period },
            });
            if (!monthlyLevelBonus) {
              monthlyLevelBonus = new MonthlyLevelBonus();
              monthlyLevelBonus.user = companyAccount;
              monthlyLevelBonus.period = period;
              monthlyLevelBonus.isActive = true;
              monthlyLevelBonus.level0 = 0;
              monthlyLevelBonus.level1 = 0;
              monthlyLevelBonus.level2 = 0;
              monthlyLevelBonus.level3 = 0;
              monthlyLevelBonus.level4 = 0;
              monthlyLevelBonus.level5 = 0;
              monthlyLevelBonus.level6 = 0;
              monthlyLevelBonus.level7 = 0;
              monthlyLevelBonus.level8 = 0;
              monthlyLevelBonus.level9 = 0;
              monthlyLevelBonus.level0 = 0;
              monthlyLevelBonus.totalBonus = 0;
            }
            switch (level) {
              case 0:
                monthlyLevelBonus.level0 += LevelBonus[level];
                monthlyLevelBonus.totalBonus += LevelBonus[level];
                break;
              case 1:
                monthlyLevelBonus.level1 += LevelBonus[level];
                monthlyLevelBonus.totalBonus += LevelBonus[level];
                break;
              case 2:
                monthlyLevelBonus.level2 += LevelBonus[level];
                monthlyLevelBonus.totalBonus += LevelBonus[level];
                break;
              case 3:
                monthlyLevelBonus.level3 += LevelBonus[level];
                monthlyLevelBonus.totalBonus += LevelBonus[level];
                break;
              case 4:
                monthlyLevelBonus.level4 += LevelBonus[level];
                monthlyLevelBonus.totalBonus += LevelBonus[level];
                break;
              case 5:
                monthlyLevelBonus.level5 += LevelBonus[level];
                monthlyLevelBonus.totalBonus += LevelBonus[level];
                break;
              case 6:
                monthlyLevelBonus.level6 += LevelBonus[level];
                monthlyLevelBonus.totalBonus += LevelBonus[level];
                break;
              case 7:
                monthlyLevelBonus.level7 += LevelBonus[level];
                monthlyLevelBonus.totalBonus += LevelBonus[level];
                break;
              case 8:
                monthlyLevelBonus.level8 += LevelBonus[level];
                monthlyLevelBonus.totalBonus += LevelBonus[level];
                break;
              case 9:
                monthlyLevelBonus.level9 += LevelBonus[level];
                monthlyLevelBonus.totalBonus += LevelBonus[level];
                break;
              case 10:
                monthlyLevelBonus.level10 += LevelBonus[level];
                monthlyLevelBonus.totalBonus += LevelBonus[level];
                break;
            }
            await monthlyLevelBonusRepository.save(monthlyLevelBonus);
            level++;
          }
        } catch {
          return HttpResponse(404, "Error when distribute point.");
        }

        const person = await userRepository.findOne({
          select: ["id", "email", "username", "fullName", "isActive"],
          where: {
            username: req.payload.username,
          },
        });

        if (person) return HttpResponse(200, person);
        return HttpResponse(204, {});
      }
      return HttpResponse(
        401,
        "User not found or already activated, please make sure you input correct user id and key."
      );
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };

  static getAllDownLines = async (req: any, res: any): Promise<object> => {
    try {
      let userRepository = getConnection().getRepository(User);

      const person = await userRepository.findOne({
        where: { username: req.payload.username },
      });

      if (person) {
        if (!person.isActive)
          return HttpResponse(
            401,
            "This account is not activated yet, please contact your admin to activate it."
          );
        delete person.password;

        const level = 0;

        const user = await getAllDownLines(person, level);

        const count = countDownline(user);

        const result = {
          user: [user],
          count,
        };
        return HttpResponse(200, result);
      }
      return HttpResponse(401, "User not found.");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };

  static getDirectDownline = async (req: any, res: any): Promise<object> => {
    try {
      let userRepository = getConnection().getRepository(User);

      const person = await userRepository.findOne({
        where: { username: req.payload.username },
      });

      if (person) {
        if (!person.isActive)
          return HttpResponse(
            401,
            "This account is not activated yet, please contact your admin to activate it."
          );
        delete person.password;

        const level = 0;

        const user = await getDirectDownLines(person, level);

        const result = {
          user: [user],
        };
        return HttpResponse(200, result);
      }
      return HttpResponse(401, "User not found.");
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  };
}

export default Users;
