import AddParticipant from "@/components/AddParticipant";
import RemoveParticipant from "@/components/RemoveParticipant";
import { useRouter } from "next/router";

export default function TeamPage() {
  const router = useRouter();
 

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        padding: "20px",
      }}
    >
      <div className="ml-10 ">
        {" "}
        <AddParticipant />
      </div>
      <div className="mr-10 ">
        <RemoveParticipant />
      </div>
    </div>
  );
}
