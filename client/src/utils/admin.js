// this document will let you check if someone is admin and maybe more stuff later
async function isAdmin(userId) {
  const API_URL = process.env.VUE_APP_API_BASE_URL;
  const response = await fetch(`${API_URL}auth/user?userId=${userId}`);
  const user = await response.json();
  return user.isAdmin;
}

module.exports = {
  isAdmin,
};
