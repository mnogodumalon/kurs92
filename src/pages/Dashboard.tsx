import { useState, useEffect, useCallback } from "react";
import { AppSidebar, type ActiveView } from "@/components/AppSidebar";
import { OverviewDashboard } from "@/components/OverviewDashboard";
import { CoursesPage, type Course } from "./CoursesPage";
import { InstructorsPage, type Instructor } from "./InstructorsPage";
import { ParticipantsPage, type Participant } from "./ParticipantsPage";
import { RoomsPage, type Room } from "./RoomsPage";
import { RegistrationsPage, type Registration } from "./RegistrationsPage";
import { LivingAppsService, extractRecordId, createRecordUrl } from "@/services/livingAppsService";
import { APP_IDS } from "@/types/app";
import type { Kurse, Dozenten, Teilnehmer, Raeume, Anmeldungen } from "@/types/app";

// ── Mappers: API → UI types ─────────────────────────────────────────────
function mapKurs(r: Kurse): Course {
  return {
    record_id: r.record_id,
    title: r.fields.title ?? "",
    description: r.fields.description ?? "",
    start_date: r.fields.start_date ?? "",
    end_date: r.fields.end_date ?? "",
    max_participants: r.fields.max_participants ?? 0,
    price: r.fields.price ?? 0,
  };
}

function mapDozent(r: Dozenten): Instructor {
  return {
    record_id: r.record_id,
    name: r.fields.name ?? "",
    email: r.fields.email ?? "",
    phone: r.fields.phone ?? "",
    subject_area: r.fields.subject_area ?? "",
  };
}

function mapTeilnehmer(r: Teilnehmer): Participant {
  return {
    record_id: r.record_id,
    name: r.fields.name ?? "",
    email: r.fields.email ?? "",
    phone: r.fields.phone ?? "",
    birthdate: r.fields.birthdate ?? "",
  };
}

function mapRaum(r: Raeume): Room {
  return {
    record_id: r.record_id,
    room_name: r.fields.room_name ?? "",
    building: r.fields.building ?? "",
    capacity: r.fields.capacity ?? 0,
  };
}

