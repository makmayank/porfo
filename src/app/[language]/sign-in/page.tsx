import type { Metadata } from "next";
import SignIn from "./page-content";
import { getServerTranslation } from "@/services/i18n";
// POST https://nestjs-boilerplate-test.herokuapp.com/api/v1/auth/email/login 
//signIn request params
//{"email":"mak@mak.com","password":"makmak"}

  //response
//{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOjIzMzAzLCJoYXNoIjoiNzk2MGJiOTIwMGUxOTgyYWMyNjgwOTViYzRjMjcwYjY0ZTI4ZGMzNTZkM2I5ZjVmMDhjZjRmMmM5Mjg2MTFkYyIsImlhdCI6MTc0NTQxODUzNywiZXhwIjoyMDYwNzc4NTM3fQ.3tvCZ9ETNHIIPit_8gfhpfLPIRc0J-2xJ7a26MNGEVQ","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzAyMDIsInJvbGUiOnsiaWQiOjIsIm5hbWUiOiJVc2VyIiwiX19lbnRpdHkiOiJSb2xlRW50aXR5In0sInNlc3Npb25JZCI6MjMzMDMsImlhdCI6MTc0NTQxODUzNywiZXhwIjoxNzQ1NDE5NDM3fQ.Ofx7hVQ2o1X770lPkINZ7PEeHjTEdjDyMezzviJbwgc","tokenExpires":1745419437916,"user":{"id":30202,"email":"mak@mak.com","provider":"email","socialId":null,"firstName":"Mayank","lastName":"Kumar","role":{"id":2,"name":"User","__entity":"RoleEntity"},"status":{"id":2,"name":"Inactive","__entity":"StatusEntity"},"createdAt":"2025-04-23T14:28:55.765Z","updatedAt":"2025-04-23T14:28:55.765Z","deletedAt":null}}


type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "sign-in");

  return {
    title: t("title"),
  };
}

export default function Page() {
  return <SignIn />;
}
