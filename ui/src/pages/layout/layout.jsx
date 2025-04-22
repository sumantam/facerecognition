import { useRef, useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Outlet, useNavigate } from 'react-router-dom';
import Icon from '../../images/Icon.png';
import { Avatar, Button, FormControl, InputLabel, MenuItem, OutlinedInput, Paper, Popover, Select, Collapse } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loggedinUserSelector } from '../../reducers/loggedin-user-reducer';
import { auth } from '../../firebase/firebase';
import { DateRangePicker } from 'rsuite';
import { Dashboard, Person, Analytics, Timeline, Settings, DynamicFeed } from '@mui/icons-material';
import './layout.css'
import TopLevelFilter from '../../components/top-level-filter/top-level-filter';
import { themeSelector } from '../../reducers/filter-reducer';



const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function Layout({ items, isSMTDashboard, equipments }) {

    const current_date = new Date();
    const user = useSelector(loggedinUserSelector);
    const theme = useTheme();
    const userTheme = useSelector(themeSelector);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(true);
    const [nestedMenuOpen, setNestedMenuOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const [endDateTime, setEndDateTime] = useState(new Date());
    const [startDateTime, setStartDateTime] = useState(new Date(current_date.getFullYear() - 1, current_date.getMonth(), current_date.getDate(), 0, 0, 0));
    const [selectedEquipmentType, setSelectedEquipmentType] = useState('');
    const [selectedEquipment, setSelectedEquipment] = useState('');
    // const [equipmentData, setEquipmentData] = useState(equipments);
    const [equipmentData, setEquipmentData] = useState(equipments || []);
    const [selectedEqpId, setSelectedEqpId] = useState('');
    const [filteredEquipments, setFilteredEquipments] = useState([]);
    const avatarRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        console.log("Layout mounted. Current path:", window.location.pathname);
    }, []);

    const { afterToday } = DateRangePicker;
    const openPopOver = Boolean(anchorEl);
    const openFilter = Boolean(anchorEl2);
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClick = (event) => {
        setAnchorEl2(event.currentTarget);
    };

    const handleDateRangeChange = (value) => {
        const utcDateRange = value?.map(date => date.toISOString());
        setDate(utcDateRange);
    };

    const setDate = (range) => {
        if (range && range[0] && range[1]) {
            setStartDateTime(range[0]);
            setEndDateTime(range[1]);
        }
    };

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                localStorage.clear();
                //dispatch(resetState()); TODO
                navigate("/");
            })
            .catch((error) => {
                console.error("Error logging out:", error);
            });
    };

    const onEquipmentChange = (event) => {
        setSelectedEquipment(event.target.value);
        let eqp_id;
        filteredEquipments.forEach((item) => {
            if (item.eqp_name === event.target.value) {
                eqp_id = item.eqp_id;
            }
        })
        setSelectedEqpId(eqp_id);
    };

    const handleClick = () => {
        setNestedMenuOpen(!nestedMenuOpen);
    };

    return (
        // <LocomotiveScrollProvider options={{smooth: true}} containerRef={containerRef}>
        //     <main data-scroll-container ref={containerRef}>
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" open={open} sx={{ 
                background: userTheme?.colors?.colorShades?.[0] || '#063c6f',
                transition: 'background 0.3s ease' // Optional smooth transition
        }}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start" sx={{ marginRight: 5, ...(open && { display: 'none' }) }}>
                        <MenuIcon />
                        {/* <img src={Icon} alt="Company Icon" /> */}
                    </IconButton>
                    <img src={Icon} alt="Company Icon" style={{ width: "50px", height: "50px" }} />
                    <Typography variant="h5" component="div" sx={{ marginRight: "1vw" }}>{"EYES"}</Typography>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                        <TopLevelFilter />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={handleAvatarClick}>
                                <Avatar alt="User Avatar" src="/path/to/default-avatar.jpg" sx={{ marginRight: 1 }} aria-owns={openPopOver ? "mouse-over-popover" : undefined} aria-haspopup="true" ref={avatarRef} role="User Avatar" />
                            </Button>
                            <Box sx={{ flexGrow: 0 }}>
                                <Typography variant="h6" component="div" sx={{ marginRight: "1vw", fontFamily: "cursive" }}>{user.name}</Typography>
                                <Typography component="div" sx={{ marginRight: "1vw", fontSize: "15px" }}>{user.responsibility ? user.responsibility : 'Operator'}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader className='background-changer'>
                    <IconButton style={{ "background": "aliceblue" }} onClick={handleDrawerClose}> {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}</IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem key={1} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} onClick={() => navigate("/oee/usermgmt")}>
                            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                                <Person />
                            </ListItemIcon>
                            <ListItemText sx={{ opacity: open ? 1 : 0 }} primary="User Management" />
                        </ListItemButton>
                        <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} onClick={handleClick}>
                            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                                <Dashboard />
                            </ListItemIcon>
                            <ListItemText sx={{ opacity: open ? 1 : 0 }} primary="Dashboard" />
                            {/* {nestedMenuOpen ? <ExpandLess /> : <ExpandMore />} */}
                        </ListItemButton>
                        <Collapse in={nestedMenuOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {/* <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('dashboard/smt')}>
                                    <ListItemIcon>
                                        <Analytics />
                                    </ListItemIcon>
                                    <ListItemText primary="SMT Dashboard" />
                                </ListItemButton> */}
                                <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('dashboard/real-time')}>
                                    <ListItemIcon>
                                        <DynamicFeed />
                                    </ListItemIcon>
                                    <ListItemText primary="Real Time Dashboard" />
                                </ListItemButton>
                                {/* <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('dashboard/breakdown')}>
                                    <ListItemIcon>
                                        <Insights />
                                    </ListItemIcon>
                                    <ListItemText primary="Breakdown Analysis" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('dashboard/breakdown2')}>
                                    <ListItemIcon>
                                        <Dashboard />
                                    </ListItemIcon>
                                    <ListItemText primary="Breakdown Analysis (2)" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('dashboard/microstop')}>
                                    <ListItemIcon>
                                        <QueryStats />
                                    </ListItemIcon>
                                    <ListItemText primary="Microstop Analysis" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('dashboard/oee-accelerator')}>
                                    <ListItemIcon>
                                        <Speed />
                                    </ListItemIcon>
                                    <ListItemText primary="OEE Accelerator" />
                                </ListItemButton> */}
                                <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('dashboard/production-line-state-time')}>
                                    <ListItemIcon>
                                        <Timeline />
                                    </ListItemIcon>
                                    <ListItemText primary="Production Line State Time" />
                                </ListItemButton>
                            </List>
                        </Collapse>
                        {/* <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }}>
                            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                                <Settings />
                            </ListItemIcon>
                            <ListItemText sx={{ opacity: open ? 1 : 0 }} primary="Settings" />
                        </ListItemButton> */}
                    </ListItem>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Outlet />
            </Box>
            <Popover open={openPopOver} anchorEl={anchorEl} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} transformOrigin={{ vertical: "top", horizontal: "center" }} onClose={() => setAnchorEl(null)} id="mouse-over-popover">
                <Paper elevation={3} sx={{ minWidth: 200, padding: 2, backgroundColor: "#F4F5F7", textAlign: "center" }}>
                    <Box sx={{ marginBottom: 3 }}><Typography variant="body1" sx={{ fontWeight: "bold" }}>{user.email}</Typography></Box>
                    <Button variant="contained" onClick={handleLogout} sx={{ backgroundColor: "#063c6f", color: "white", "&:hover": { background: "#06009a" } }}>Log out</Button>
                </Paper>
            </Popover>
            <Popover open={openFilter} anchorEl={anchorEl2} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} transformOrigin={{ vertical: "top", horizontal: "center" }} onClose={() => setAnchorEl2(null)} id="eqp-eqpt-filter">
                <Paper elevation={3} sx={{ minWidth: 300, padding: 2, backgroundColor: "#F4F5F7", textAlign: "center" }}>
                    <FormControl variant="outlined" sx={{ minWidth: 150, width: "30%" }} size="small">
                        <InputLabel id="equipment-type-select">Equipment Type</InputLabel>
                        <Select labelId="equipment-type-select" id="equipment-type-select" input={<OutlinedInput label="Equipment Type" />} renderValue={(selected) => selected} MenuProps={MenuProps} value={selectedEquipmentType} onChange={(event) => (setSelectedEquipmentType(event.target.value), setSelectedEquipment(''))}>
                            {equipmentData?.map((equipmentType, i) => (<MenuItem key={i} value={equipmentType.equipment_type_name}>{equipmentType.equipment_type_name}</MenuItem>))}
                        </Select>
                    </FormControl>
                    <FormControl disabled={selectedEquipmentType.length === 0 ? true : false} variant="outlined" sx={{ minWidth: 150, width: "30%" }} size="small">
                        <InputLabel htmlFor="equipment-select">Equipment</InputLabel>
                        <Select labelId="equipment-select" label="Equipment" id="equipment-select" input={<OutlinedInput label="Equipment" />} MenuProps={MenuProps} value={selectedEquipment} onChange={(event) => { onEquipmentChange(event) }}>
                            {filteredEquipments?.map((equipment, j) => (<MenuItem key={j} value={equipment.eqp_name}>{equipment.eqp_name}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Paper>
            </Popover>
        </Box>
        //     </main>
        // </LocomotiveScrollProvider >
    );
}
