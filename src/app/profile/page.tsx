import FloatingSidebar from "@/components/floating-sidebar";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import ProfileView from "@/components/profile-view";

export default async function Profile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden">
      <FloatingSidebar />
      {/* Main content with left padding for collapsed sidebar */}
      <main className="pl-0 md:pl-20 relative z-10">
        <ProfileView />
      </main>
    </div>
  );
}
