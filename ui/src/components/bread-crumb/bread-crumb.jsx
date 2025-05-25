import { useDispatch, useSelector } from "react-redux";
import {
  breadCrumbPathSelector,
  removePath,
} from "../../reducers/bread-crumb-reducer";
import { Box, Link, Typography } from "@mui/material";
//import { Icon } from "@mui/material/Icon";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

import BugReportIcon from "@mui/icons-material/BugReport";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import BalanceIcon from "@mui/icons-material/Balance";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { themeSelector } from '../../reducers/filter-reducer';

function BreadCrumb() {
  const paths = useSelector(breadCrumbPathSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector(themeSelector);

  const handleNavigation = async (path) => {
    const index = paths.indexOf(path);
    if (index === paths.length - 1) return;
    dispatch(removePath(index));
    navigate(path.path);
  };

  return (
    <Box flexGrow={1}>
      <div>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {paths.map((path, i) => {
            return (
              <div key={i}>
                <Link underline="hover" color="inherit" onClick={() => handleNavigation(path)} title={path.name} sx={{ cursor: "pointer" }}>
                  <Typography style={{ fontFamily: theme["fontFamily"] }}>
                    {path.name}
                  </Typography>
                </Link>
              </div>
            );
          })}
        </Breadcrumbs>

      </div>
    </Box>
  );
}

export default BreadCrumb;
