import Image from "next/image";
import "../../public/assets/css/themify-icons.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/logout`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      const contentType = res.headers.get("content-type");

      let result = {};
      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
      } else {
        const text = await res.text();
        console.warn("Received non-JSON response:", text);
        throw new Error("Unexpected response from server.");
      }

      if (res.ok && result.success) {
        Cookies.remove("accessToken");
        Cookies.remove("user");
        Cookies.remove("email");

        router.push("/login");
      } else {
        alert(result.message || "Logout failed, please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error.response || error);
      alert("Logout failed. Check console for details.");
    }
  };

  return (
    <>
      <nav>
        <div className="app-logo">
          <Link className="logo d-inline-block" href="/dashboard">
            <Image
              alt="#"
              src="/assets/images/ekire-logo.png"
              width={140}
              height={37}
            />
          </Link>
          <span className="bg-light-primary toggle-semi-nav">
            <i className="ti-angle-double-right f-s-20" />
          </span>
        </div>
        <div className="app-nav" id="app-simple-bar">
          <ul className="main-nav p-0 mt-2">
            <li className="menu-title">
              <span>Management</span>
            </li>
            <li>
              <a
                aria-expanded="false"
                data-bs-toggle="collapse"
                href="#dashboard"
              >
                <i className="iconoir-home-alt" />
                dashboard
              </a>
              <ul className="collapse" id="dashboard">
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                {/* <li><Link href="/design">Design your own dashbaord</Link></li> */}
              </ul>
            </li>
            <li className="no-sub">
              <Link href="/project">
                <i className="iconoir-view-grid" /> Projects
              </Link>
            </li>

            <li className="menu-title">
              <span>Infrastructure</span>
            </li>
            <li>
              <a aria-expanded="false" data-bs-toggle="collapse" href="#server">
                <i className="iconoir-apple-shortcuts" />
                Servers
              </a>
              <ul className="collapse" id="server">
                <li>
                  <Link href="/server/create">Create New Server</Link>
                </li>
                <li>
                  <Link href="/server">Servers</Link>
                </li>
              </ul>
            </li>
            {/* <li className="no-sub">
                                <Link href="/server">
                                <i className="iconoir-apple-shortcuts" /> Servers
                                </Link>
                            </li> */}
            {/* <li className="no-sub">
              <Link href="/sshKeys">
                <i className="iconoir-keyframes-minus" /> SSH Keys
              </Link>
            </li> */}

            <li className="menu-title">
              <span>Billing & Finance</span>
            </li>
            <li>
              <a
                aria-expanded="false"
                data-bs-toggle="collapse"
                href="#finance"
              >
                <i className="iconoir-wallet" />
                Finance
              </a>
              <ul className="collapse" id="finance">
                <li>
                  <Link href="/finance">Top Up</Link>
                </li>
                <li>
                  <Link href="/finance/transactions">Transactions</Link>
                </li>
              </ul>
            </li>
            {/* <li className="no-sub">
                                <Link href="/finance">
                                    <i className="iconoir-wallet" /> Finance
                                </Link>
                            </li> */}
            {/* <li className="no-sub">
                                <Link href="/billing">
                                    <i className="iconoir-wallet" /> Billing
                                </Link>
                            </li> */}

            <li className="menu-title">
              <span>Support</span>
            </li>
            {/* <li className="no-sub">
                                <Link href="/support">
                                    <i className="ph ph-chat-centered-text" /> Support
                                </Link>
                            </li> */}
            <li>
              <a
                aria-expanded="false"
                data-bs-toggle="collapse"
                href="#support"
              >
                <i className="iconoir-apple-shortcuts" />
                Support
              </a>
              <ul className="collapse" id="support">
                <li>
                  <Link href="/support">Support Ticket</Link>
                </li>
                <li>
                  <Link href="/support/abuse">Abuse Ticket</Link>
                </li>
                <li>
                  <Link href="/support/suggestion">Suggestion</Link>
                </li>
              </ul>
            </li>
            <li className="no-sub">
              <Link href="/affiliate">
                <i className="iconoir-help-square" /> Affiliate
              </Link>
            </li>
            {/* <li className="no-sub">
                                <Link href="/feature">
                                    <i className="ph ph-chat-centered-text" /> Feature
                                </Link>
                            </li> */}
            {/* <li className="no-sub">
                                <Link href="/chat">
                                    <i className="iconoir-multi-bubble" /> Chat Now
                                </Link>
                            </li> */}
            <li className="no-sub">
              <Link href="/help">
                <i className="iconoir-help-square" /> Help
              </Link>
            </li>

            <li className="menu-title">
              <span>Account Management</span>
            </li>
            <li className="no-sub">
              <Link href="/account">
                <i className="iconoir-user" /> Accounts
              </Link>
            </li>
            <li className="no-sub">
              <Link href="#" onClick={handleLogout}>
                <i className="iconoir-log-out me-2" /> Logout
              </Link>
            </li>
            {/* <li className="no-sub">
                                <Link href="/login">
                                    <i className="iconoir-user" /> LogIn
                                </Link>
                            </li>
                            <li className="no-sub">
                                <Link href="/signup">
                                    <i className="iconoir-user" /> Sign Up
                                </Link>
                            </li> */}
          </ul>
        </div>
        <div className="menu-navs">
          <span className="menu-previous">
            <i className="ti ti-chevron-left" />
          </span>
          <span className="menu-next">
            <i className="ti ti-chevron-right" />
          </span>
        </div>
      </nav>
    </>
  );
}
