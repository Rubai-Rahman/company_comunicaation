import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosInstance from "@/utils/hasuraSetup";
import { useRouter } from "next/router";

type TeamMember = {
  id: number;
  name: string;
};

const TeamMembers: React.FC = () => {
  const router = useRouter();
  const { id }: any = router.query;
  let teamId = id;
  const queryClient = useQueryClient();

  
  const { isLoading, error, data } = useQuery(
    ["MyQuery", teamId],
    async () => {
      const query = `
       query MyQuery {
  team_members(where: {team_id:  {_eq: "${teamId}"}}) {
    id
    name
    team_id
    user {
      name
    }
  }
}
`;
      const response = await axiosInstance.post("", { query });

      return response.data.data;
    },
    {
      enabled: teamId ? true : false, // enable the query if teamId exists
    }
  );

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
        queryClient.invalidateQueries(["MyQuery", teamId]);
      },
    }
  );
console.log("data",data);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (data?.team_members.length <= 0) {
    return <h2>This Group Does Not Have any Participant </h2>;
  }

  return (
    <div>
      <h2>Team Members:</h2>
      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {data?.team_members.map((member: TeamMember) => (
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
              <span>{member.name}</span>
              <button
                style={{
                  background: "#6495ED",
                  color: "white",
                  border: "none",
                  borderRadius: "9999px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  boxShadow: "0px 0px 0px 3px white",
                  transition: "box-shadow 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0px 0px 0px 5px #0066CC";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0px 0px 0px 3px #0066CC";
                }}
                onClick={() => {
                  deleteMember.mutate(member.id);
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamMembers;
