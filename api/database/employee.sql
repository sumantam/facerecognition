DROP PROCEDURE IF EXISTS createEmployeeTable;
DROP PROCEDURE IF EXISTS addEmployee;

CREATE OR REPLACE PROCEDURE addEmployee(
    empID INTEGER,
    email VARCHAR(255),
    name VARCHAR(255),
    branchName VARCHAR,
    branchCode INTEGER,
    location VARCHAR(255),
    mobileNumber VARCHAR(255),
    img JSONB,    
    schemaName VARCHAR DEFAULT 'public'
)
LANGUAGE plpgsql AS $$
DECLARE
    add_employee_command TEXT;
BEGIN
    add_employee_command := format('
        INSERT INTO %I."Employee" (
            empID,
            email,
            name,
            branchName,
            branchCode,
            location,
            mobileNumber,
            img
        )                                                                                                                                      
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);                                                                                                                                  
        ', schemaName
    );

    -- Print the command
    RAISE NOTICE 'Executing: %', add_employee_command;

    -- Execute the command
    EXECUTE add_employee_command 
    USING empID, email, name, branchName, branchCode, location, mobileNumber, img;
END;
$$;


CREATE OR REPLACE PROCEDURE createEmployeeTable(
    schemaName VARCHAR DEFAULT 'public'
)
LANGUAGE plpgsql AS $$
DECLARE
    create_employee_command TEXT;
BEGIN
    create_employee_command := format('
        CREATE TABLE IF NOT EXISTS %I."Employee" (
            empID INTEGER PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            branchName VARCHAR NOT NULL,
            branchCode INTEGER NOT NULL,
            role VARCHAR(255) NOT NULL DEFAULT ''User'',
            designation VARCHAR(255) DEFAULT ''Staff'',
            countryCode VARCHAR(10) NOT NULL DEFAULT ''+91'',
            mobileNumber VARCHAR(20) NOT NULL,
            img JSONB DEFAULT ''{}'',
            location VARCHAR(255) NOT NULL
        );', schemaName
    );

    -- Print the command
    RAISE NOTICE 'Executing: %', create_employee_command;

    -- Execute the command
    EXECUTE create_employee_command;
END;
$$;
