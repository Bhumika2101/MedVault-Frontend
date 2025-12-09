import axiosInstance from "./axios";

// Auth APIs
export const authAPI = {
  login: (data) => axiosInstance.post("/auth/login", data),
  registerPatient: (data) => axiosInstance.post("/auth/register/patient", data),
  setPassword: (data) => axiosInstance.post("/auth/set-password", data),
};

// Admin APIs
export const adminAPI = {
  createDoctor: (data) => axiosInstance.post("/admin/doctors", data),
  getAllDoctors: () => axiosInstance.get("/admin/doctors"),
};

// Patient APIs
export const patientAPI = {
  getDashboard: () => axiosInstance.get("/patient/dashboard"),
  getProfile: () => axiosInstance.get("/patient/profile"),
};

// Doctor APIs
export const doctorAPI = {
  getAllActiveDoctors: () => axiosInstance.get("/doctor/all"),
  getDoctorById: (id) => axiosInstance.get(`/doctor/${id}`),
  getDashboard: () => axiosInstance.get("/doctor/dashboard"),
};

// Appointment APIs
export const appointmentAPI = {
  bookAppointment: (data) => axiosInstance.post("/appointments/book", data),
  getMyAppointments: () => axiosInstance.get("/appointments/my-appointments"),
  getAppointmentById: (id) => axiosInstance.get(`/appointments/${id}`),
  updateStatus: (id, status, notes, reason) =>
    axiosInstance.put(`/appointments/${id}/status`, null, {
      params: {
        status,
        ...(notes && { doctorNotes: notes }),
        ...(reason && { rejectionReason: reason }),
      },
    }),
};

// Medical Records APIs
export const medicalRecordAPI = {
  createRecord: (formData) =>
    axiosInstance.post("/medical-records", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getMyRecords: () => axiosInstance.get("/medical-records"),
  getRecordsByType: (type) =>
    axiosInstance.get(`/medical-records/type/${type}`),
  getRecordById: (id) => axiosInstance.get(`/medical-records/${id}`),
  updateRecord: (id, formData) =>
    axiosInstance.put(`/medical-records/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteRecord: (id) => axiosInstance.delete(`/medical-records/${id}`),
};

// Notification APIs
export const notificationAPI = {
  getAll: () => axiosInstance.get("/notifications"),
  getUnread: () => axiosInstance.get("/notifications/unread"),
  markAsRead: (id) => axiosInstance.put(`/notifications/${id}/read`),
  markAllAsRead: () => axiosInstance.put("/notifications/mark-all-read"),
};

// Feedback APIs
export const feedbackAPI = {
  create: (data) => axiosInstance.post("/feedbacks", data),
  getDoctorFeedbacks: (doctorId) =>
    axiosInstance.get(`/feedbacks/doctor/${doctorId}`),
  getDoctorStats: (doctorId) =>
    axiosInstance.get(`/feedbacks/doctor/${doctorId}/stats`),
  getMyFeedbacks: () => axiosInstance.get("/feedbacks/my-feedbacks"),
  updateFeedback: (id, data) => axiosInstance.put(`/feedbacks/${id}`, data),
  deleteFeedback: (id) => axiosInstance.delete(`/feedbacks/${id}`),
  getDoctorRating: (doctorId) =>
    axiosInstance.get(`/feedbacks/doctor/${doctorId}/rating`),
  getMyFeedbacks: () => axiosInstance.get("/feedbacks/my-feedbacks"),
};
