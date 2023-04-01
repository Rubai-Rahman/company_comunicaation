import AddParticipant from "@/components/AddParticipant";
import { useRouter } from "next/router";

export default function TeamPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      
      <AddParticipant />
    </div>
  );
}
