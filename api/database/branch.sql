DROP PROCEDURE IF EXISTS createBranchTable;
DROP PROCEDURE IF EXISTS addBranch;

CREATE OR REPLACE PROCEDURE addBranch(
    branchID INTEGER,
    branchName VARCHAR,
    location VARCHAR(255),
    branchAddress VARCHAR,
    branchMedium VARCHAR,  
    schemaName VARCHAR DEFAULT 'public'
)
LANGUAGE plpgsql AS $$
DECLARE
    add_branch_command TEXT;
BEGIN
    add_branch_command := format('
        INSERT INTO %I."Branch" (
            branchID,
            branchName,
            location,
            branchAddress,
            branchMedium
        )                                                                                                                                      
        VALUES ($1, $2, $3, $4, $5);                                                                                                                                  
        ', schemaName
    );

    -- Print the command
    RAISE NOTICE 'Executing: %', add_branch_command;

    -- Execute the command
    EXECUTE add_branch_command 
    USING   branchID, branchName, location, branchAddress, branchMedium;
END;
$$;


CREATE OR REPLACE PROCEDURE createBranchTable(
    schemaName VARCHAR DEFAULT 'public'
)
LANGUAGE plpgsql AS $$
DECLARE
    create_branch_command TEXT;
BEGIN
    create_branch_command := format('
        CREATE TABLE IF NOT EXISTS %I."Branch" (
            branchID INTEGER PRIMARY KEY,
            branchName VARCHAR NOT NULL,
            location VARCHAR(255) NOT NULL,
            branchAddress VARCHAR NOT NULL,
            branchMedium VARCHAR NOT NULL
        );', schemaName
    );

    -- Print the command
    RAISE NOTICE 'Executing: %', create_branch_command;

    -- Execute the command
    EXECUTE create_branch_command;
END;
$$;
