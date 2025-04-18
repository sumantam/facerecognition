import React, { useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  Typography,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import {
  fetchAllUsers,
  updateUser,
  usersSelector,
  deleteUser,
} from "../../reducers/users-reducer";
import { loggedinUserSelector } from "../../reducers/loggedin-user-reducer";
import { useEffect } from "react";
import AddUserDialog from "./add-user-modal";
//import { EditedUserModal } from "./edit-user-modal";
//import UserModal from "./user-modal";

const UsersTable = () => {
  const [editedUser, setEditedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [userAddDialogOpen,setUserAddDialogOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const usersData = useSelector(usersSelector);
  const loggedInUser = useSelector(loggedinUserSelector);
  const formData = usersData.data;

  const [searchText, setSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    getAllUsers();
    console.log("Get Users");
  }, []);

  const getAllUsers = async () => {
    try {
      await dispatch(fetchAllUsers()).unwrap();
    } catch (error) {
      toast.error("Error ", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };
  const handleAddButtonClick = (event) => {
    setUserAddDialogOpen(true);
  };
  const handleAddDialogClose = ()=> {
    setUserAddDialogOpen(false);
  }

  const handleAccountIconClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setEditedUser(null); // Reset the editedUser state to prevent editing
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (editedUser) {
      updateUser(editedUser);
      setEditedUser(null);
    }
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  console.log("The form data is .........", formData)
  const sortedData = formData
    .filter((item) =>
      item.email.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => a.email.localeCompare(b.email));

  const handleDelete = (user) => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async (user) => {
    console.log("for confirm delete", user);
    try {
      const response = await dispatch(deleteUser(user)).unwrap();
      if (response.status === 200) {
        toast.success("User deleted successfully ", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Error ", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // console.error("Error deleting user:", response.statusText);
      }
    } catch (error) {
      // Handle network or other errors
      toast.error("Error ", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error deleting user:", error.message);
    }
    setOpenDialog(false);
  };

  const handleCancelDelete = () => {
    // Close the confirmation dialog
    setOpenDialog(false);
  };

  const handleEdit = (user) => {
    console.log(user, " this is edited user");
    setEditedUser(user);
    setIsEditModalOpen(true);
  };

  return (
    <div>
      <Typography
        variant="h4"
        sx={{
          color: "#525252",
          fontWeight: 600,
          fontFamily: "My Custom Font, Arial, sans-serif",
          fontSize: "1.2rem",
        }}
      >
        Configuration {">"} User Management
      </Typography>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TextField
          label="Search"
          value={searchText}
          onChange={handleSearchChange}
          margin="normal"
          size="small"
          sx={{ width: "30vw" }}
        />
        <Button
          onClick={handleAddButtonClick}
          sx={{
            background: "#063c6f",
            color: "white",
            "&:hover": { background: "#06009a" },
          }}
        >
          ADD USER
        </Button>
        <AddUserDialog
        open={userAddDialogOpen}
        onClose={handleAddDialogClose}
        selectedValue={loggedInUser.email}
      />
      </div>
      <div
        style={{
          overflow: "auto",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <TableContainer component={Paper} sx={{ maxHeight: "62.4vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center"></TableCell>
                <TableCell align="center">Email ID</TableCell>
                <TableCell align="center">User</TableCell>
                <TableCell align="center">Phone Number</TableCell>
                <TableCell align="center">Responsibility</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData?.map((item, i) => (
                <TableRow key={i}>
                  <TableCell align="center">
                    <Avatar
                      alt="User Avatar"
                      src="/path/to/default-avatar.jpg"
                      sx={{ marginRight: 0 }}
                    />
                  </TableCell>
                  <TableCell align="center">{item.email}</TableCell>
                  <TableCell align="center">{item.name}</TableCell>
                  <TableCell align="center">{item.mobileNumber} </TableCell>
                  <TableCell align="center">{item.responsibility}</TableCell>
                  <TableCell align="center">{item.role}</TableCell>
                  <TableCell align="center">
                    <div
                      style={{
                       //display: "flex",
                        //justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <IconButton onClick={() => handleAccountIconClick(item)}>
                        <AccountCircleIcon
                          sx={{ maxHeight: "3vh", maxWidth: "3vw" }}
                        />
                      </IconButton>
                      <IconButton
                        onClick={() => handleEdit(item)}
                        disabled={item.email === loggedInUser.email}
                      >
                        <EditIcon sx={{ maxHeight: "3vh", maxWidth: "3vw" }} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(item)}
                        disabled={item.email === loggedInUser.email}
                      >
                        <DeleteIcon
                          sx={{ maxHeight: "3vh", maxWidth: "3vw" }}
                        />
                      </IconButton>
                      <Dialog open={openDialog} onClose={handleCancelDelete}>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <IconButton
                          aria-label="close"
                          onClick={handleCancelDelete}
                          sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                        <DialogContent>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold", marginBottom: "12px" }}
                          >
                            Are you sure you want to delete?
                          </Typography>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={handleCancelDelete}
                            sx={{
                              color: "white",
                              background: "#063c6f",
                              "&:hover": { background: "#06009a" },
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleConfirmDelete}
                            sx={{
                              color: "white",
                              background: "#063c6f",
                              "&:hover": { background: "#06009a" },
                            }}
                          >
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {/* <UserModal user={selectedUser} open={isModalOpen} onClose={handleCloseModal} />
      <EditedUserModal user={editedUser} open={isEditModalOpen} setIsEditModalOpen={setIsEditModalOpen} isEditModalOpen={isEditModalOpen} /> */}
    </div>
  );
};

const mapStateToProps = (state) => ({
  data: state.users.data, // Assuming you have a reducer named 'form' that contains the 'data' array
});

export default connect(mapStateToProps, { updateUser })(UsersTable);
