import { User, MonthlyBonus, Period } from "../../../model/entities";
import { getConnection } from "typeorm";

export const getAllDownLines = async (
  user: User,
  level: number
): Promise<{ id: any; name: any; parent: any; children: any }> => {
  const defaultUser = {
    id: "default",
    name: "default",
    parent: "default",
    level: level,
    children: [],
    purchaseBonus: 0,
  };

  try {
    let userRepository = getConnection().getRepository(User);

    const person = await userRepository.findOne({
      where: { username: user.username },
      relations: ["upLine"],
    });

    if (person) {
      if (!person.isActive) return defaultUser;

      let purchaseBonus = 0;

      let periodRepository = getConnection().getRepository(Period);
      const period = await periodRepository.findOne({
        where: { status: "OPEN" },
      });

      let bonusRepository = getConnection().getRepository(MonthlyBonus);
      const bonus = await bonusRepository.findOne({
        where: { user: person, period: period },
      });

      if (bonus) {
        purchaseBonus = bonus.level0;
      }

      const user = {
        id: person.id,
        name: person.fullName,
        parent: person.upLine ? person.upLine.id : null,
        level: level,
        children: [] as { id: any; name: any; parent: any; children: any }[],
        purchaseBonus: purchaseBonus,
      };

      const directDownline = await userRepository.find({
        where: { upLine: person },
        order: { username: "ASC" },
        relations: ["upLine"],
      });

      if (directDownline.length) {
        for (let i = 0; i < directDownline.length; i++) {
          const downline = await getAllDownLines(directDownline[i], level + 1);
          if (downline.name != defaultUser.name && level <= 10) {
            user.children.push(downline);
          }
        }
      }

      return user;
    }

    return defaultUser;
  } catch (error) {
    console.log(error);
    return defaultUser;
  }
};

export const countDownline = (user: {
  id: any;
  name: any;
  parent: any;
  children: any;
}) => {
  let count = 0;
  if (user.children && user.children.length) {
    count += user.children.length;
    for (let i = 0; i < user.children.length; i++) {
      count += countDownline(user.children[i]);
    }
  }
  return count;
};

export const getDirectDownLines = async (
  user: User,
  level: number
): Promise<{ id: any; name: any; parent: any; children: any }> => {
  const defaultUser = {
    id: "default",
    name: "default",
    parent: "default",
    level: level,
    children: [],
  };

  try {
    let userRepository = getConnection().getRepository(User);

    const person = await userRepository.findOne({
      where: { username: user.username },
      relations: ["upLine"],
    });

    if (person) {
      if (!person.isActive) return defaultUser;

      let totalBonus = 0;

      let periodRepository = getConnection().getRepository(Period);
      const period = await periodRepository.findOne({
        where: { status: "OPEN" },
      });

      let bonusRepository = getConnection().getRepository(MonthlyBonus);
      const bonus = await bonusRepository.findOne({
        where: { user: person, period: period },
      });

      // let bonusRepository = getConnection().getRepository(MonthlyBonus);
      // const bonus = await bonusRepository.findOne({
      //   where: { user: person },
      // });

      if (bonus) {
        totalBonus = bonus.totalBonus;
      }
      const user = {
        id: person.id,
        name: person.fullName,
        parent: person.upLine ? person.upLine.id : null,
        level: level,
        children: [] as { id: any; name: any; parent: any; children: any }[],
        totalBonus: bonus ? bonus.level0 : 0,
        branch: null,
      };

      const directDownline = await userRepository.find({
        where: { upLine: person },
        order: { username: "ASC" },
        relations: ["upLine"],
      });

      if (directDownline.length) {
        let branch = 0;
        for (let i = 0; i < directDownline.length; i++) {
          let totalBonus = 0;
          const bonus = await bonusRepository.findOne({
            where: { user: directDownline[i] },
          });

          if (bonus) {
            totalBonus = bonus.totalBonus;
          }

          const downline = {
            id: directDownline[i].id,
            name: directDownline[i].fullName,
            parent: directDownline[i].upLine
              ? directDownline[i].upLine.id
              : null,
            level: level + 1,
            children: [] as {
              id: any;
              name: any;
              parent: any;
              children: any;
            }[],
            totalBonus: totalBonus,
            branch: branch + 1,
          };
          user.children.push(downline);
          branch++;
        }

        for (let i = 0; i < 5 - directDownline.length; i++) {
          const downline = {
            id: 0,
            name: "NO DATA",
            parent: person.id,
            level: level + 1,
            children: [] as {
              id: any;
              name: any;
              parent: any;
              children: any;
            }[],
            totalBonus: 0,
            branch: branch + 1,
          };
          user.children.push(downline);
          branch++;
        }
      }

      return user;
    }

    return defaultUser;
  } catch (error) {
    console.log(error);
    return defaultUser;
  }
};
