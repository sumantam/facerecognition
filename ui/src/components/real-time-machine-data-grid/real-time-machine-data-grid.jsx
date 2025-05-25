import { Box, CircularProgress } from '@mui/material';
import { ReportProblem } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import './real-time-machine-data-grid.css';

const RealTimeMachineData = ({ data, fontFamily, redGradientColor, greenGradientColor, yellowGradientColor, isExpanded = true }) => {
    const columns = [
        {
            field: 'pId',
            headerName: 'Product Id',
            headerClassName: 'custom-machine-grid-header',
            minWidth: 120,
            flex: isExpanded ? 1 : 0,
            renderCell: (params) => {
                <div style={{ fontFamily: fontFamily }}>{params.value}</div>
            }
        },
        {
            field: 'm1Id',
            headerName: 'M1 Id',
            headerClassName: 'custom-machine-grid-header',
            minWidth: 120,
            flex: isExpanded ? 1 : 0,
            renderCell: (params) => {
                <div style={{ fontFamily: fontFamily }}>{params.value}</div>
            }
        },
        {
            field: 'm1EntryTime',
            headerName: 'M1 Entry time',
            headerClassName: 'custom-action-grid-header',
            minWidth: 120,
            flex: isExpanded ? 1 : 0,
            renderCell: (params) => {
                <div style={{ fontFamily: fontFamily }}>{new Date(params.value)}</div>
            }
        },
        {
            field: 'm1ExitTime',
            headerName: 'M1 Exit time',
            headerClassName: 'custom-action-grid-header',
            minWidth: 120,
            flex: isExpanded ? 1 : 0,
            renderCell: (params) => {
                <div style={{ fontFamily: fontFamily }}>{new Date(params.value)}</div>
            }
        },
        {
            field: 'm2Id',
            headerName: 'M2 Id',
            headerClassName: 'custom-machine-grid-header',
            minWidth: 120,
            flex: isExpanded ? 1 : 0,
            renderCell: (params) => {
                <div style={{ fontFamily: fontFamily }}>{params.value}</div>
            }
        },
        {
            field: 'm2EntryTime',
            headerName: 'M2 Entry time',
            headerClassName: 'custom-action-grid-header',
            minWidth: 120,
            flex: isExpanded ? 1 : 0,
            renderCell: (params) => {
                <div style={{ fontFamily: fontFamily }}>{new Date(params.value)}</div>
            }
        },
        {
            field: 'm2ExitTime',
            headerName: 'M2 Exit time',
            headerClassName: 'custom-action-grid-header',
            minWidth: 120,
            flex: isExpanded ? 1 : 0,
            renderCell: (params) => {
                <div style={{ fontFamily: fontFamily }}>{new Date(params.value)}</div>
            }
        },
        {
            field: 'm3Id',
            headerName: 'M3 Id',
            headerClassName: 'custom-machine-grid-header',
            minWidth: 120,
            flex: isExpanded ? 1 : 0,
            renderCell: (params) => {
                <div style={{ fontFamily: fontFamily }}>{params.value}</div>
            }
        },
        {
            field: 'm3EntryTime',
            headerName: 'M3 Entry time',
            headerClassName: 'custom-action-grid-header',
            minWidth: 120,
            flex: isExpanded ? 1 : 0,
            renderCell: (params) => {
                <div style={{ fontFamily: fontFamily }}>{new Date(params.value)}</div>
            }
        },
        {
            field: 'm3ExitTime',
            headerName: 'M3 Exit time',
            headerClassName: 'custom-action-grid-header',
            minWidth: 120,
            flex: isExpanded ? 1 : 0,
            renderCell: (params) => {
                <div style={{ fontFamily: fontFamily }}>{new Date(params.value)}</div>
            }
        },
        {
            field: 'isOk',
            headerName: 'Is OK',
            headerClassName: 'custom-action-grid-header',
            minWidth: 120,
            flex: isExpanded ? 1 : 0,
            renderCell: (params) => {
                return params["row"]["isRunGoing"] ? <div style={{ textAlign: "center" }}><CircularProgress color="inherit" size={30} /></div> :
                    params.value === "Y" ? <div style={{ background: greenGradientColor[1], "textAlign": "center", "display": "list-item" }}>
                        {params.value}
                    </div> :
                        params.value === "N" ? <div style={{ background: redGradientColor[1], "textAlign": "center", "display": "list-item" }}>
                            {params.value}
                        </div> :
                            <div style={{ background: yellowGradientColor[1], "textAlign": "center" }}>
                                <ReportProblem style={{ marginTop: "0.7rem" }} />
                            </div>
            }
        }
    ];
    return (
        <Box flexGrow={1} style={{ width: '100%', height: '50vh', maxHeight: '100%' }}>
            <DataGrid
                getRowId={() => randomId()}
                rows={[...data].reverse()}
                columns={columns}
                hideFooterPagination={true}
                disableRowSelectionOnClick
            />
        </Box >
    );
};

export default RealTimeMachineData;