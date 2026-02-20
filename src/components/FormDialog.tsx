import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  children: React.ReactNode;
  submitLabel?: string;
}

export function FormDialog({ open, onClose, title, onSubmit, loading = false, children, submitLabel = "Speichern" }: FormDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "oklch(0.165 0.03 255 / 0.5)",
        backdropFilter: "blur(6px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 0.15s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
      <div
        style={{
          background: "var(--card)",
          borderRadius: "var(--radius)",
          boxShadow: "var(--shadow-elevated)",
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          overflow: "auto",
          animation: "slideUp 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            background: "var(--card)",
            zIndex: 1,
          }}
        >
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--muted-foreground)",
              padding: "0.375rem",
              borderRadius: "0.375rem",
              display: "flex",
              alignItems: "center",
              transition: "var(--transition-smooth)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit}>
          <div style={{ padding: "1.5rem" }}>
            {children}
          </div>
          <div
            style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid var(--border)",
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
              position: "sticky",
              bottom: 0,
              background: "var(--card)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.625rem 1.25rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--border)",
                background: "transparent",
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "var(--foreground)",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                transition: "var(--transition-smooth)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                padding: "0.625rem 1.5rem",
                borderRadius: "0.5rem",
                fontSize: "0.9375rem",
                fontFamily: "var(--font-sans)",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Speichern..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
