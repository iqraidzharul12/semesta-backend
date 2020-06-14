
import 'dotenv/config';
import { getConnection } from 'typeorm';
import { User } from '../model/entities/User';

const validate = async (decoded: any, request: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
  try {
    let userRepository = getConnection().getRepository(User);

    const person: any = await userRepository.findOne({
      username: decoded.agent.username,
      password: decoded.agent.password,
    });
    
    if (person) {
      if (!person.isActive) return { isValid: false };
      return { isValid: true };
    }

    return { isValid: false };
  } catch (error) {
    console.log(error);
    return { isValid: false };
  }
};

const verifyOptions = {
  algorithms: [
    'HS256',
  ],
};

const options = {
  key: process.env.JWTSECRET,
  validate,
  verifyOptions,
};

export const STRATEGYNAME = 'jwt';
export const STRATEGYSCHEME = 'jwt';
export const STRATEGYOPTIONS = options;
