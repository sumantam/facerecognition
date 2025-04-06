import { Tab, Tabs, styled } from "@mui/material";

export const StyledTabs = styled((props) => (
    <Tabs
      {...props}
      TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
  ))({
    "& .MuiTabs-indicator": {display: "flex",justifyContent: "center",backgroundColor: "transparent"},
    "& .MuiTabs-indicatorSpan": {maxWidth: 40,width: "100%",backgroundColor: "#635ee7"}
  });

  export const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      textTransform: "none",
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1),
      color: "rgba(255, 255, 255, 0.7)",
      borderRadius: "40px",
      padding: "10px 20px",
      transition: "0.3s",
      "&.Mui-selected": {color: "#fff",background: "#054164",boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"},
      "&.Mui-focusVisible": {backgroundColor: "rgba(100, 95, 228, 0.32)"},
      "&:hover": {color: "#054164",background: "#E3E3E3",boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"}
    })
  );