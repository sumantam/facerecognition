DROP PROCEDURE IF EXISTS createEventTable;
DROP PROCEDURE IF EXISTS createLastEventCheckpointTable;
DROP PROCEDURE IF EXISTS addEvent;

-- Procedure to create the Event table
CREATE OR REPLACE PROCEDURE createLastEventCheckpointTable(
    schemaName VARCHAR DEFAULT 'public'
)
LANGUAGE plpgsql AS $$
DECLARE
    create_chkpoint_command TEXT;
BEGIN
    create_chkpoint_command := format('
        CREATE TABLE IF NOT EXISTS %I."LastEventCheckpoint" (
            id SERIAL PRIMARY KEY,
            last_event_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );', schemaName
    );

    RAISE NOTICE 'Executing: %', create_chkpoint_command;
    EXECUTE create_chkpoint_command;
END;
$$;



-- Procedure to create the Event table
CREATE OR REPLACE PROCEDURE createEventTable(
    schemaName VARCHAR DEFAULT 'public'
)
LANGUAGE plpgsql AS $$
DECLARE
    create_event_command TEXT;
BEGIN
    RAISE NOTICE 'Inside the procedure createEventTable';

    create_event_command := format('
        CREATE TABLE IF NOT EXISTS %I."Event" (
            id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            empID INTEGER,
            name VARCHAR(255) NOT NULL,
            cardNo VARCHAR(255) NOT NULL,
            eventTypes VARCHAR(255) NOT NULL,
            eventTime TIMESTAMP NOT NULL,
            last_event_time TIMESTAMP NOT NULL
        );', schemaName
    );

    RAISE NOTICE 'Executing: %', create_event_command;
    EXECUTE create_event_command;
END;
$$;

-- Procedure to add an event
CREATE OR REPLACE PROCEDURE addEvent(
    empID VARCHAR,
    name VARCHAR(255),
    cardNo VARCHAR(255),
    eventTypes VARCHAR(255),
    eventTime TIMESTAMP WITH TIME ZONE,
    last_event_time TIMESTAMP WITH TIME ZONE,
    schemaName VARCHAR DEFAULT 'public'
)
LANGUAGE plpgsql AS $$
DECLARE
    add_event_command TEXT;
    empID_INT INTEGER;
BEGIN
    empID_INT := empID::INTEGER;

    add_event_command := format('
        INSERT INTO %I."Event" (
            empID,
            name,
            cardNo,
            eventTypes,
            eventTime,
            last_event_time
        ) VALUES ($1, $2, $3, $4, $5, $6);', schemaName
    );

    RAISE NOTICE 'Executing: %', add_event_command;
    EXECUTE add_event_command 
    USING empID_INT, name, cardNo, eventTypes, eventTime, last_event_time;
END;
$$;
