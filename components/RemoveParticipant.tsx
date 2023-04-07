import {  useMutation, useQueryClient } from "react-query";
import axiosInstance from "@/utils/hasuraSetup";
import { useRouter } from "next/router";
import { useTeamMembers } from "@/hooks/useTeamMembers";
;

type TeamMember = {
  id: number;
  name: string;
  user: any;
};

const TeamMembers: React.FC = () => {
  const router = useRouter();
  const { id }: any = router.query;
  let teamId = id;
  

  const queryClient = useQueryClient();

  const { isLoading, error, data: teamMembers } = useTeamMembers(teamId);

  const deleteMember = useMutation(
    async (memberId: number) => {
      const response = await axiosInstance.post("", {
        query: `
        mutation {
          delete_team_members(
            where: { id: { _eq: ${memberId} } }
          ) {
            affected_rows
          }
        }
      `,
      });

      return response.data;
    },
    {
      onSuccess: () => {
        alert("Team Participant Removed");
        queryClient.invalidateQueries(["MyQuery", teamId]);
      },
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-black font-bold text-2xl  ">Team Members:</h2>
      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {teamMembers?.team_members.map((member: TeamMember) => (
          <li key={member.id} style={{ marginBottom: "10px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <span>{member?.user?.name}</span>
              {member?.user?.role !== "administrator" && (
                <button
                  className=" bg-gray-600   hover:bg-[#FF0303]  text-white p-1 rounded-md ring-red-600  ring-2   "
                  onClick={() => {
                    deleteMember.mutate(member.id);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamMembers;
