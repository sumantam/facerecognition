DROP PROCEDURE IF EXISTS createBranchTable;

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
