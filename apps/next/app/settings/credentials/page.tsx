import { CredentialsForm } from "@/components/user/credentials-form";
import { useSupabaseServer } from "@/modules/utils/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = useSupabaseServer({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  return <CredentialsForm userEmail={user.email} />;
}