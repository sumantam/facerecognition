import { deleteItem, getWithMainThread, update, post, postForFileUpload } from "./service-base";

const getLoggedInUserDetails = async (email) => {
  return await getWithMainThread(`users/getLoggedInUserDetails`, { email: email });
};

const getAllUsers = async () => {
  console.log('Inside the function getAllUsers ...........')
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
  // return await post("/users/createUser", data);
  console.log ("The data got is the following :", data);
  return await postForFileUpload("employees", data);
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
