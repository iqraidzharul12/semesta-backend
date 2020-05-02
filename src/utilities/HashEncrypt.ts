
import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import * as Crypto from 'crypto-js';
import { User } from '../model/entities';

export const sha256 = (message: string): string => {
  return Crypto.SHA256(message).toString();
};

export const uid = (): string => {
  return sha256((new Date()).valueOf().toString()).toString();
};

export const generateToken = (agent: object, exp: any = null): string => {
  // console.log(exp);
  if (!exp) exp = Math.floor(new Date().getTime()/1000) + 1*24*60*60;
  // console.log(exp);
  const secret: any = process.env.JWTSECRET;
  return jwt.sign({
    id: uid,
    agent,
    exp,
  }, secret);
};

export const getUserFromToken = (token: string): User | null =>{
  const secret: any = process.env.JWTSECRET;
  try{
    const decoded = jwt.verify(token, secret);
    const jsonDecoded = JSON.parse(JSON.stringify(decoded))
    return jsonDecoded.agent;
  }
  catch(e){
    return null;
  }
}