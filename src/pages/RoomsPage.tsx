import { useState } from "react";
import { EntityTable, type Column } from "@/components/EntityTable";
import { FormDialog } from "@/components/FormDialog";
import { FormField, TextInput } from "@/components/FormField";

export interface Room {
  record_id?: string;
  room_name: string;
  building: string;
  capacity: number;
}

interface RoomsPageProps {
  rooms: Room[];
  loading: boolean;
  onCreate: (data: Omit<Room, "record_id">) => Promise<void>;
  onUpdate: (id: string, data: Omit<Room, "record_id">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const empty: Omit<Room, "record_id"> = {
  room_name: "",
  building: "",
  capacity: 30,
};

const columns: Column<Room>[] = [
  { key: "room_name", label: "Raumname", render: (r) => <span style={{ fontWeight: 600 }}>{r.room_name}</span> },
  { key: "building", label: "Gebäude", render: (r) => (
    <span className="badge-rooms" style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.25rem 0.625rem", borderRadius: 100 }}>
      {r.building || "–"}
    </span>
  )},
  { key: "capacity", label: "Kapazität", render: (r) => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span style={{ fontWeight: 700, fontSize: "1.0625rem", color: "oklch(0.45 0.2 290)" }}>{r.capacity}</span>
      <span style={{ color: "var(--muted-foreground)", fontSize: "0.8125rem" }}>Personen</span>
    </div>
  )},
];

export function RoomsPage({ rooms, loading, onCreate, onUpdate, onDelete }: RoomsPageProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setDialogOpen(true);
  };

  const openEdit = (row: Room) => {
    setEditing(row);
    setForm({ room_name: row.room_name, building: row.building, capacity: row.capacity });
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
        title="Räume"
        subtitle="Kursräume und Kapazitäten verwalten"
        entityClass="badge-rooms"
        columns={columns}
        rows={rooms}
        loading={loading}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={(row) => onDelete(row.record_id!)}
        searchPlaceholder="Raum suchen..."
        searchKeys={["room_name", "building"]}
      />
      <FormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? "Raum bearbeiten" : "Neuen Raum anlegen"}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <FormField label="Raumname" required>
          <TextInput value={form.room_name} onChange={set("room_name")} required placeholder="z.B. Seminarraum A1" />
        </FormField>
        <FormField label="Gebäude" required>
          <TextInput value={form.building} onChange={set("building")} required placeholder="z.B. Hauptgebäude" />
        </FormField>
        <FormField label="Kapazität (Personen)" required>
          <TextInput type="number" value={String(form.capacity)} onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) }))} required min="1" />
        </FormField>
      </FormDialog>
    </>
  );
}
