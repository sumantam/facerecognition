DROP PROCEDURE IF EXISTS createDeviceTable;

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
