import type { Metadata } from "next";
import SignUp from "./page-content";
import { getServerTranslation } from "@/services/i18n";
import { redirect } from "next/navigation";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";
//signup request  data
//POST https://nestjs-boilerplate-test.herokuapp.com/api/v1/auth/email/register
// {"firstName":"Mayank","lastName":"Kumar","email":"mak@mak.com","password":"makmak","policy":[{"id":"policy","name":"I have read and accept "}]}

// logout  POST https://nestjs-boilerplate-test.herokuapp.com/api/v1/auth/logout
type Props = {
  params: Promise<{ language: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "sign-up");

  return {
    title: t("title"),
  };
}

export default function SignUpPage() {
  if (!IS_SIGN_UP_ENABLED) {
    return redirect("/");
  }

  return <SignUp />;
}
