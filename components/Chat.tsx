import React, { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { AiOutlineSend } from "react-icons/ai";
import { CiMenuKebab } from "react-icons/ci";
import useMessageDelete from "@/hooks/useMessageDelete";
import useEditMessage from "@/hooks/useEditMessage";
import { createClient, SubscribeMessage } from "graphql-ws";
import axiosInstance from "@/utils/hasuraSetup";

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
const WEBSOCKET_ENDPOINT = baseURL.replace(/^http/, "ws");

const Chat = ({ teamId }: any) => {
  const { data: session }: any = useSession();
  let role = session?.user?.role;
  const userRole = "administrator";
  const isLinkDisabled = userRole === role;
  const queryClient = useQueryClient();

  const messageContainerRef = useRef<HTMLDivElement>(null);
  let token = session?.jwtToken;
  const team_id = teamId;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const deleteMessage = useMessageDelete();
  const [editingUser, setEditingUser]: any = useState(null);
  const [editingMessage, setEditingMessage]: any = useState(null);
  const [editedMessage, setEditedMessage]: any = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  //

  //subscription
  useEffect(() => {
    const headers = {
      "x-hasura-admin-secret": hasurasecret,
      Authorization: `Bearer ${token}`,
    };
    const client = createClient({
      url: WEBSOCKET_ENDPOINT,
      connectionParams: {
        headers,
      },
    });

    const subscriptionQuery: any = {
      query: `
   subscription MySubscription($_eq: Int = 10) {
 messages(where: {team_id: {_eq: ${team_id}}}, order_by: {created_at: asc}) {
    message
    id
    team_id
    user_id
    created_at
  }
}

`,
    };

    const onNext = (data: any) => {
      setMessages(data?.data?.messages);
      setIsLoading(false);
    };
    const onError = (error: any) => {
      console.error("Subscription error:", error);
      setIsLoading(false);
    };
    const onComplete = () => {
      console.log("Subscription completed");
    };
    const sink = { next: onNext, error: onError, complete: onComplete };
    const payload = subscriptionQuery;
    const result = client.subscribe(payload, sink);
  }, [team_id]);

  const { mutate }: any = useMutation(
    (data: Message) => {
      return axiosInstance.post(baseURL, {
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
      });
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries(["MyQuery", teamId]);
        setMessage("");
      },
    }
  );
  const { mutate: editMessage, isSuccess }: any = useEditMessage();
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedMessage(e.target.value);
  };

  let id = editingUser?.id;
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteMessage.mutate(id);
    }
    setEditingUser(null);
  };
  const handleEdit = () => {
    setEditingMessage(id);

    setEditingUser(null);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await editMessage({ editedMessage, editingMessage });
    if (isSuccess) {
      setEditingMessage(null);
    }
  };

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await mutate(message);
  };

  messages?.map((message: any) => {
    console.log(message?.user_id);
    message?.user?.id == session?.user.id
      ? console.log("working")
      : console.log("notWorking");
  });
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col border bg-slate-200  shadow-lg border-cyan-500  rounded-xl w-auto h-[450px] ">
      <div
        className="flex-1 flex flex-col overflow-y-auto mx-3"
        ref={messageContainerRef}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-2xl font-medium text-gray-500">
              No messages yet
            </p>
          </div>
        ) : (
          messages?.map((message: any) =>
            message?.user_id == session?.user.id ? (
              <div key={message.id} className=" self-end  ">
                <div className="flex align-middle mt-5">
                  <p className="text-gray-800 bg-cyan-300 p-2 rounded-lg shadow  mr-4">
                    {editingMessage == message.id ? (
                      <form onSubmit={handleEditSubmit}>
                        <input
                          type="text"
                          value={editedMessage}
                          onChange={handleEditChange}
                          className="w-full bg-transparent border-none focus:ring-0 focus:border-gray-400 outline-none"
                          autoFocus
                        />
                      </form>
                    ) : (
                      message?.message
                    )}
                  </p>

                  <button
                    className="text-gray-800 text-[11px] mt-2"
                    onClick={() => setEditingUser(message)}
                  >
                    {<CiMenuKebab />}
                  </button>
                </div>

                <div className="mb-2 flex justify-end ">
                  <span className="text-gray-600  text-[8px] text-end">
                    {format(new Date(message.created_at), " hh:mm:ss a")}
                  </span>
                </div>
              </div>
            ) : (
              <div key={message.id} className="self-start">
                <div className="flex align-middle mt-5  ">
                  {
                    <p className="text-[10px] mt-3     ">
                      {message?.user?.name}{" "}
                    </p>
                  }
                  <p className="text-gray-800 bg-gray-300 p-2 rounded-lg shadow  mr-4">
                    {message.message}
                  </p>
                  {isLinkDisabled && (
                    <button
                      className="text-gray-800 text-[11px] mt-2"
                      onClick={() => setEditingUser(message)}
                    >
                      {<CiMenuKebab />}
                    </button>
                  )}
                </div>

                <div className="flex justify-start mb-2">
                  <span className="text-gray-600 text-[8px] font-thin">
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
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 rounded-lg p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 rounded-lg bg-gray-800 text-white  rotate-180 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {<AiOutlineSend />}
        </button>
      </form>
      {editingUser && (
        <>
          <div className="fixed inset-0  bg-black opacity-50 z-50"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-8  rounded-lg shadow-lg">
              <button
                type="button"
                className="ml-2 px-4 py-2 bg-gray-300 text-gray-600 rounded-md hover:bg-red-700 hover:text-white"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                type="button"
                className="ml-2 px-4 py-2 bg-gray-300 text-gray-600 rounded-md hover:bg-blue-400  hover:text-white"
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                type="button"
                className="ml-2 px-4 py-2 bg-gray-300 text-gray-600 rounded-md hover:bg-gray-400"
                onClick={() => {
                  setEditingUser(null);
                  setEditingMessage(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
