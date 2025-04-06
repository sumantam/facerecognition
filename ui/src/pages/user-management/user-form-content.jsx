import React, { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import UserImage from "../../images/user.jpg";
import imageCompression from "browser-image-compression";
import {
  Avatar,
  Button,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { loggedinUserSelector } from "../../reducers/loggedin-user-reducer";
import userService from "../../services/user-service";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../reducers/users-reducer";

const UserFormContent = ({ onClose, email }) => {
  const [userBasicData, setUserData] = useState({
    name: "",
    role: "",
    responsibility: "",
    countryCode: "91",
    mobileNumber: "9999999999",
    email: "example@company1.com",
    designation: "Default",
    password: "",
    location: "",
  }); 
  const dispatch = useDispatch();
  const loggedInUser = useSelector(loggedinUserSelector);
  const domain = () => {
    var first_splits = loggedInUser.email.split("@");
    if (!Array.isArray(first_splits) || first_splits.length < 2) return "";
    else {
      var second_splits = first_splits[1].split(".");
      if (second_splits.length < 2) {
        return "";
      } else {
        return second_splits[0];
      }
    }
  };
  const auth = getAuth();
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [selectedManager, setSelectedManager] = useState([]);
  const [selectedReportees, setSelectedReportees] = useState([]);
  const [operatorReportees, setOperatorReportees] = useState([]);
  const [executiveReportees, setExecutiveReportees] = useState([]);
  const [supervisorReportees, setSupervisorReportees] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const inputRef = useRef(null);
  const handleReporteeSelection = (event) => {
    const selectedValue = event.target.value;
    const selectedValues = Array.isArray(selectedValue)
      ? selectedValue
      : [selectedValue];
    setSelectedReportees((prevSelected) => [
      ...prevSelected,
      ...selectedValues,
    ]);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const operatorResponse = await userService.getResponsibilities(
          "Operator",
          domain()
        );
        const executiveResponse = await userService.getResponsibilities(
          "Executive",
          domain()
        );
        const supervisorResponse = await userService.getResponsibilities(
          "Supervisor",
          domain()
        );
        console.log(operatorResponse);
        console.log(executiveResponse);
        console.log(supervisorResponse);

        // Update the corresponding state with the reportees from each API response
        setOperatorReportees(operatorResponse.data);
        setExecutiveReportees(executiveResponse.data);
        setSupervisorReportees(supervisorResponse.data);

        console.log(operatorReportees);
      } catch (error) {
        // Handle error if necessary
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(selectedManager);
    console.log(selectedManager == []);
    const newFormData = {
      data: {
        basic: userBasicData,
        img: selectedImage ? URL.createObjectURL(selectedImage) : null,
        relation: {
          mgrList:
            selectedManager.length === 0
              ? []
              : [
                  {
                    email: selectedManager.email,
                  },
                ],
          reporteeList: Array.isArray(selectedReportees)
            ? selectedReportees.map((reportee) => ({
                email: reportee.email,
              }))
            : [],
        },
      },
    };
    console.log("this is the new form data prior try", newFormData);
    onClose();
    try {
      console.log("this is the new form data post try", newFormData);
      const response = await dispatch(createUser(newFormData)).unwrap();
      if (response.status === 201) {
        console.log("this is response", newFormData.data.basic);
        toast.success("User added successfully ", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.log(response.data);

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
      console.log(error);
      console.error("Major Error: ", error.message);
    }
  };

  const validateEmail = (email) => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setUserData({ ...userBasicData, email: emailValue });
    console.log("email ", userBasicData.email);
  };
  const handleMobileNumberChange = (e) => {
    const inputValue = e.target.value;
    console.log(inputValue);
    setUserData({ ...userBasicData, mobileNumber: inputValue });
    // Validate phone number format
    const isValidMobileNumber = /^\d{10}$/.test(inputValue);
    if (isValidMobileNumber) {
      setMobileNumberError("");
    } else {
      setMobileNumberError("Please enter a valid 10-digit phone number.");
    }
  };

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          flexDirection: "column", // Set flexDirection to column
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <IconButton onClick={() => inputRef.current.click()}>
          <Avatar
            alt="User"
            src={selectedImage && URL.createObjectURL(selectedImage)}
            sx={{ width: "5rem", height: "5rem" }}
          />
        </IconButton>
        <input
          type="file"
          style={{ display: "none" }}
          ref={inputRef}
          accept="image/*"
          onChange={async (e) => {
            const imageFile = e.target.files[0];
            console.log(
              "originalFile instanceof Blob",
              imageFile instanceof Blob
            ); // true
            console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

            const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            };
            try {
              const compressedFile = await imageCompression(imageFile, options);
              console.log(
                "compressedFile instanceof Blob",
                compressedFile instanceof Blob
              ); // true
              console.log(
                `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
              );
              setSelectedImage(compressedFile);
              //console.log('hello', URL.createObjectURL(selectedImage))
            } catch (e) {
              setSelectedImage(null);
            }
          }}
        ></input>
      </Grid>
      <form onSubmit={handleFormSubmit} style={{ display: "contents" }}>
        <Grid item xs={6} padding={0.5}>
          <TextField
            size="small"
            label="Email"
            value={userBasicData.email}
            onChange={handleEmailChange}
            margin="normal"
            fullWidth
            error={userBasicData.email && !validateEmail(userBasicData.email)}
            helperText={
              userBasicData.email && !validateEmail(userBasicData.email)
                ? "Invalid email format"
                : ""
            }
          />
        </Grid>
        <Grid item xs={6} padding={0.5}>
          <TextField
            label="Password"
            value={userBasicData.password}
            onChange={(e) => {
              setUserData({ ...userBasicData, password: e.target.value });
            }}
            margin="normal"
            type="password"
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={6} padding={0.5}>
          <TextField
            label="Name"
            value={userBasicData.name}
            onChange={(e) =>
              setUserData({ ...userBasicData, name: e.target.value })
            }
            margin="normal"
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={6} padding={0.5}>
          <TextField
            select
            fullWidth
            margin="normal"
            size="small"
            label="Role"
            onChange={(e) =>
              setUserData({ ...userBasicData, role: e.target.value })
            }
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={6} padding={0.5}>
          <TextField
            select
            fullWidth
            margin="normal"
            size="small"
            label="Responsibility"
            onChange={(e) =>
              setUserData({
                ...userBasicData,
                responsibility: e.target.value,
              })
            }
          >
            <MenuItem value="Executive">Executive</MenuItem>
            <MenuItem value="Supervisor">Supervisor</MenuItem>
            <MenuItem value="Operator">Operator</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={6} padding={0.5}>
          <TextField
            size="small"
            label="Phone Number"
            value={userBasicData.mobileNumber}
            onChange={handleMobileNumberChange}
            margin="normal"
            fullWidth
            error={!!mobileNumberError}
            helperText={mobileNumberError}
          />
        </Grid>
        <Grid item xs={6} padding={0.5}>
          <TextField
            size="small"
            label="Location"
            value={userBasicData.location}
            onChange={(e) => {
              setUserData({ ...userBasicData, location: e.target.value });
            }}
            margin="normal"
            fullWidth
          />
        </Grid>
        <Grid item xs={6} padding={0.5}>
          {userBasicData.responsibility === "Operator" && (
            <TextField
              select
              fullWidth
              margin="normal"
              size="small"
              label="Manager"
              onChange={(e) => setSelectedManager(e.target.value)}
            >
              {supervisorReportees.map((operator) => (
                <MenuItem key={operator.email} value={operator}>
                  {operator.name} : {"("} {operator.email} {")"}
                </MenuItem>
              ))}
            </TextField>
          )}
          {userBasicData.responsibility === "Supervisor" && (
            <div style={{ display: "flex", gap: "1rem" }}>
              <TextField
                select
                fullWidth
                margin="normal"
                size="small"
                label="Manager"
                onChange={(e) => setSelectedManager(e.target.value)}
              >
                {executiveReportees.map((operator) => {
                  console.log(operator);
                  return (
                    <MenuItem key={operator.email} value={operator}>
                      {operator.name} : {"("} {operator.email} {")"}
                    </MenuItem>
                  );
                })}
              </TextField>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                id="reportees-select"
                label="Reportees"
                select
                multiple
                value={selectedReportees}
                onChange={(e) => handleReporteeSelection(e)}
                SelectProps={{
                  renderValue: (selected) => (
                    <div>
                      {selected.map((reportee) => (
                        <Chip key={reportee.email} label={reportee.email} />
                      ))}
                    </div>
                  ),
                }}
              >
                {operatorReportees.map((operator) => (
                  <MenuItem key={operator.email} value={operator}>
                    {operator.name} : {"("} {operator.email} {")"}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          )}
          {userBasicData.responsibility === "Executive" && (
            <TextField
              fullWidth
              size="small"
              margin="normal"
              id="reportees-select"
              label="Reportees"
              select
              multiple
              value={selectedReportees}
              onChange={(e) => handleReporteeSelection(e)}
              SelectProps={{
                renderValue: (selected) => (
                  <div>
                    {selected.map((reportee) => (
                      <Chip key={reportee.email} label={reportee.name} />
                    ))}
                  </div>
                ),
              }}
            >
              {supervisorReportees.map((operator) => (
                <MenuItem key={operator.email} value={operator}>
                  {operator.name} : {"("} {operator.email} {")"}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          justifyContent="right"
          display="flex"
          marginTop="1rem"
        >
          <Button
            type="button"
            variant="contained"
            style={{ margin: "5px" }}
            sx={{
              background: "#063c6f",
              width: "7vw",
              "&:hover": {
                background: "#06009a",
              },
            }}
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
          <Button
            type="button"
            variant="contained"
            style={{ margin: "5px" }}
            sx={{
              background: "#063c6f",
              width: "7vw",
              "&:hover": {
                background: "#06009a",
              },
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </Grid>
      </form>
    </Grid>
  );
};

export default UserFormContent;