function mapAnmeldung(r: Anmeldungen): Registration {
  const participantId = extractRecordId(r.fields.participant_id) ?? r.fields.participant_id ?? "";
  const courseId = extractRecordId(r.fields.course_id) ?? r.fields.course_id ?? "";
  return {
    record_id: r.record_id,
    participant_id: participantId,
    course_id: courseId,
    registration_date: r.fields.registration_date ?? "",
    paid: r.fields.paid ?? false,
  };
}

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");

  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingInstructors, setLoadingInstructors] = useState(true);
  const [loadingParticipants, setLoadingParticipants] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);

  // ── Load all data ──────────────────────────────────────────────────────
  const loadCourses = useCallback(async () => {
    setLoadingCourses(true);
    try {
      const data = await LivingAppsService.getKurse();
      setCourses(data.map(mapKurs));
    } catch (e) {
      console.error("Failed to load courses", e);
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  const loadInstructors = useCallback(async () => {
    setLoadingInstructors(true);
    try {
      const data = await LivingAppsService.getDozenten();
      setInstructors(data.map(mapDozent));
    } catch (e) {
      console.error("Failed to load instructors", e);
    } finally {
      setLoadingInstructors(false);
    }
  }, []);

  const loadParticipants = useCallback(async () => {
    setLoadingParticipants(true);
    try {
      const data = await LivingAppsService.getTeilnehmer();
      setParticipants(data.map(mapTeilnehmer));
    } catch (e) {
      console.error("Failed to load participants", e);
    } finally {
      setLoadingParticipants(false);
    }
  }, []);

  const loadRooms = useCallback(async () => {
    setLoadingRooms(true);
    try {
      const data = await LivingAppsService.getRaeume();
      setRooms(data.map(mapRaum));
    } catch (e) {
      console.error("Failed to load rooms", e);
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  const loadRegistrations = useCallback(async () => {
    setLoadingRegistrations(true);
    try {
      const data = await LivingAppsService.getAnmeldungen();
      setRegistrations(data.map(mapAnmeldung));
    } catch (e) {
      console.error("Failed to load registrations", e);
    } finally {
      setLoadingRegistrations(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
    loadInstructors();
    loadParticipants();
    loadRooms();
    loadRegistrations();
  }, [loadCourses, loadInstructors, loadParticipants, loadRooms, loadRegistrations]);

  // ── Courses CRUD ───────────────────────────────────────────────────────
  const courseHandlers = {
    onCreate: async (data: Omit<Course, "record_id">) => {
      await LivingAppsService.createKurseEntry({
        title: data.title,
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
        max_participants: data.max_participants,
        price: data.price,
      });
      await loadCourses();
    },
    onUpdate: async (id: string, data: Omit<Course, "record_id">) => {
      await LivingAppsService.updateKurseEntry(id, {
        title: data.title,
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
        max_participants: data.max_participants,
        price: data.price,
      });
      await loadCourses();
    },
    onDelete: async (id: string) => {
      await LivingAppsService.deleteKurseEntry(id);
      setCourses((prev) => prev.filter((r) => r.record_id !== id));
    },
  };

  // ── Instructors CRUD ───────────────────────────────────────────────────
  const instructorHandlers = {
    onCreate: async (data: Omit<Instructor, "record_id">) => {
      await LivingAppsService.createDozentenEntry({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject_area: data.subject_area,
      });
      await loadInstructors();
    },
    onUpdate: async (id: string, data: Omit<Instructor, "record_id">) => {
      await LivingAppsService.updateDozentenEntry(id, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject_area: data.subject_area,
      });
      await loadInstructors();
    },
    onDelete: async (id: string) => {
      await LivingAppsService.deleteDozentenEntry(id);
      setInstructors((prev) => prev.filter((r) => r.record_id !== id));
    },
  };

  // ── Participants CRUD ──────────────────────────────────────────────────
  const participantHandlers = {
    onCreate: async (data: Omit<Participant, "record_id">) => {
      await LivingAppsService.createTeilnehmerEntry({
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthdate: data.birthdate || undefined,
      });
      await loadParticipants();
    },
    onUpdate: async (id: string, data: Omit<Participant, "record_id">) => {
      await LivingAppsService.updateTeilnehmerEntry(id, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthdate: data.birthdate || undefined,
      });
      await loadParticipants();
    },
    onDelete: async (id: string) => {
      await LivingAppsService.deleteTeilnehmerEntry(id);
      setParticipants((prev) => prev.filter((r) => r.record_id !== id));
    },
  };

  // ── Rooms CRUD ─────────────────────────────────────────────────────────
  const roomHandlers = {
    onCreate: async (data: Omit<Room, "record_id">) => {
      await LivingAppsService.createRaeumeEntry({
        room_name: data.room_name,
        building: data.building,
        capacity: data.capacity,
      });
      await loadRooms();
    },
    onUpdate: async (id: string, data: Omit<Room, "record_id">) => {
      await LivingAppsService.updateRaeumeEntry(id, {
        room_name: data.room_name,
        building: data.building,
        capacity: data.capacity,
      });
      await loadRooms();
    },
    onDelete: async (id: string) => {
      await LivingAppsService.deleteRaeumeEntry(id);
      setRooms((prev) => prev.filter((r) => r.record_id !== id));
    },
  };

  // ── Registrations CRUD ─────────────────────────────────────────────────
  const registrationHandlers = {
    onCreate: async (data: Omit<Registration, "record_id" | "participant_name" | "course_title">) => {
      await LivingAppsService.createAnmeldungenEntry({
        participant_id: createRecordUrl(APP_IDS.TEILNEHMER, data.participant_id),
        course_id: createRecordUrl(APP_IDS.KURSE, data.course_id),
        registration_date: data.registration_date,
        paid: data.paid,
      });
      await loadRegistrations();
    },
    onUpdate: async (id: string, data: Omit<Registration, "record_id" | "participant_name" | "course_title">) => {
      await LivingAppsService.updateAnmeldungenEntry(id, {
        participant_id: createRecordUrl(APP_IDS.TEILNEHMER, data.participant_id),
        course_id: createRecordUrl(APP_IDS.KURSE, data.course_id),
        registration_date: data.registration_date,
        paid: data.paid,
      });
      await loadRegistrations();
    },
    onDelete: async (id: string) => {
      await LivingAppsService.deleteAnmeldungenEntry(id);
      setRegistrations((prev) => prev.filter((r) => r.record_id !== id));
    },
  };

  const kpiData = {
    coursesCount: courses.length,
    instructorsCount: instructors.length,
    participantsCount: participants.length,
    roomsCount: rooms.length,
    registrationsCount: registrations.length,
    paidCount: registrations.filter((r) => r.paid).length,
    unpaidCount: registrations.filter((r) => !r.paid).length,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AppSidebar activeView={activeView} onNavigate={setActiveView} />
      <main style={{ marginLeft: 240, flex: 1, minHeight: "100vh", background: "var(--background)" }}>
        {activeView === "dashboard" && (
          <OverviewDashboard data={kpiData} onNavigate={setActiveView} />
        )}
        {activeView === "courses" && (
          <CoursesPage courses={courses} loading={loadingCourses} {...courseHandlers} />
        )}
        {activeView === "instructors" && (
          <InstructorsPage instructors={instructors} loading={loadingInstructors} {...instructorHandlers} />
        )}
        {activeView === "participants" && (
          <ParticipantsPage participants={participants} loading={loadingParticipants} {...participantHandlers} />
        )}
        {activeView === "rooms" && (
          <RoomsPage rooms={rooms} loading={loadingRooms} {...roomHandlers} />
        )}
        {activeView === "registrations" && (
          <RegistrationsPage
            registrations={registrations}
            courses={courses}
            participants={participants}
            loading={loadingRegistrations}
            {...registrationHandlers}
          />
        )}
      </main>
    </div>
  );
}
