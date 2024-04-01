import { Accounts } from "@/components/user/accounts";
import { createClient } from "@/modules/utils/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <Accounts userId={user.id} />;
}
