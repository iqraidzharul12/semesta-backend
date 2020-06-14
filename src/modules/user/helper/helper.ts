import { User } from "../../../model/entities";
import { getConnection } from "typeorm";

export const getAllDownLines = async (user: User, level: number): Promise<{id: any, name: any, parent: any, children: any}> => {
  const defaultUser = {
    "id": "default",
    "name":  "default",
    "parent":  "default",
    "level":level,
    "children": [],
  }

  try {
    let userRepository = getConnection().getRepository(User);

    const person = await userRepository.findOne({
      where: { username: user.username },
      relations: ["upLine"]
    });

    if (person) {
      if (!person.isActive) return defaultUser;

      const user = {
        "id": person.id,
        "name": person.fullName,
        "parent": person.upLine? person.upLine.id : null,
        "level":level,
        "children": [] as {id: any, name: any, parent: any, children: any}[],
      }

      const directDownline = await userRepository.find({
        where: { upLine: person },
        order: {username: "ASC"},
        relations: ["upLine"]
      });

      if(directDownline.length){
        for (let i = 0; i< directDownline.length; i++) {
          const downline = await getAllDownLines(directDownline[i], level+1);
          if(downline.name != defaultUser.name && level<=10) {
            user.children.push(downline)
          }
        }
      }

      return user
    }

    return defaultUser;
  } catch (error) {
    console.log(error)
    return defaultUser;
  }
}

export const countDownline = (user: {id: any, name: any, parent: any, children: any}) =>{
  let count = 0
  if(user.children && user.children.length){
    count += user.children.length
    for (let i = 0; i< user.children.length; i++) {
      count += countDownline(user.children[i])
    }
  }
  return count
}