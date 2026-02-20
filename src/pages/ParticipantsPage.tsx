import { useState } from "react";
import { EntityTable, type Column } from "@/components/EntityTable";
import { FormDialog } from "@/components/FormDialog";
import { FormField, TextInput } from "@/components/FormField";
import { format, differenceInYears } from "date-fns";

export interface Participant {
  record_id?: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
}

interface ParticipantsPageProps {
  participants: Participant[];
  loading: boolean;
  onCreate: (data: Omit<Participant, "record_id">) => Promise<void>;
  onUpdate: (id: string, data: Omit<Participant, "record_id">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const empty: Omit<Participant, "record_id"> = {
  name: "",
  email: "",
  phone: "",
  birthdate: "",
};

const columns: Column<Participant>[] = [
  { key: "name", label: "Name", render: (r) => <span style={{ fontWeight: 600 }}>{r.name}</span> },
  { key: "email", label: "E-Mail", render: (r) => (
    <a href={`mailto:${r.email}`} style={{ color: "oklch(0.52 0.22 264)", textDecoration: "none", fontWeight: 500 }}>
      {r.email}
    </a>
  )},
  { key: "phone", label: "Telefon" },
  { key: "birthdate", label: "Geburtsdatum", render: (r) => {
    if (!r.birthdate) return "–";
    const d = new Date(r.birthdate);
    const age = differenceInYears(new Date(), d);
    return (
      <span>
        {format(d, "dd.MM.yyyy")}
        <span style={{ color: "var(--muted-foreground)", fontSize: "0.8125rem", marginLeft: "0.375rem" }}>({age} J.)</span>
      </span>
    );
  }},
];

export function ParticipantsPage({ participants, loading, onCreate, onUpdate, onDelete }: ParticipantsPageProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Participant | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setDialogOpen(true);
  };

  const openEdit = (row: Participant) => {
    setEditing(row);
    setForm({ name: row.name, email: row.email, phone: row.phone, birthdate: row.birthdate });
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
        title="Teilnehmer"
        subtitle="Alle registrierten Teilnehmer"
        entityClass="badge-participants"
        columns={columns}
        rows={participants}
        loading={loading}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={(row) => onDelete(row.record_id!)}
        searchPlaceholder="Teilnehmer suchen..."
        searchKeys={["name", "email", "phone"]}
      />
      <FormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? "Teilnehmer bearbeiten" : "Neuen Teilnehmer anlegen"}
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
        <FormField label="Geburtsdatum">
          <TextInput type="date" value={form.birthdate} onChange={set("birthdate")} />
        </FormField>
      </FormDialog>
    </>
  );
}
