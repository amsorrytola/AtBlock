import { Outlet, useLocation } from "react-router-dom";
import { CommandPalette } from "./CommandPalette";
import { SiteFooter, SiteHeader } from "./SiteChrome";

export function Layout() {
  const location = useLocation();

  return (
    <div className="site">
      <div className="atmosphere" aria-hidden>
        <div className="mesh" />
        <div className="grid" />
      </div>
      <SiteHeader />
      <CommandPalette />
      <main className="page entered" key={location.pathname}>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
