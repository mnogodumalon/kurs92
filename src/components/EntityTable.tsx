import { Search, Plus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface EntityTableProps<T extends { record_id?: string; id?: string }> {
  title: string;
  subtitle?: string;
  entityClass: string;
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  onAdd: () => void;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
}

export function EntityTable<T extends { record_id?: string; id?: string }>({
  title,
  subtitle,
  entityClass,
  columns,
  rows,
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  searchPlaceholder = "Suchen...",
  searchKeys = [],
}: EntityTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = rows.filter((row) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return searchKeys.some((k) => {
      const val = row[k];
      return val != null && String(val).toLowerCase().includes(q);
    });
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = String((a as Record<string, unknown>)[sortKey] ?? "");
    const bVal = String((b as Record<string, unknown>)[sortKey] ?? "");
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleDelete = async (row: T) => {
    const id = row.record_id ?? row.id ?? "";
    setDeletingId(id);
    await onDelete(row);
    setDeletingId(null);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>
            {title}
          </h1>
          {subtitle && <p style={{ color: "var(--muted-foreground)", fontSize: "0.9375rem" }}>{subtitle}</p>}
        </div>
        <button className="btn-primary" onClick={onAdd} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.25rem", borderRadius: "0.625rem", fontSize: "0.9375rem", cursor: "pointer" }}>
          <Plus size={16} />
          Neu erstellen
        </button>
      </div>

      {/* Table card */}
      <div className="kpi-card" style={{ overflow: "hidden" }}>
        {/* Search bar */}
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <Search size={16} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: "0.9375rem",
              color: "var(--foreground)",
              fontFamily: "var(--font-sans)",
              width: "100%",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ color: "var(--muted-foreground)", background: "none", border: "none", cursor: "pointer", fontSize: "1rem" }}>×</button>
          )}
          <span className={entityClass} style={{ marginLeft: "auto", fontSize: "0.75rem", fontWeight: 600, padding: "0.25rem 0.625rem", borderRadius: 100, whiteSpace: "nowrap" }}>
            {sorted.length} {sorted.length === 1 ? "Eintrag" : "Einträge"}
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                    style={{
                      padding: "0.875rem 1.25rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--muted-foreground)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      cursor: col.sortable !== false ? "pointer" : "default",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                      {col.label}
                      {col.sortable !== false && sortKey === col.key && (
                        sortDir === "asc"
                          ? <ChevronUp size={12} />
                          : <ChevronDown size={12} />
                      )}
                    </span>
                  </th>
                ))}
                <th style={{ padding: "0.875rem 1.25rem", width: 100 }} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    {columns.map((col) => (
                      <td key={col.key} style={{ padding: "1rem 1.25rem" }}>
                        <div className="skeleton" style={{ height: 16, width: `${60 + Math.random() * 40}%` }} />
                      </td>
                    ))}
                    <td style={{ padding: "1rem 1.25rem" }} />
                  </tr>
                ))
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} style={{ padding: "3rem", textAlign: "center", color: "var(--muted-foreground)", fontSize: "0.9375rem" }}>
                    {search ? "Keine Einträge gefunden." : "Noch keine Einträge vorhanden."}
                  </td>
                </tr>
              ) : (
                sorted.map((row, idx) => {
                  const id = row.record_id ?? row.id ?? String(idx);
                  return (
                    <tr
                      key={id}
                      className="data-table-row"
                      style={{ borderBottom: idx < sorted.length - 1 ? "1px solid var(--border)" : "none" }}
                    >
                      {columns.map((col) => (
                        <td key={col.key} style={{ padding: "1rem 1.25rem", fontSize: "0.9375rem", color: "var(--foreground)", verticalAlign: "middle" }}>
                          {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "–")}
                        </td>
                      ))}
                      <td style={{ padding: "0.75rem 1.25rem", textAlign: "right", whiteSpace: "nowrap" }}>
                        <button
                          onClick={() => onEdit(row)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: "0.375rem", borderRadius: "0.375rem", transition: "var(--transition-smooth)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
                          title="Bearbeiten"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
                          disabled={deletingId === id}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: "0.375rem", borderRadius: "0.375rem", transition: "var(--transition-smooth)", marginLeft: "0.25rem" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.577 0.245 27.325)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
                          title="Löschen"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
