import { Box, CardContent, CardHeader, Grid, Card, Typography, Stack, IconButton, Snackbar, Alert, Button } from "@mui/material";
import { Check } from '@mui/icons-material';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DasboardLayout from "../../../models/dashboard-content-layout";
import Loader from "../../../components/loader/loader";
import RealTimeMachineData from "../../../components/real-time-machine-data-grid/real-time-machine-data-grid";
import BreadCrumb from "../../../components/bread-crumb/bread-crumb";
import { themeSelector, setRefreshButtonVisibility } from "../../../reducers/filter-reducer";
import RealTimeService from "../../../services/real-time-service";

const RealTimeDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useSelector(themeSelector);
    const [topSectionLayout, setTopSectionLayout] = useState(
        new DasboardLayout()
    );
    const [realTimeMachineDataAndStat, setRealTimeMachineDataAndStat] = useState(null);
    const [stdCycleTime, setStdCycleTime] = useState(null);
    const [allDataLoaded, setAllDataLoaded] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState("success")

    useEffect(() => {
        dispatch(setRefreshButtonVisibility(false));
        setAllDataLoaded(false);
        getStdCycleTime();
        const interval = setInterval(() => {
            getRealTimeDataAndStat();
            setAllDataLoaded(true);

        }, 3000);
        return () => {
            clearInterval(interval);
            dispatch(setRefreshButtonVisibility(true));
        }
    }, [dispatch])

    const getRealTimeDataAndStat = async () => {
        const locRealTimeMachineDataAndStat = await RealTimeService.getRealTimeDataAndStat();
        setRealTimeMachineDataAndStat(locRealTimeMachineDataAndStat["data"]["realTimeDataAndStat"]);
    }

    const getStdCycleTime = async () => {
        const locStdCycleTime = await RealTimeService.getStdCycleTime();
        setStdCycleTime(locStdCycleTime["data"]["stdCycleTime"]);
    }

    const handleChange = (event) => {
        setStdCycleTime(event.target.value);
    };

    const onSaveStdCycleTime = async () => {
        const updateMessage = await RealTimeService.updateStdCycleTime(stdCycleTime);
        if (updateMessage["data"]["message"] === "Std Cycle Time updated successfully") {
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            getStdCycleTime();
        }
        else {
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const goToGlobalView = () => {
        navigate("/oee");
    }

    return !allDataLoaded ? (
        <Loader />
    ) : (
        <Box flexGrow={1}>
            <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Standard Cycle Time has been updated successfully!...
                </Alert>
            </Snackbar>
            {/* <Grid container spacing={1} justifyContent="center">
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <BreadCrumb />
                </Grid>
            </Grid> */}
            <Grid container spacing={1} justifyContent="center">
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Typography
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            fontFamily: theme["fontFamily"],
                        }}
                    >
                        Real Time Dashboard
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Stack direction="row" spacing={2} sx={{
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}>
                        <Button variant="outlined" onClick={goToGlobalView}>Global View</Button>
                    </Stack>
                </Grid>
                {realTimeMachineDataAndStat !== null ?
                    <>
                        {realTimeMachineDataAndStat["stats"] !== null ?
                            <>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Stack direction="row" spacing={2} sx={{
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                    }}>
                                        <Card style={{ minHeight: "120px", minWidth: "250px" }}>
                                            <CardHeader
                                                title="Total Devices"
                                                titleTypographyProps={{
                                                    fontSize: 16,
                                                    fontWeight: 600,
                                                    textAlign: "center",
                                                    fontFamily: theme["fontFamily"],
                                                }}
                                                style={{ paddingBottom: 0 }}

                                            />
                                            <CardContent>
                                                <Typography
                                                    style={{
                                                        fontSize: "1.5rem",
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                        fontFamily: theme["fontFamily"],
                                                    }}
                                                >
                                                    {realTimeMachineDataAndStat["stats"]["avgCycleTime"]}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        {/* <Card style={{ minHeight: "120px", minWidth: "250px" }}>
                                            <CardHeader
                                                title="Standard Cycle Time (ms)"
                                                titleTypographyProps={{
                                                    fontSize: 16,
                                                    fontWeight: 600,
                                                    textAlign: "center",
                                                    fontFamily: theme["fontFamily"],
                                                }}
                                                style={{ paddingBottom: 0 }}

                                            />
                                            <CardContent>
                                                <Stack direction="row" spacing={2} sx={{
                                                    justifyContent: "flex-start",
                                                    alignItems: "center",
                                                }}>
                                                    <input
                                                        style={{
                                                            fontSize: "1.5rem",
                                                            fontWeight: "bold",
                                                            width: "70%",
                                                            fontFamily: theme["fontFamily"],
                                                        }}
                                                        type="number"
                                                        onChange={handleChange}
                                                        value={stdCycleTime}
                                                    />
                                                    <IconButton aria-label="save" color="success"
                                                        onClick={onSaveStdCycleTime}>
                                                        <Check />
                                                    </IconButton>
                                                </Stack>

                                            </CardContent>
                                        </Card> */}
                                        <Card style={{ minHeight: "120px", minWidth: "200px" }}>
                                            <CardHeader
                                                title="Total Count"
                                                titleTypographyProps={{
                                                    fontSize: 16,
                                                    fontWeight: 600,
                                                    textAlign: "center",
                                                    fontFamily: theme["fontFamily"],
                                                }}
                                                style={{ paddingBottom: 0 }}

                                            />
                                            <CardContent>
                                                <Typography
                                                    style={{
                                                        fontSize: "1.5rem",
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                        fontFamily: theme["fontFamily"],
                                                    }}
                                                >
                                                    {realTimeMachineDataAndStat["stats"]["totalCount"]}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card style={{ minHeight: "120px", minWidth: "200px" }}>
                                            <CardHeader
                                                title="Total Good Count"
                                                titleTypographyProps={{
                                                    fontSize: 16,
                                                    fontWeight: 600,
                                                    textAlign: "center",
                                                    fontFamily: theme["fontFamily"],
                                                }}
                                                style={{ paddingBottom: 0 }}

                                            />
                                            <CardContent>
                                                <Typography
                                                    style={{
                                                        fontSize: "1.5rem",
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                        fontFamily: theme["fontFamily"],
                                                        color: "green"
                                                    }}
                                                >
                                                    {realTimeMachineDataAndStat["stats"]["totalGoodCount"]}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card style={{ minHeight: "120px", minWidth: "200px" }}>
                                            <CardHeader
                                                title="Total Bad Count"
                                                titleTypographyProps={{
                                                    fontSize: 16,
                                                    fontWeight: 600,
                                                    textAlign: "center",
                                                    fontFamily: theme["fontFamily"],
                                                }}
                                                style={{ paddingBottom: 0 }}

                                            />
                                            <CardContent>
                                                <Typography
                                                    style={{
                                                        fontSize: "1.5rem",
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                        fontFamily: theme["fontFamily"],
                                                        color: "red"
                                                    }}
                                                >
                                                    {realTimeMachineDataAndStat["stats"]["totalBadCount"]}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card style={{ minHeight: "120px", minWidth: "200px" }}>
                                            <CardHeader
                                                title="Decision pending"
                                                titleTypographyProps={{
                                                    fontSize: 16,
                                                    fontWeight: 600,
                                                    textAlign: "center",
                                                    fontFamily: theme["fontFamily"],
                                                }}
                                                style={{ paddingBottom: 0 }}

                                            />
                                            <CardContent>
                                                <Typography
                                                    style={{
                                                        fontSize: "1.5rem",
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                        fontFamily: theme["fontFamily"],
                                                        color: "red"
                                                    }}
                                                >
                                                    {realTimeMachineDataAndStat["stats"]["totalUnknown"]}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Stack>
                                </Grid>
                            </>
                            :
                            <Card>
                                <CardContent>
                                    <Typography style={{ fontSize: "1rem", fontWeight: "bold", fontFamily: theme["fontFamily"] }}>
                                        No data available
                                    </Typography>
                                </CardContent>
                            </Card>
                        }
                        {realTimeMachineDataAndStat["data"].length > 0 ?
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Card style={{ minHeight: "400px" }}>
                                    <CardHeader
                                        title="Machine Data"
                                        titleTypographyProps={{
                                            fontSize: 16,
                                            fontWeight: 600,
                                            fontFamily: theme["fontFamily"],
                                        }}
                                        style={{ paddingBottom: 0 }}

                                    />
                                    <CardContent>
                                        <RealTimeMachineData data={realTimeMachineDataAndStat["data"]}
                                            fontFamily={theme["fontFamily"]}
                                            yellowGradientColor={theme["colors"]["yellowGradientColor"]}
                                            greenGradientColor={theme["colors"]["greenGradientColor"]}
                                            redGradientColor={theme["colors"]["redGradientColor"]}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid> :
                            <Card>
                                <CardContent>
                                    <Typography style={{ fontSize: "1rem", fontWeight: "bold", fontFamily: theme["fontFamily"] }}>
                                        No data available
                                    </Typography>
                                </CardContent>
                            </Card>}
                    </> :
                    <Card>
                        <CardContent>
                            <Typography style={{ fontSize: "1rem", fontWeight: "bold", fontFamily: theme["fontFamily"] }}>
                                No data available
                            </Typography>
                        </CardContent>
                    </Card>
                }
            </Grid>
        </Box>
    )
}

export default RealTimeDashboard;