import { useEffect, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
  LayoutDashboard,
  UsersRound,
  FolderKanban,
  ListTodo,
  Files,
  ShieldCheck,
  Users,
  LogOut,
} from "lucide-react";
import { FloatingDock, type FloatingDockItem } from "@/components/ui/floating-dock";
import dockCss from "./console-floating-dock.css?inline";

type View = "overview" | "clients" | "projects" | "tasks" | "documents" | "team" | "security";
type ConsoleDockState = { view: View; admin: boolean };

const dockRoot = document.getElementById("vv-console-dock-root");

if (dockRoot && !document.getElementById("vv-console-floating-dock-styles")) {
  const sheet = document.createElement("style");
  sheet.id = "vv-console-floating-dock-styles";
  sheet.textContent = dockCss;
  document.head.appendChild(sheet);
}

const initial: ConsoleDockState = {
  view: "overview",
  admin: false,
};

function ConsoleDock() {
  const [state, setState] = useState<ConsoleDockState>(initial);

  useEffect(() => {
    const update = (event: Event) => {
      const detail = (event as CustomEvent<Partial<ConsoleDockState>>).detail ?? {};
      setState((previous) => ({
        view: detail.view ?? previous.view,
        admin: typeof detail.admin === "boolean" ? detail.admin : previous.admin,
      }));
    };
    document.addEventListener("vv:console-dock-state", update);
    // Hydrate from the vanilla Console's last render, even if it ran before
    // the React island mounted or before this effect subscribed.
    if(dockRoot?.dataset.view) {
      setState({
        view: dockRoot.dataset.view as View,
        admin: dockRoot.dataset.admin === "true",
      });
    }
    return () => {
      document.removeEventListener("vv:console-dock-state", update);
    };
  }, []);

  const navigate = (section: View) => {
    document.dispatchEvent(new CustomEvent("vv:console-navigate", { detail: { section } }));
  };
  const sections: { id: View; title: string; icon: ReactNode }[] = [
    { id: "overview", title: "Overview", icon: <LayoutDashboard /> },
    { id: "clients", title: "Clients", icon: <UsersRound /> },
    { id: "projects", title: "Projects", icon: <FolderKanban /> },
    { id: "tasks", title: "Tasks", icon: <ListTodo /> },
    { id: "documents", title: "Documents", icon: <Files /> },
    ...(state.admin ? [{ id: "team" as const, title: "Team", icon: <Users /> }] : []),
    { id: "security", title: "Security", icon: <ShieldCheck /> },
  ];

  const navigation: FloatingDockItem[] = sections.map(({ id, title, icon }) => ({
    key: id,
    title,
    icon,
    active: state.view === id,
    onClick: () => navigate(id),
  }));

  const actions: FloatingDockItem[] = [
    {
      key: "sign-out",
      title: "Sign out",
      icon: <LogOut />,
      danger: true,
      onClick: () => document.dispatchEvent(new Event("vv:console-sign-out")),
    },
  ];

  return (
    <FloatingDock
      items={navigation}
      utilities={actions}
      desktopClassName="vv-studio-dock-desktop"
      mobileClassName="vv-studio-dock-touch"
    />
  );
}

if (dockRoot) createRoot(dockRoot).render(<ConsoleDock />);
