import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import TerminalLayout from "@/components/terminal-layout";
import MarketsContent from "@/components/markets-content";

export default async function Markets() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <TerminalLayout>
      <MarketsContent />
    </TerminalLayout>
  );
}
