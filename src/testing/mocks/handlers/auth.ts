import Cookies from "js-cookie";
import { HttpResponse, http } from "msw";
import * as JWT from "jsonwebtoken";
import { db, persistDb } from "../db";
import {API_URL,REFRESH_TOKEN_SECRET,ACCESS_TOKEN_SECRET} from "../../config";

import {
  authenticate,
  hash,
  requireAuth,
  AUTH_COOKIE,
  networkDelay,
} from '../utils';

type RegisterBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  teamId?: string;
  teamName?: string;
};

type LoginBody = {
  email: string;
  password: string;
};

export const authHandlers = [
  http.post(`${API_URL}/v1/auth/register`, async ({ request }) => {
    await networkDelay();
    try {
      const userObject = (await request.json()) as RegisterBody;

      const existingUser = db.user.findFirst({
        where: {
          email: {
            equals: userObject.email,
          },
        },
      });

      if (existingUser) {
        return HttpResponse.json(
          { message: 'The user already exists' },
          { status: 400 },
        );
      }

      let teamId;
      let role;

      if (!userObject.teamId) {
        const team = db.team.create({
          name: userObject.teamName ?? `${userObject.firstName} Team`,
        });
        await persistDb('team');
        teamId = team.id;
        role = 'ADMIN';
      } else {
        const existingTeam = db.team.findFirst({
          where: {
            id: {
              equals: userObject.teamId,
            },
          },
        });

        if (!existingTeam) {
          return HttpResponse.json(
            {
              message: 'The team you are trying to join does not exist!',
            },
            { status: 400 },
          );
        }
        teamId = userObject.teamId;
        role = 'USER';
      }

      db.user.create({
        ...userObject,
        role,
        password: hash(userObject.password),
        teamId,
      });

      await persistDb('user');

      const result = authenticate({
        email: userObject.email,
        password: userObject.password,
      });

      // todo: remove once tests in Github Actions are fixed
      Cookies.set(AUTH_COOKIE, result.jwt, { path: '/' });

      return HttpResponse.json(result, {
        headers: {
          // with a real API servier, the token cookie should also be Secure and HttpOnly
          'Set-Cookie': `${AUTH_COOKIE}=${result.jwt}; Path=/;`,
        },
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),

  http.post(`${API_URL}/v1/auth/email/login`, async ({ request }) => {
    await networkDelay();

    try {
      console.log("IM HERE");
      const credentials = (await request.json()) as LoginBody;
      const result = authenticate(credentials);
      console.log("Authentication status",result);
      // todo: remove once tests in Github Actions are fixed
      Cookies.set(AUTH_COOKIE, result.jwt, { path: '/' });
      console.log("User Result",result);
      return HttpResponse.json(result, {
        headers: {
          // with a real API servier, the token cookie should also be Secure and HttpOnly
          'Set-Cookie': `${AUTH_COOKIE}=${result.jwt}; Path=/;`,
        },
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),

  http.post(`${API_URL}/v1/auth/logout`, async () => {
    await networkDelay();

    // todo: remove once tests in Github Actions are fixed
    Cookies.remove(AUTH_COOKIE);  

    return HttpResponse.json(
      { message: 'Logged out' },
      {
        headers: {
          'Set-Cookie': `${AUTH_COOKIE}=; Path=/;`,
        },
      },
    );
  }),

  http.post(`${API_URL}/v1/auth/refresh`, async ({ request }) => {
    try{
      const authHeader =  request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
      }
      const refreshToken = authHeader.split(' ')[1]
      if (refreshToken) {
          // Destructuring refreshToken from cookie
          // Verifying refresh token
          let newTokens = {};
          JWT.verify(refreshToken, REFRESH_TOKEN_SECRET,
              (err, decoded) => {
                console.log("Verification started",err,decoded);
                  if (err) {
                      // Wrong Refesh Token
                      return HttpResponse.json(
                        {
                          message: 'Unauthorized OR Token Expired',
                        },
                        { status: 401 },
                      );
                  }
                  else {
                    const ATExp = Math.floor(Date.now() / 1000) + (60 * 60);
                    const accessToken = JWT.sign({data:decoded.data,exp:ATExp}, ACCESS_TOKEN_SECRET,/* { expiresIn: "10m" }*/);
                    newTokens = {token:accessToken,refreshToken:refreshToken,tokenExpires:ATExp};
                    console.log("Returning",newTokens);
                  //  return  HttpResponse.json(newTokens, { status: 200 });
                  }
              })
              console.log("After Verify",newTokens);
            return  HttpResponse.json(newTokens, { status: 200 });

      } else {
        return HttpResponse.json({
            message: 'No Authorization Token , Please Login Again.',
          },{ status: 406 },
        );
      }
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }

    console.log("Returning1");
  })
,
  http.get(`${API_URL}/v1/auth/me`, async ({ request ,cookies }) => {
    console.log("Cookies are",cookies);

    await networkDelay();
    try {
      //{"id":30202,"email":"mak@mak.com","provider":"email","socialId":null,"firstName":"Mayank","lastName":"Kumar","role":{"id":2,"name":"User","__entity":"RoleEntity"},"status":{"id":2,"name":"Inactive","__entity":"StatusEntity"},"createdAt":"2025-04-23T14:28:55.765Z","updatedAt":"2025-04-23T14:28:55.765Z","deletedAt":null}
      const { user } = requireAuth(cookies);
      return HttpResponse.json({ data: user });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),
];
