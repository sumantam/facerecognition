import Box from "@mui/material/Box";
import UsersTable from "./user-management-table";


const UserManagement = () => {

  return (
    <Box className="custom-scrollbar" sx={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <UsersTable />
      </Box>
    </Box>
  );
}

export default UserManagement;


