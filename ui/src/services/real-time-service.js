import { getWithMainThread, update } from "./service-base";

const getRealTimeDataAndStat = async () => {
    // return await getWithMainThread(`cycleTime/realTimeDataAndStats`);

    // try {
    //     const response = await getWithMainThread(`cycleTime/realTimeDataAndStats`);
    //     return response;
    // } catch (e) {
    // console.warn("Falling back to dummy real-time data:", e.message);

    return {
        data: {
            realTimeDataAndStat: {
                stats: {
                    avgCycleTime: 1200,
                    totalCount: 1000,
                    totalGoodCount: 800,
                    totalBadCount: 150,
                    totalUnknown: 50,
                },
                data: [
                    {
                        machineName: "Machine A",
                        status: "Running",
                        cycleTime: 1180,
                        timestamp: "2025-05-23T10:20:00Z",
                    },
                    {
                        machineName: "Machine B",
                        status: "Stopped",
                        cycleTime: 0,
                        timestamp: "2025-05-23T10:21:00Z",
                    },
                    {
                        machineName: "Machine C",
                        status: "Running",
                        cycleTime: 1220,
                        timestamp: "2025-05-23T10:22:00Z",
                    },
                ],
            },
        },
    };

    // }
};

const getStdCycleTime = async () => {

    // try {
    //     const response = await getWithMainThread(`cycleTime/stdCycleTime`);
    //     return response;
    // } catch (e) {
    //     console.warn("Falling back to dummy std cycle time:", e.message);
    return {
        data: {
            stdCycleTime: {
                MachineA: 15,
                MachineB: 20,
            },
        },
    };
    // }
    // return await getWithMainThread(`cycleTime/stdCycleTime`);
};

const updateStdCycleTime = async (newStdCycleTime) => {
    return await update(`cycleTime/updateStdCycleTime`, { "newStdCycleTime": newStdCycleTime });
};

const RealTimeService = {
    getRealTimeDataAndStat,
    updateStdCycleTime,
    getStdCycleTime
}

export default RealTimeService;