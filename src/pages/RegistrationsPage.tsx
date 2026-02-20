import { useState } from "react";
import { EntityTable, type Column } from "@/components/EntityTable";
import { FormDialog } from "@/components/FormDialog";
import { FormField, TextInput, SelectInput, CheckboxInput } from "@/components/FormField";
import { format } from "date-fns";
import type { Course } from "./CoursesPage";
import type { Participant } from "./ParticipantsPage";

export interface Registration {
  record_id?: string;
  participant_id: string;
  course_id: string;
  registration_date: string;
  paid: boolean;
  // Denormalized for display
  participant_name?: string;
  course_title?: string;
}

interface RegistrationsPageProps {
  registrations: Registration[];
  courses: Course[];
  participants: Participant[];
  loading: boolean;
  onCreate: (data: Omit<Registration, "record_id" | "participant_name" | "course_title">) => Promise<void>;
  onUpdate: (id: string, data: Omit<Registration, "record_id" | "participant_name" | "course_title">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const emptyForm = {
  participant_id: "",
  course_id: "",
  registration_date: new Date().toISOString().split("T")[0],
  paid: false,
};

export function RegistrationsPage({
  registrations,
  courses,
  participants,
  loading,
  onCreate,
  onUpdate,
  onDelete,
}: RegistrationsPageProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Registration | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const columns: Column<Registration>[] = [
    {
      key: "participant_name",
      label: "Teilnehmer",
      render: (r) => {
        const p = participants.find((p) => p.record_id === r.participant_id);
        return <span style={{ fontWeight: 600 }}>{p?.name ?? r.participant_name ?? r.participant_id}</span>;
      },
    },
    {
      key: "course_title",
      label: "Kurs",
      render: (r) => {
        const c = courses.find((c) => c.record_id === r.course_id);
        const title = c?.title ?? r.course_title ?? r.course_id;
        return (
          <span className="badge-courses" style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.25rem 0.625rem", borderRadius: 100 }}>
            {title}
          </span>
        );
      },
    },
    {
      key: "registration_date",
      label: "Anmeldedatum",
      render: (r) => r.registration_date ? format(new Date(r.registration_date), "dd.MM.yyyy") : "–",
    },
    {
      key: "paid",
      label: "Bezahlt",
      render: (r) => (
        <span className={r.paid ? "badge-paid" : "badge-unpaid"} style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.25rem 0.625rem", borderRadius: 100 }}>
          {r.paid ? "✓ Bezahlt" : "Ausstehend"}
        </span>
      ),
    },
  ];

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, registration_date: new Date().toISOString().split("T")[0] });
    setDialogOpen(true);
  };

  const openEdit = (row: Registration) => {
    setEditing(row);
    setForm({
      participant_id: row.participant_id,
      course_id: row.course_id,
      registration_date: row.registration_date,
      paid: row.paid,
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

  return (
    <>
      <EntityTable
        title="Anmeldungen"
        subtitle="Kursbuchungen und Zahlungsstatus"
        entityClass="badge-registrations"
        columns={columns}
        rows={registrations}
        loading={loading}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={(row) => onDelete(row.record_id!)}
        searchPlaceholder="Anmeldung suchen..."
        searchKeys={["participant_name", "course_title"]}
      />
      <FormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? "Anmeldung bearbeiten" : "Neue Anmeldung erstellen"}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <FormField label="Teilnehmer" required>
          <SelectInput
            value={form.participant_id}
            onChange={(e) => setForm((f) => ({ ...f, participant_id: e.target.value }))}
            required
          >
            <option value="">Teilnehmer auswählen...</option>
            {participants.map((p) => (
              <option key={p.record_id} value={p.record_id}>{p.name}</option>
            ))}
          </SelectInput>
        </FormField>
        <FormField label="Kurs" required>
          <SelectInput
            value={form.course_id}
            onChange={(e) => setForm((f) => ({ ...f, course_id: e.target.value }))}
            required
          >
            <option value="">Kurs auswählen...</option>
            {courses.map((c) => (
              <option key={c.record_id} value={c.record_id}>{c.title}</option>
            ))}
          </SelectInput>
        </FormField>
        <FormField label="Anmeldedatum" required>
          <TextInput
            type="date"
            value={form.registration_date}
            onChange={(e) => setForm((f) => ({ ...f, registration_date: e.target.value }))}
            required
          />
        </FormField>
        <div style={{ marginTop: "0.5rem" }}>
          <CheckboxInput
            checked={form.paid}
            onChange={(checked) => setForm((f) => ({ ...f, paid: checked }))}
            label="Kurs wurde bezahlt"
          />
        </div>
      </FormDialog>
    </>
  );
}
