import { useSupabaseServer } from "@/modules/utils/supabase-server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RegisterForm } from "./RegisterForm";

export default async function Page() {
  const supabase = useSupabaseServer({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/accounts");
  }

  return <RegisterForm />;
}
