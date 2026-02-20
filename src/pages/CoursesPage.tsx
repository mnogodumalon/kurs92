import { useState } from "react";
import { EntityTable, type Column } from "@/components/EntityTable";
import { FormDialog } from "@/components/FormDialog";
import { FormField, TextInput, TextAreaInput } from "@/components/FormField";
import { format } from "date-fns";

export interface Course {
  record_id?: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  max_participants: number;
  price: number;
}

interface CoursesPageProps {
  courses: Course[];
  loading: boolean;
  onCreate: (data: Omit<Course, "record_id">) => Promise<void>;
  onUpdate: (id: string, data: Omit<Course, "record_id">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const empty: Omit<Course, "record_id"> = {
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  max_participants: 20,
  price: 0,
};

const columns: Column<Course>[] = [
  { key: "title", label: "Titel", render: (r) => (
    <span style={{ fontWeight: 600 }}>{r.title}</span>
  )},
  { key: "start_date", label: "Startdatum", render: (r) => r.start_date ? format(new Date(r.start_date), "dd.MM.yyyy") : "–" },
  { key: "end_date", label: "Enddatum", render: (r) => r.end_date ? format(new Date(r.end_date), "dd.MM.yyyy") : "–" },
  { key: "max_participants", label: "Max. Teilnehmer", render: (r) => (
    <span style={{ fontWeight: 600, color: "oklch(0.52 0.22 264)" }}>{r.max_participants}</span>
  )},
  { key: "price", label: "Preis", render: (r) => (
    <span style={{ fontWeight: 600 }}>
      {Number(r.price).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
    </span>
  )},
];

export function CoursesPage({ courses, loading, onCreate, onUpdate, onDelete }: CoursesPageProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setDialogOpen(true);
  };

  const openEdit = (row: Course) => {
    setEditing(row);
    setForm({
      title: row.title,
      description: row.description,
      start_date: row.start_date,
      end_date: row.end_date,
      max_participants: row.max_participants,
      price: row.price,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing?.record_id) {
        await onUpdate(editing.record_id, form);
      } else {
        await onCreate(form);
      }
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <>
      <EntityTable
        title="Kurse"
        subtitle="Alle Kurse verwalten"
        entityClass="badge-courses"
        columns={columns}
        rows={courses}
        loading={loading}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={(row) => onDelete(row.record_id!)}
        searchPlaceholder="Kurs suchen..."
        searchKeys={["title", "description"]}
      />
      <FormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? "Kurs bearbeiten" : "Neuen Kurs erstellen"}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <FormField label="Titel" required>
          <TextInput value={form.title} onChange={set("title")} required placeholder="Kursname" />
        </FormField>
        <FormField label="Beschreibung">
          <TextAreaInput value={form.description} onChange={set("description")} placeholder="Kursbeschreibung..." />
        </FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <FormField label="Startdatum" required>
            <TextInput type="date" value={form.start_date} onChange={set("start_date")} required />
          </FormField>
          <FormField label="Enddatum" required>
            <TextInput type="date" value={form.end_date} onChange={set("end_date")} required />
          </FormField>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <FormField label="Max. Teilnehmer" required>
            <TextInput type="number" value={String(form.max_participants)} onChange={(e) => setForm((f) => ({ ...f, max_participants: Number(e.target.value) }))} required min="1" />
          </FormField>
          <FormField label="Preis (€)" required>
            <TextInput type="number" value={String(form.price)} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} required min="0" step="0.01" placeholder="0.00" />
          </FormField>
        </div>
      </FormDialog>
    </>
  );
}
