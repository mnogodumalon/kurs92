import { BookOpen, Users, GraduationCap, DoorOpen, ClipboardList, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import type { ActiveView } from "./AppSidebar";

interface KpiData {
  coursesCount: number;
  instructorsCount: number;
  participantsCount: number;
  roomsCount: number;
  registrationsCount: number;
  paidCount: number;
  unpaidCount: number;
}

interface OverviewDashboardProps {
  data: KpiData;
  onNavigate: (view: ActiveView) => void;
}

const kpiCards = [
  {
    id: "courses" as ActiveView,
    label: "Kurse",
    icon: BookOpen,
    key: "coursesCount" as keyof KpiData,
    colorClass: "badge-courses",
    iconColor: "oklch(0.52 0.22 264)",
    bgColor: "oklch(0.52 0.22 264 / 0.06)",
    description: "Aktive Kurse",
  },
  {
    id: "instructors" as ActiveView,
    label: "Dozenten",
    icon: GraduationCap,
    key: "instructorsCount" as keyof KpiData,
    colorClass: "badge-instructors",
    iconColor: "oklch(0.52 0.17 160)",
    bgColor: "oklch(0.62 0.17 160 / 0.06)",
    description: "Verfügbare Dozenten",
  },
  {
    id: "participants" as ActiveView,
    label: "Teilnehmer",
    icon: Users,
    key: "participantsCount" as keyof KpiData,
    colorClass: "badge-participants",
    iconColor: "oklch(0.58 0.18 65)",
    bgColor: "oklch(0.72 0.18 65 / 0.08)",
    description: "Registrierte Personen",
  },
  {
    id: "rooms" as ActiveView,
    label: "Räume",
    icon: DoorOpen,
    key: "roomsCount" as keyof KpiData,
    colorClass: "badge-rooms",
    iconColor: "oklch(0.45 0.2 290)",
    bgColor: "oklch(0.55 0.2 290 / 0.06)",
    description: "Verfügbare Räume",
  },
  {
    id: "registrations" as ActiveView,
    label: "Anmeldungen",
    icon: ClipboardList,
    key: "registrationsCount" as keyof KpiData,
    colorClass: "badge-registrations",
    iconColor: "oklch(0.48 0.2 15)",
    bgColor: "oklch(0.58 0.2 15 / 0.06)",
    description: "Gesamt",
  },
];

export function OverviewDashboard({ data, onNavigate }: OverviewDashboardProps) {
  const paidPercent =
    data.registrationsCount > 0
      ? Math.round((data.paidCount / data.registrationsCount) * 100)
      : 0;

  return (
    <div style={{ padding: "2rem", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "var(--foreground)",
            letterSpacing: "-0.03em",
            marginBottom: "0.25rem",
          }}
        >
          Übersicht
        </h1>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.9375rem" }}>
          Alle wichtigen Zahlen auf einen Blick
        </p>
      </div>

      {/* KPI Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const value = data[card.key];
          return (
            <button
              key={card.id}
              className="kpi-card"
              onClick={() => onNavigate(card.id)}
              style={{
                padding: "1.25rem",
                textAlign: "left",
                cursor: "pointer",
                display: "block",
                width: "100%",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "0.625rem",
                    background: card.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={20} style={{ color: card.iconColor }} />
                </div>
                <span className={`${card.colorClass}`} style={{ fontSize: "0.6875rem", fontWeight: 600, padding: "0.25rem 0.5rem", borderRadius: "100px", letterSpacing: "0.03em" }}>
                  {card.label}
                </span>
              </div>
              <div
                style={{
                  fontSize: "2.25rem",
                  fontWeight: 800,
                  color: "var(--foreground)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  marginBottom: "0.25rem",
                }}
              >
                {value}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)", fontWeight: 400 }}>
                {card.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Secondary stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {/* Payment status */}
        <div className="kpi-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <TrendingUp size={16} style={{ color: "oklch(0.52 0.22 264)" }} />
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>
              Zahlungsstatus
            </span>
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.25rem" }}>
                <CheckCircle2 size={14} style={{ color: "oklch(0.52 0.17 160)" }} />
                <span style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>Bezahlt</span>
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.03em" }}>
                {data.paidCount}
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.25rem" }}>
                <Clock size={14} style={{ color: "oklch(0.58 0.2 15)" }} />
                <span style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>Ausstehend</span>
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.03em" }}>
                {data.unpaidCount}
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>Zahlungsquote</span>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--foreground)" }}>{paidPercent}%</span>
            </div>
            <div style={{ height: 6, background: "oklch(0.58 0.2 15 / 0.15)", borderRadius: 999, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${paidPercent}%`,
                  background: "oklch(0.52 0.17 160)",
                  borderRadius: 999,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="kpi-card" style={{ padding: "1.5rem" }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "1rem" }}>
            Schnellzugriff
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { label: "Neuen Kurs anlegen", view: "courses" as ActiveView, colorClass: "badge-courses" },
              { label: "Dozent hinzufügen", view: "instructors" as ActiveView, colorClass: "badge-instructors" },
              { label: "Teilnehmer anmelden", view: "registrations" as ActiveView, colorClass: "badge-registrations" },
            ].map((action) => (
              <button
                key={action.view}
                onClick={() => onNavigate(action.view)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "0.5rem",
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "var(--foreground)",
                  cursor: "pointer",
                  transition: "var(--transition-smooth)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.52 0.22 264 / 0.05)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.52 0.22 264 / 0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--background)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                }}
              >
                {action.label}
                <span style={{ fontSize: "1rem", color: "var(--muted-foreground)" }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
