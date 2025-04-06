import { Box, FormControl, FormControlLabel, Switch, InputLabel, MenuItem, Select, Stack, Button } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import "./top-level-filter.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlants,
  plantsSelector,
  plantSelector,
  tqSelector,
  themeSelector,
  refreshButtonVisibilitySelector,
  setPlantFilter,
  setPlantNameFilter,
  setTqFilter,
  setThemeFilter,
  setGeoData,
  setDateFilter
} from "../../reducers/filter-reducer";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import { useNavigate } from "react-router-dom";
import { removePath } from "../../reducers/bread-crumb-reducer";
import themes from "../../theme";
import userService from "../../services/user-service";

const TopLevelFilter = () => {
  const navigate = useNavigate();
  //const timeQs = useSelector(timeQsSelector);
  const theme = useSelector(themeSelector);
  const tq = useSelector(tqSelector);
  const isRefreshButtonVisible = useSelector(refreshButtonVisibilitySelector);
  const [selectedTheme, setSelectedTheme] = useState("Theme 8");
  const plants = useSelector(plantsSelector);
  const selectedPlant = useSelector(plantSelector);

  const setIsLatestDataLoading = () => {
    setDateParam();
  };

  const setDateParam = async () => {
    let locLastDate = await userService.getLastDate();
    let date = locLastDate["data"]["lastDate"];
    dispatch(setDateFilter(new Date(date)));
    // dispatch(fetchPlants());
  }


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPlants());
    dispatch(setThemeFilter(themes.find(i => i.title === selectedTheme)));
    dispatch(setGeoData(am5geodata_worldLow));
  }, [dispatch, selectedTheme]);

  const handlePlantChange = async (event) => {
    dispatch(setPlantFilter(event.target.value));
    dispatch(setPlantNameFilter(plants.find(i => i.Id === event.target.value).Name));
  };

  const handleTqChange = async (event) => {
    dispatch(setTqFilter(event.target.value));
  };

  const handleThemeChange = async (event) => {
    setSelectedTheme(event.target.value);
    dispatch(setThemeFilter(themes.find(i => i.title === event.target.value)));
  }

  return (
    <Box
      sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
      className="custom-filter-container"
    >
      {isRefreshButtonVisible ?
        <FormControl>
          <Button variant="contained" startIcon={<Refresh />} onClick={setIsLatestDataLoading} sx={{ background: theme["colors"]["colorShades"][7] }}>
            Refresh with latest data
          </Button>
        </FormControl> : <></>}
      <FormControl>
        <InputLabel id="theme-lbl">Theme</InputLabel>
        <Select
          labelId="theme-lbl"
          id="ddlTheme"
          className="custom-filter-select"
          value={selectedTheme}
          label="Theme"
          onChange={handleThemeChange}
        >
          {themes.map(item => (
            <MenuItem key={item["title"]} value={item["title"]}>
              <Stack direction="row" spacing={1}>
                <div>{item["title"]}</div>
                <div>
                  <img src={item["imageUrl"]} width={40} height={15} alt="Theme Colors Band" />
                </div>
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedPlant ? (
        <FormControl>
          <InputLabel id="tq-lbl">Time</InputLabel>
          <Select
            labelId="tq-lbl"
            id="ddlTq"
            className="custom-filter-select"
            value={tq}
            label="Time"
            onChange={handleTqChange}
          >
            <MenuItem key={'day'} value={'day'}>
              Last Day
            </MenuItem>
            <MenuItem key={'week'} value={'week'}>
              Last Week
            </MenuItem>
            <MenuItem key={'month'} value={'month'}>
              Last Month
            </MenuItem>
            {/* <MenuItem key={'year'} value={'year'}>
              Last Year
            </MenuItem> */}
          </Select>
        </FormControl>
      ) : (
        <></>
      )}

      {selectedPlant && plants.length > 0 ? (
        <FormControl>
          <InputLabel id="plant-lbl">Plant</InputLabel>
          <Select
            labelId="plant-lbl"
            id="ddlPlant"
            className="custom-filter-select"
            value={selectedPlant}
            label="Plant"
            onChange={handlePlantChange}
          >
            {plants.map((item, i) => (
              <MenuItem key={i} value={item.Id}>
                {item.Name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default TopLevelFilter;
