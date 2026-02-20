// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export interface Kurse {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    title?: string;
    description?: string;
    start_date?: string; // Format: YYYY-MM-DD oder ISO String
    end_date?: string; // Format: YYYY-MM-DD oder ISO String
    max_participants?: number;
    price?: number;
  };
}

export interface Dozenten {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    name?: string;
    email?: string;
    phone?: string;
    subject_area?: string;
  };
}

export interface Teilnehmer {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    name?: string;
    email?: string;
    phone?: string;
    birthdate?: string; // Format: YYYY-MM-DD oder ISO String
  };
}

export interface Raeume {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    room_name?: string;
    building?: string;
    capacity?: number;
  };
}

export interface Anmeldungen {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    participant_id?: string; // applookup -> URL zu 'Teilnehmer' Record
    course_id?: string; // applookup -> URL zu 'Kurse' Record
    registration_date?: string; // Format: YYYY-MM-DD oder ISO String
    paid?: boolean;
  };
}

export const APP_IDS = {
  KURSE: '69981c69443814986e001b80',
  DOZENTEN: '69981c69f0ad4dffba52674e',
  TEILNEHMER: '69981c6a4f5c9a8909cbc895',
  RAEUME: '69981c6a9e5e8fbc2fbb3af5',
  ANMELDUNGEN: '69981c6aef476def4a720a66',
} as const;

// Helper Types for creating new records
export type CreateKurse = Kurse['fields'];
export type CreateDozenten = Dozenten['fields'];
export type CreateTeilnehmer = Teilnehmer['fields'];
export type CreateRaeume = Raeume['fields'];
export type CreateAnmeldungen = Anmeldungen['fields'];