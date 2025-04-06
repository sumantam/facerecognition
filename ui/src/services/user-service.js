import { deleteItem, getWithMainThread, update, post } from "./service-base";

const getLoggedInUserDetails = async (email) => {
  return await getWithMainThread(`users/getLoggedInUserDetails`, { email: email });
};

const getAllUsers = async () => {
  return await getWithMainThread(`users/allUsers`);
};

const deleteUser = async (email) => {
  return await deleteItem(`users/userEmail/${email}`);
};

const updateUser = async (email, user) => {
  return await update(`/users/userEmail/${user.email}`, user);
};

const getResponsibilities = async (type, domain) => {
  return await getWithMainThread(`users/responsibility/search`, { q: type, schema: domain });
};
const createUser = async (data) => {
  return await post("/users/createUser", data);
};

const getLastDate = async () => {
  return await getWithMainThread(`access/lastDate`);
}

const userService = {
  getLoggedInUserDetails,
  getAllUsers,
  updateUser,
  deleteUser,
  getResponsibilities,
  createUser,
  getLastDate
};

export default userService;
