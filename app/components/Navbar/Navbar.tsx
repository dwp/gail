"use server";

import { headers } from "next/headers";
import AdminViewNavigation from "../Packages/AdminViewNavigation/AdminViewNavigation";
import Link from "../Packages/Link/Link";
import styles from "./Navbar.module.css";
import NavbarClient from "./NavbarClient";
import NavbarHydrator from "./NavbarHydrator";
import NavbarAccordionClient from "./NavbarAccordionClient";

const NavbarRoutes = [
  {
    label: "Using AI responsibly",
    route: "/ai-notice",
  },
  {
    label: "Accessibility",
    route: "/accessibility",
  },
  {
    label: "Claimant complaints",
    route: "/chat/history",
  },
];

export default async function Navbar() {
  const headersList = await headers();
  const pathname = headersList.get("x-current-pathname") ?? "";
  const isLandingPage = pathname === "/" || pathname === "/agreement";

  return (
    <div
      id="navbar-container"
      className={styles.navbarContainer}
      style={{ display: isLandingPage ? "none" : "" }}
    >
      <NavbarHydrator />
      <div className={styles.menuWrapper}>
        <NavbarAccordionClient menuId="navbar-menu" />

        <div
          id="navbar-menu"
          className={styles.navbarMenu}
          role="menu"
          aria-hidden="true"
          hidden
        >
          <nav className={styles.menuListNavbar}>
            {NavbarRoutes.map((r, i) => (
              <Link
                key={r.route + i}
                href={r.route}
                className={styles.navbarLink}
                data-testid={`navbar-link-${i}`}
              >
                {r.label}
              </Link>
            ))}

            <div
              id="admin-view-wrapper"
              style={{ display: isLandingPage ? "none" : "inline" }}
            >
              <AdminViewNavigation className={styles.navbarLink} />
            </div>
          </nav>
        </div>
      </div>

      <NavbarClient />
    </div>
  );
}
