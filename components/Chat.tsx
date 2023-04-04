import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";
import axiosInstance from "@/utils/hasuraSetup";
import axios from "axios";
import { format } from "date-fns";

type Message = {
  team_id: number;
  user_id: number;
  message: string;
  created_at: string;
  user: {
    name: string;
  };
};
const baseURL: any = process.env.hasuraEndPoint;
const hasurasecret: any = process.env.hasuraSecret;

const Chat = ({ teamId }: any) => {
  const { data: session }: any = useSession();
  const queryClient = useQueryClient();

  let token = session?.jwtToken;
  const team_id = teamId;

  const [message, setMessage] = useState("");

  //const [messages, setMessages] = useState<Message[]>([]);

  //query
  const { isLoading, data } = useQuery(
    ["MyQuery", teamId],
    async () => {
      const query = `
             query {
  messages(where: {team_id: {_eq: "${teamId}"}}) {
    message
    user_id
    team_id
    created_at
    user {
      name
      id
      role}
    
  }
}
          `;
      const response = await axiosInstance.post("", { query });
      return response.data.data;
    },
    {
      enabled: teamId ? true : false,
    }
  );

  const { mutate, isSuccess }: any = useMutation(
    (data: Message) => {
      return axios.post(
        baseURL,
        {
          query: `
          mutation AddMessage($message: String!, $user_id: Int!, $team_id: Int!) {
            insert_messages_one(object: { message: $message, user_id: $user_id, team_id: $team_id }) {
              id
              user_id
              message
              created_at
            }
          }
        `,
          variables: {
            message,
            user_id: session?.user.id,
            team_id: parseInt(team_id as string),
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": hasurasecret,
            authorization: `Bearer ${token}`,
          },
        }
      );
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries(["MyQuery", teamId]);
        setMessage("");
      },
    }
  );

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await mutate(message);
  };
  let messages = data?.messages;
  console.log(message);
  return (
    <div className="flex flex-col h-96 border border-cyan-500 m-8 rounded-md border-spacing-8   ">
      <div className="flex-1 flex flex-col overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-2xl font-medium text-gray-500">
              No messages yet
            </p>
          </div>
        ) : (
          messages?.map((message: any) =>
            message?.user?.id == session?.user.id ? (
              <div key={message.id} className=" ">
                <p className="text-gray-800 bg-cyan-300  p-2 rounded-lg shadow my-4 mx-4">
                  {message.message}
                </p>
                <div className="mb-2">
                  <span className="font-small font-thin text-xs   text-gray-900">
                    {message?.user?.name}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {format(new Date(message.created_at), " hh:mm:ss a")}
                  </span>
                </div>
              </div>
            ) : (
              <div key={message.id} className="">
                <p className="text-gray-800 bg-gray-300  p-2  rounded-lg shadow my-4 mx-4">
                  {message.message}
                </p>
                <div className="flex justify-start">
                  <span className="font-small font-thin text-xs   text-gray-900">
                    {message?.user?.name}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {format(new Date(message.created_at), " hh:mm:ss a")}
                  </span>
                </div>
              </div>
            )
          )
        )}
      </div>
      <form onSubmit={handleSend} className="flex bg-gray-200 p-2">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 rounded-lg p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
