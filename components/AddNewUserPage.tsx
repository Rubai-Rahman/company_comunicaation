import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useMutation } from "react-query";

type User = {
  name: string;
  email: string;
  role: string;
  password: string;
};
const baseURL: any = process.env.hasuraEndPoint;
const hasurasecret: any = process.env.hasuraSecret;

const CreateUserPage = () => {
  const { data: session }: any = useSession();
  let token = session?.jwtToken;
  
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    role: "member",
    password: "12345",
  });
  const {
    mutate,
    isLoading,
    isSuccess,
    data: userPostResponse,
  } = useMutation(
    (data: User) => {
      
      return axios.post(
        baseURL,
        {
          query: `
  mutation AddUser($user: users_insert_input!) {
    insert_users_one(object: $user) {
      id,role,email
    }
  }
`,
          variables: {
            user,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
           "//-admin-secret": hasurasecret,
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    {
      onSuccess: (data) => {
        setUser({
          name: "",
          email: "",
          role: "member",
          password: "12345",
        });
        alert("User Added Successfully");
      },
    }
  );
  console.log("postResponse", userPostResponse);
  const { data: users } = useUser();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const existEmail = users?.find((existUser: any) => {
      return existUser?.email == user.email;
    });
    if (existEmail) {
      alert("User Already Exist");
      return;
    } else {
      await mutate(user);
    }
  };
  return (
    <div className="max-w-screen mx-auto h-screen bg-slate-400  ">
      <h1 className="text-3xl font-bold mb-8 pt-4 text-center  ">
        Create User
      </h1>
      <form className="w-2/3 mx-auto p-10 rounded-md shadow-sm  bg-slate-300  " onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block font-bold mb-2">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
            className="border p-2 w-full"
          >
            <option value="administrator">administrator</option>
            <option value="manager">Manager</option>
            <option value="member">Member</option>
          </select>
        </div>
        <button
          type="submit"
          className=" ring-2 ring-gray-800 text-gray-700 hover:text-white    hover:bg-gray-700  font-bold py-2 px-4 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Creating User..." : "Create User"}
        </button>
      </form>
    </div>
  );
};
export default CreateUserPage;
