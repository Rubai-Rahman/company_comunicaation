import AddParticipant from "@/components/AddParticipant";
import RemoveParticipant from "@/components/RemoveParticipant";
import { useRouter } from "next/router";

export default function TeamPage() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-3 bg-gray-400 h-screen pr-10   ">
      <div className="ml-10 mt-7 bg-slate-300 p-5 h-fit rounded-md shadow-lg shadow-slate-800     ">
        {" "}
        <AddParticipant />
      </div>
      <div className="ml-10 mt-7 bg-slate-300 p-5  h-fit rounded-md shadow-lg shadow-slate-800 ">
        <RemoveParticipant />
      </div>
    </div>
  );
}
