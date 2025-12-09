export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const ROLES = {
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  PATIENT: "PATIENT",
};

export const APPOINTMENT_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const RECORD_TYPES = {
  PRESCRIPTION: "PRESCRIPTION",
  TEST_REPORT: "TEST_REPORT",
  DIAGNOSIS: "DIAGNOSIS",
  IMAGING: "IMAGING",
  VACCINATION: "VACCINATION",
  OTHER: "OTHER",
};

export const NOTIFICATION_TYPES = {
  APPOINTMENT: "APPOINTMENT",
  PRESCRIPTION: "PRESCRIPTION",
  CHECKUP: "CHECKUP",
  GENERAL: "GENERAL",
};

export const DATE_FORMAT = {
  DISPLAY: "PPP",
  DISPLAY_WITH_TIME: "PPP p",
  INPUT: "yyyy-MM-dd",
  INPUT_WITH_TIME: "yyyy-MM-dd'T'HH:mm",
};

export const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const ROUTES = {
  // Public
  LOGIN: "/login",
  REGISTER: "/register",
  SET_PASSWORD: "/set-password",

  // Admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_CREATE_DOCTOR: "/admin/create-doctor",
  ADMIN_DOCTORS_LIST: "/admin/doctors",

  // Patient
  PATIENT_DASHBOARD: "/patient/dashboard",
  PATIENT_APPOINTMENTS: "/patient/appointments",
  PATIENT_BOOK_APPOINTMENT: "/patient/book-appointment",
  PATIENT_RECORDS: "/patient/records",
  PATIENT_UPLOAD_RECORD: "/patient/upload-record",
  PATIENT_NOTIFICATIONS: "/patient/notifications",
  PATIENT_FEEDBACK: "/patient/feedback",
  PATIENT_PROFILE: "/patient/profile",

  // Doctor
  DOCTOR_DASHBOARD: "/doctor/dashboard",
  DOCTOR_APPOINTMENTS: "/doctor/appointments",
  DOCTOR_PROFILE: "/doctor/profile",
};
