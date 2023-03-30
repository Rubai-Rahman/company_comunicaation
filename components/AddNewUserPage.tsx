import { useMutation } from "react-query";

import { useState } from "react";
import { postMutation } from "@/utils/hasuraSetup";

function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isLoading, error } = useMutation(async () => {
    const mutation = `
      mutation ($name: String!, $email: String!,$role:String!,password:String!) {
         insert_users_one(objects: { name: $name, email: $email,role:$role,password:String! }) {
          returning {
            id
            name
           role
           email
          }
        }
      }
    `;
    const variables = { name, email, role,password };
    const data = await postMutation(mutation, variables);
    return data.insert_users.returning[0];
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    
    mutate();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="email">email</label>
        <input
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="role">role</label>
        <input
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <input
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
export default AddUser;
