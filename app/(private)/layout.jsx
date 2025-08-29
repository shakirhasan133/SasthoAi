import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function PrivateLayout({ children }) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <>
      {children}
    </>
  );
}
