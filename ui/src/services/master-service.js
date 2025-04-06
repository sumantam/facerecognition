import { getJsonData } from "./service-base";
import Shift from "../models/shift";
import { getWithMainThread } from "./service-base";

const getPlants2 = async () => {
  return await getWithMainThread('access/plants');
};

const getLines2 = async (plant = "Chennai") => {
  return await getWithMainThread(`access/lines/${plant}`);
};

const getShifts = async (line) => {
  const jsonData = await getJsonData();
  const shifts = [];
  const filteredShifts = jsonData["Line_Shift_Times"].filter(
    (i) => i["Line"] === line
  );
  filteredShifts.map((i) =>
    shifts.push(
      new Shift(
        i["id"],
        i["Shift_Name"],
        i["Start"],
        i["End"],
        i["Shift_Owner"],
        line
      )
    )
  );
  return shifts;
};

const MasterService = {
  getPlants2,
  getLines2,
  getShifts,
};

export default MasterService;
