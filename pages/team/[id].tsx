import AddParticipant from "@/components/AddParticipant";
import RemoveParticipant from "@/components/RemoveParticipant";
import { useRouter } from "next/router";

export default function TeamPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="grid align-middle   ">
      <AddParticipant />
      <RemoveParticipant />
    </div>
  );
}
