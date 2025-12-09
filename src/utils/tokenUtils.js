// Add this to your utils folder
export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.clear();
};

// Call this when you get 401 errors
export const handleAuthError = () => {
  clearAuthData();
  window.location.href = "/login";
};
