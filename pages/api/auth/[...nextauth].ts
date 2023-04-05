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

        const { data: result }: any = await axios.post(
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
          }
        );
        const user = result.data.users.find(
          (user: any) => user.email === credentials.email
        );
    
        if (!user) {
          throw new Error("No user found");
        }
        
        const validPassword = user.password == credentials.password;
      
        if (!validPassword) {
          throw new Error("Incorrect Password");
        }
        //if everything is fine
      
        return {
          email: user.email,
          id: user.id,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
    
    
      return {
        ...token,
        ...user,
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["manager", "administrator", "member"],
          "x-hasura-default-role": token.role,
          "x-hasura-role": token.role,
          "x-hasura-user-id": token.sub,
        },
      };
    },
    session: async ({ session, token }: any) => {
     
      const encodedToken = await Jwt.sign(
        token,

        process.env.nextauthSecret as string,
        {
          algorithm: "HS256",
        }
      );
      
      session.user.id = token.sub!;
      session.user.role = token.role!;
      session.jwtToken = encodedToken;

      return session;
    },
  },

  pages: {
    signIn: "/",
  },
};
export default NextAuth(authOptions);
