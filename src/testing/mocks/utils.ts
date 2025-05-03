import Cookies from "js-cookie";
import { delay } from "msw";
import * as JWT from "jsonwebtoken";
import { db } from "./db";
import {REFRESH_TOKEN_SECRET,ACCESS_TOKEN_SECRET} from "../config";

export const encode = (obj: any) => {
  const btoa =
    typeof window === 'undefined'
      ? (str: string) => Buffer.from(str, 'binary').toString('base64')
      : window.btoa;
  return btoa(JSON.stringify(obj));
};

export const decode = (str: string) => {
  const atob =
    typeof window === 'undefined'
      ? (str: string) => Buffer.from(str, 'base64').toString('binary')
      : window.atob;
  return JSON.parse(atob(str));
};

export const hash = (str: string) => {
  let hash = 5381,
    i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return String(hash >>> 0);
};

export const networkDelay = () => {
  const delayTime = process.env.TEST
    ? 200
    : Math.floor(Math.random() * 700) + 300;
  return delay(delayTime);
};

const omit = <T extends object>(obj: T, keys: string[]): T => {
  const result = {} as T;
  for (const key in obj) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }

  return result;
};

export const sanitizeUser = <O extends object>(user: O) =>
  omit<O>(user, ['password', 'iat']);

export function authenticate({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = db.user.findFirst({
    where: {
      email: {
        equals: email,
      },
    },
  });
//{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOjIzMzAzLCJoYXNoIjoiNzk2MGJiOTIwMGUxOTgyYWMyNjgwOTViYzRjMjcwYjY0ZTI4ZGMzNTZkM2I5ZjVmMDhjZjRmMmM5Mjg2MTFkYyIsImlhdCI6MTc0NTQxODUzNywiZXhwIjoyMDYwNzc4NTM3fQ.3tvCZ9ETNHIIPit_8gfhpfLPIRc0J-2xJ7a26MNGEVQ","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzAyMDIsInJvbGUiOnsiaWQiOjIsIm5hbWUiOiJVc2VyIiwiX19lbnRpdHkiOiJSb2xlRW50aXR5In0sInNlc3Npb25JZCI6MjMzMDMsImlhdCI6MTc0NTQxODUzNywiZXhwIjoxNzQ1NDE5NDM3fQ.Ofx7hVQ2o1X770lPkINZ7PEeHjTEdjDyMezzviJbwgc","tokenExpires":1745419437916,"user":{"id":30202,"email":"mak@mak.com","provider":"email","socialId":null,"firstName":"Mayank","lastName":"Kumar","role":{"id":2,"name":"User","__entity":"RoleEntity"},"status":{"id":2,"name":"Inactive","__entity":"StatusEntity"},"createdAt":"2025-04-23T14:28:55.765Z","updatedAt":"2025-04-23T14:28:55.765Z","deletedAt":null}}

  if (user?.password === hash(password)) {
    const sanitizedUser = sanitizeUser(user);
    if(user?.role == "ADMIN"){
      sanitizedUser.role = {id:1,name:"ADMIN"}
    }
    else{
      sanitizedUser.role = {id:2,name:"USER"}
    }
    sanitizedUser.status={"id":2,"name":"Inactive"};
    const encodedToken = encode(sanitizedUser);
    const ATExp = Math.floor(Date.now() / 1000) + (60 * 60);
    const RTExp = Math.floor(Date.now() / 1000) + (60 * 60*10);
    //creating a access token
    const accessToken = JWT.sign({data:email,exp:ATExp}, ACCESS_TOKEN_SECRET,/* { expiresIn: "10m" }*/);
    const refreshToken = JWT.sign({data:email,exp:ATExp}, REFRESH_TOKEN_SECRET/*, { expiresIn: '1d' }*/);
    return { user: sanitizedUser, token: accessToken ,jwt:encodedToken,refreshToken:refreshToken ,tokenExpires:ATExp};
  }

  const error = new Error('Invalid username or password');
  throw error;
}

export const AUTH_COOKIE = `auth-token-data`;

export function requireAuth(cookies: Record<string, string>) {
  try {
    const encodedToken = cookies[AUTH_COOKIE] || Cookies.get(AUTH_COOKIE);
    if (!encodedToken) {
      return { error: 'Unauthorized', user: null };
    }
    const decodedToken = decode(encodedToken) as { id: string };

    const user = db.user.findFirst({
      where: {
        id: {
          equals: decodedToken.id,
        },
      },
    });

    if (!user) {
      return { error: 'Unauthorized', user: null };
    }
      //{"id":30202,"email":"mak@mak.com","provider":"email","socialId":null,"firstName":"Mayank","lastName":"Kumar","role":{"id":2,"name":"User","__entity":"RoleEntity"},"status":{"id":2,"name":"Inactive","__entity":"StatusEntity"},"createdAt":"2025-04-23T14:28:55.765Z","updatedAt":"2025-04-23T14:28:55.765Z","deletedAt":null}
    return { user: sanitizeUser(user) };
  } catch (err: any) {
    return { error: 'Unauthorized', user: null };
  }
}

export function requireAdmin(user: any) {
  if (user.role !== 'ADMIN') {
    throw Error('Unauthorized');
  }
}
