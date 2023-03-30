import { useMutation } from "react-query";
import axios from "axios";
type CreateUserInput = {
  name: string;
  email: string;
  role: string;
};
type CreateUserResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
};
const HASURA_URL = "https://fast-panther-29.hasura.app/v1/graphql";
const HASURA_SECRET =
  "DGlZLPnlkhYujPZg6jZhXjF6dZM2OriJIVZiJvIxuE9tQ0vvlyaaQ5BhaSdkK1T8";

export const useCreateUser = () => {
  const createUser = async (variables: CreateUserInput) => {
    console.log("vairables", variables);
    const { email, name, role } = variables;
    console.log(email,name,role);
    const response = await axios.post(
      HASURA_URL,
      {
        operationName: "MyMutation",
        query: `mutation MyMutation($email: String = "", $name: String = "", $password: String = "") {
        insert_users(objects: {email: $email, name: $name, password: $password}) {
          returning {
            name
            id
            role
          }
        }
      }`,
      },
      
      {
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": HASURA_SECRET,
        },
      }
    );
    return response.data.data.insert_users_one
      .returning[0] as CreateUserResponse;
  };
  return useMutation<CreateUserResponse, Error, CreateUserInput>(createUser);
};