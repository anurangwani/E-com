// src/user.js
export function getUserId() {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = "user_" + Date.now();
    localStorage.setItem("userId", userId);
  }
  return userId;
}
