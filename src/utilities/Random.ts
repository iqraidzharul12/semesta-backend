import { randomBytes } from 'crypto';

export const randomUserName = (yearCode: string, regionCode: string)=>{
  // return yearCode+regionCode+Math.floor(100000 + Math.random() * 900000);
  return yearCode+Math.floor(10000 + Math.random() * 90000);
}

export const randomKey = () =>{
  // return (0|Math.random()*9e6).toString(36);
  return randomBytes(5).toString('hex').toUpperCase();
}
