import { BookOpen, Users, GraduationCap, DoorOpen, ClipboardList, LayoutDashboard } from "lucide-react";

export type ActiveView =
  | "dashboard"
  | "courses"
  | "instructors"
  | "participants"
  | "rooms"
  | "registrations";

interface AppSidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

const navItems: {
  id: ActiveView;
  label: string;
  icon: React.ElementType;
  entityClass: string;
}[] = [
  { id: "dashboard", label: "Übersicht", icon: LayoutDashboard, entityClass: "" },
  { id: "courses", label: "Kurse", icon: BookOpen, entityClass: "badge-courses" },
  { id: "instructors", label: "Dozenten", icon: GraduationCap, entityClass: "badge-instructors" },
  { id: "participants", label: "Teilnehmer", icon: Users, entityClass: "badge-participants" },
  { id: "rooms", label: "Räume", icon: DoorOpen, entityClass: "badge-rooms" },
  { id: "registrations", label: "Anmeldungen", icon: ClipboardList, entityClass: "badge-registrations" },
];

export function AppSidebar({ activeView, onNavigate }: AppSidebarProps) {
  return (
    <aside
      style={{
        width: 240,
        minHeight: "100vh",
        background: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        boxShadow: "2px 0 20px oklch(0.165 0.03 255 / 0.3)",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "1.5rem 1.25rem 1rem",
          borderBottom: "1px solid var(--sidebar-border)",
          marginBottom: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "0.5rem",
              background: "var(--gradient-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px oklch(0.52 0.22 264 / 0.4)",
            }}
          >
            <BookOpen size={16} style={{ color: "white" }} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "0.9375rem",
                color: "oklch(0.94 0.01 255)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              KursManager
            </div>
            <div style={{ fontSize: "0.6875rem", color: "oklch(0.52 0.02 255)", fontWeight: 400 }}>
              Kursverwaltung
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: "0 0.625rem", flex: 1 }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "oklch(0.4 0.02 255)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.5rem 0.25rem 0.375rem" }}>
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item${isActive ? " active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon
                size={16}
                style={{
                  color: isActive ? "oklch(0.78 0.16 264)" : "oklch(0.52 0.02 255)",
                  flexShrink: 0,
                }}
              />
              <span>{item.label}</span>
              {isActive && (
                <div
                  style={{
                    marginLeft: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "oklch(0.78 0.16 264)",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "0.875rem 1.25rem",
          borderTop: "1px solid var(--sidebar-border)",
          fontSize: "0.75rem",
          color: "oklch(0.4 0.02 255)",
        }}
      >
        v1.0.0 · Kursverwaltungssystem
      </div>
    </aside>
  );
}
