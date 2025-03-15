DROP PROCEDURE IF EXISTS createDeviceTable;
DROP PROCEDURE IF EXISTS addDevice;

CREATE OR REPLACE PROCEDURE addDevice(
    deviceID INTEGER,
    branchName VARCHAR,
    branchCode INTEGER,
    deviceSerialNo VARCHAR,
    deviceModel VARCHAR,
    deviceIP VARCHAR,
    location VARCHAR(255),
    deviceStatus VARCHAR,   
    schemaName VARCHAR DEFAULT 'public'
)
LANGUAGE plpgsql AS $$
DECLARE
    add_device_command TEXT;
BEGIN
    add_device_command := format('
        INSERT INTO %I."Device" (
            deviceID,
            branchName,
            branchCode,
            deviceSerialNo,
            deviceModel,
            deviceIP,
            location,
            deviceStatus        
        )                                                                                                                                      
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);                                                                                                                                  
        ', schemaName
    );

    -- Print the command
    RAISE NOTICE 'Executing: %', add_device_command;

    -- Execute the command
    EXECUTE add_device_command 
    USING deviceID, branchName, branchCode, deviceSerialNo, deviceModel, deviceIP, location, deviceStatus;
END;
$$;



CREATE OR REPLACE PROCEDURE createDeviceTable(
    schemaName VARCHAR DEFAULT 'public'
)
LANGUAGE plpgsql AS $$
DECLARE
    create_device_command TEXT;
BEGIN
    create_device_command := format('
        CREATE TABLE IF NOT EXISTS %I."Devices" (
            deviceID INTEGER PRIMARY KEY,
            branchName VARCHAR NOT NULL,
            branchCode INTEGER NOT NULL,
            deviceSerialNo VARCHAR,
            deviceModel VARCHAR,
            deviceIP VARCHAR NOT NULL,
            location VARCHAR(255) NOT NULL,
            deviceStatus VARCHAR NOT NULL
        );', schemaName
    );

    -- Print the command
    RAISE NOTICE 'Executing: %', create_device_command;

    -- Execute the command
    EXECUTE create_device_command;
END;
$$;
