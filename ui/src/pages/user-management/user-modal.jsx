// import { Avatar, Card, CardContent, CardHeader, List, ListItem, ListItemText, Modal, Typography, styled } from "@mui/material";

// const UserModal = ({ user, open, onClose }) => {
    
//     const CustomModal = styled(Modal)(({ theme }) => ({
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//     }));

//     const ModalContent = styled("div")(({ theme }) => ({
//       position: "absolute",
//       top: "50%",
//       left: "50%",
//       transform: "translate(-50%, -50%)",
//       width: "400px",
//       backgroundColor: "#F0F0FF",
//       boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
//       outline: "none",
//       borderRadius: theme.shape.borderRadius,
//       padding: theme.spacing(4),
//     }));

//     return (
//       <CustomModal open={open} onClose={onClose}>
//         <ModalContent sx={{ width: "600px", height: "500px" }}>
//           <Card sx={{ maxWidth: 600, maxHeight: 450 }}>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "baseline",
//               }}
//             >
//               <Avatar
//                 alt="User Avatar"
//                 src="/path/to/default-avatar.jpg"
//                 sx={{
//                   marginRight: 1,
//                   marginLeft: "1vh",
//                   height: "30vh",
//                   width: "30vh",
//                   marginTop: "1vh",
//                 }}
//               />
//               <CardHeader
//                 title={
//                   <Typography
//                     variant="h6"
//                     sx={{ color: "#7852E6", fontSize: "30px" }}
//                   >
//                     {user?.name}
//                   </Typography>
//                 }
//                 subheader={
//                   <Typography variant="subtitle1" sx>
//                     {user?.responsibility}
//                   </Typography>
//                 }
//               />
//             </div>
  
//             <CardContent>
//               <List>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "flex-end",
//                   }}
//                 >
//                   <ListItem disablePadding>
//                     <ListItemText
//                       primary="Phone Number"
//                       secondary={user?.mobileNumber}
//                       sx={{ color: "#7852E6" }}
//                     />
//                   </ListItem>
  
//                   <ListItem disablePadding>
//                     <ListItemText
//                       primary="Email"
//                       secondary={user?.email}
//                       sx={{ color: "#7852E6" }}
//                     />
//                   </ListItem>
  
//                   <ListItem disablePadding>
//                     <ListItemText
//                       primary="Role"
//                       secondary={user?.role}
//                       sx={{ color: "#7852E6" }}
//                     />
//                   </ListItem>
//                 </div>
  
//                 {/* Add more user details as needed */}
//               </List>
//             </CardContent>
//           </Card>
//         </ModalContent>
//       </CustomModal>
//     );
//   };

//   export default UserModal;