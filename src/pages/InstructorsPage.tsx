import { useState } from "react";
import { EntityTable, type Column } from "@/components/EntityTable";
import { FormDialog } from "@/components/FormDialog";
import { FormField, TextInput } from "@/components/FormField";

export interface Instructor {
  record_id?: string;
  name: string;
  email: string;
  phone: string;
  subject_area: string;
}

interface InstructorsPageProps {
  instructors: Instructor[];
  loading: boolean;
  onCreate: (data: Omit<Instructor, "record_id">) => Promise<void>;
  onUpdate: (id: string, data: Omit<Instructor, "record_id">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const empty: Omit<Instructor, "record_id"> = {
  name: "",
  email: "",
  phone: "",
  subject_area: "",
};

const columns: Column<Instructor>[] = [
  { key: "name", label: "Name", render: (r) => <span style={{ fontWeight: 600 }}>{r.name}</span> },
  { key: "email", label: "E-Mail", render: (r) => (
    <a href={`mailto:${r.email}`} style={{ color: "oklch(0.52 0.22 264)", textDecoration: "none", fontWeight: 500 }}>
      {r.email}
    </a>
  )},
  { key: "phone", label: "Telefon" },
  { key: "subject_area", label: "Fachgebiet", render: (r) => (
    <span className="badge-instructors" style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.25rem 0.625rem", borderRadius: 100 }}>
      {r.subject_area || "–"}
    </span>
  )},
];

export function InstructorsPage({ instructors, loading, onCreate, onUpdate, onDelete }: InstructorsPageProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Instructor | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setDialogOpen(true);
  };

  const openEdit = (row: Instructor) => {
    setEditing(row);
    setForm({ name: row.name, email: row.email, phone: row.phone, subject_area: row.subject_area });
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

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <>
      <EntityTable
        title="Dozenten"
        subtitle="Lehrkräfte und Fachexperten verwalten"
        entityClass="badge-instructors"
        columns={columns}
        rows={instructors}
        loading={loading}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={(row) => onDelete(row.record_id!)}
        searchPlaceholder="Dozent suchen..."
        searchKeys={["name", "email", "subject_area"]}
      />
      <FormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? "Dozent bearbeiten" : "Neuen Dozenten anlegen"}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <FormField label="Name" required>
          <TextInput value={form.name} onChange={set("name")} required placeholder="Vollständiger Name" />
        </FormField>
        <FormField label="E-Mail" required>
          <TextInput type="email" value={form.email} onChange={set("email")} required placeholder="name@beispiel.de" />
        </FormField>
        <FormField label="Telefon">
          <TextInput type="tel" value={form.phone} onChange={set("phone")} placeholder="+49 ..." />
        </FormField>
        <FormField label="Fachgebiet">
          <TextInput value={form.subject_area} onChange={set("subject_area")} placeholder="z.B. Mathematik, Informatik, ..." />
        </FormField>
      </FormDialog>
    </>
  );
}
