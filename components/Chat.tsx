import React, { useState, useEffect } from "react";
import { useQuery, useMutation, UseMutationResult } from "react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axiosInstance from "@/utils/hasuraSetup";

type Message = {
  id: number;
  user_id: string;
  message: string;
  created_at: string;
  user: {
    name: string;
  };
};

const Chat = () => {
  const { data: session }: any = useSession();
  const router = useRouter();
  const { team_id } = router.query;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { isLoading, data } = useQuery<Message[]>(
    "messages",
    async () => {
      const response = await axiosInstance.post("", {
        query: `
          query GetMessages($team_id: Int!) {
            messages(where: { team_id: { _eq: $team_id } }) {
              id
              user_id
              message
              created_at
              user {
                name
              }
            }
          }
        `,
        variables: { team_id: parseInt(team_id as string) },
      });
      return response.data.data.messages;
    },
    { enabled: !!session }
  );

  const { mutate }: any = useMutation<void, unknown, void, unknown>(
    async () => {
      await axiosInstance.post("", {
        query: `
          mutation AddMessage($message: String!, $user_id: String!, $team_id: Int!) {
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
          user_id: session.user.id,
          team_id: parseInt(team_id as string),
        },
      });
    },
    {
      onSuccess: () => {
        setMessage("");
      },
    }
  );
  console.log(message);
  useEffect(() => {
    setMessages(data || []);
  }, [data]);

  const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(message);
  };

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
          messages.map((message) => (
            <div
              key={message.id}
              className="bg-white p-4 rounded-lg shadow my-4 mx-4"
            >
              <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-900">
                  {message.user.name}
                </span>
                <span className="text-gray-600 text-sm">
                  {new Date(message.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-800">{message.message}</p>
            </div>
          ))
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
