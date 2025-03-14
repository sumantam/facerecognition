DROP PROCEDURE IF EXISTS createUserTable;

CREATE OR REPLACE PROCEDURE createUserTable(
    schemaName VARCHAR DEFAULT 'public'
)
LANGUAGE plpgsql AS $$
DECLARE
    create_user_command TEXT;
BEGIN
    create_user_command := format('
        CREATE TABLE IF NOT EXISTS %I."Users" (
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
    RAISE NOTICE 'Executing: %', create_user_command;

    -- Execute the command
    EXECUTE create_user_command;
END;
$$;
