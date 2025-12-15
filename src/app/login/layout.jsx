// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// export default async function LoginPage() {
//     const session = await getServerSession(authOptions);
//     if (session) {
//       redirect('/dashboard');
//     }
// }
const Layout = async ({ children }) => {
    return <>{ children }</>;
};

export default Layout;