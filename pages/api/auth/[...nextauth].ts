import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Jwt from "jsonwebtoken";
import axios from "axios";
const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},

      async authorize(credentials: any, req: any): Promise<any> {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        //console.log("email", email, "password", password);
        //perform your login logic here
        //find out user from db
        // const hasuraEndPoint: any = process.env.HASURA_PROJECT_ENDPOINT;
        // const hasuraSecret: any = process.env.HASURA_ADMIN_SECRET;
        // const authsecret: any = process.env.NEXT_AUTH_SECRET;
        const { data: result }: any = await axios.post (
          process.env.hasuraEndPoint as string,
          {
            query: `
              query MyQuery {
                users {
                  name,
                  email,
                  password,
                  role,id
                  
                }
              }
          `,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-hasura-admin-secret": process.env.hasuraSecret,
            },
          }
        );
        const user = result.data.users.find(
          (user: any) => user.email === credentials.email
        );
        // console.log(existEmail);
        if (!user) {
          throw new Error("No user found");
        }
        //console.log(credentials.email, credentials.password);
        const validPassword = user.password == credentials.password;
        // console.log(validPassword);
        if (!validPassword) {
          throw new Error("Incorrect Password");
        }
        //if everything is fine
       console.log("user", user);
        return user;

      },
    }),
  ],
  
  callbacks: {
    // Add the required Hasura claims
    // https://hasura.io/docs/latest/graphql/core/auth/authentication/jwt/#the-spec

    // Add user ID to the session

    async jwt({ token, user }) {
     // console.log(process.env);
      console.log(user);
      return {
        ...token,...user,
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["manager","administrator","member",],
          "x-hasura-default-role": token.role,
          "x-hasura-role": token.role,
          "x-hasura-user-id": token.sub,
        },
      };
    },
    session: async ({ session, token }: any) => {
      // console.log("token", token);
      const encodedToken = await Jwt.sign(
        token,

        process.env.nextauthSecret as string,
        {
          algorithm: "HS256",
        }
      );
      //console.log(encodedToken);
      if (session?.user) {
        //console.log("user Exist");
        session.user.id = token.sub!;
        session.jwtToken = encodedToken;
      }
      // console.log("sesson", session);
      return session;
    },
  },

  pages: {
    signIn: "/",
  },
};
export default NextAuth(authOptions);
