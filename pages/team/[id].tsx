import AddParticipant from "@/components/AddParticipant";
import RemoveParticipant from "@/components/RemoveParticipant";
import { useRouter } from "next/router";

export default function TeamPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr",padding:"20px" }}>
      <div className="mr-10 ">
        {" "}
        <RemoveParticipant />
      </div>
      <div>
        <AddParticipant />
      </div>
    </div>
  );
}
