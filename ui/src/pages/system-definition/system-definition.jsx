import { Box } from "@mui/material";
import { StyledTab, StyledTabs } from "../../components/styled-tabs";
import { useState } from "react";

const SystemDefinition = () => {

    const [value, setValue] = useState(0);

    const handleTabChange = (e, newValue) => {
        setValue(newValue);
    };

    return (
        <Box className="custom-scrollbar" sx={{ display: "flex" }}>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ bgcolor: "#29516d", borderRadius: "4px" }}>
                    <StyledTabs value={value} onChange={handleTabChange} aria-label="styled tabs example">
                        <StyledTab label="Equipment Types " value={0} />
                        <StyledTab label="Equipment" value={1} />
                    </StyledTabs>
                </Box>
            </Box>
        </Box>
    );
}

export default SystemDefinition;