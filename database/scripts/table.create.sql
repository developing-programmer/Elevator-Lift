-- All scripts for table creation will go here

-- Status Table
CREATE TABLE IF NOT EXISTS "Status" (
    "statusId"  SERIAL , 
    "status" VARCHAR(100),  
    PRIMARY KEY ("statusId")
    ); 

-- ElevatorState
CREATE TABLE IF NOT EXISTS "ElevatorState" (
"elevatorId"  SERIAL ,
"currentFloor" INTEGER NOT NULL, 
"statusId" INTEGER NOT NULL REFERENCES "Status" ("statusId") ON DELETE NO ACTION ON UPDATE CASCADE,
"direction" VARCHAR(100),
"targetFloor" INTEGER, 
"active" BOOLEAN NOT NULL, 
"queue" JSONB,
"updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), 
PRIMARY KEY ("elevatorId"));

-- ElevatorLog
CREATE TABLE IF NOT EXISTS "ElevatorLog" (
"elevatorLogId"  SERIAL,
"elevatorId"  INTEGER NOT NULL REFERENCES "ElevatorState" ("elevatorId") ON DELETE NO ACTION ON UPDATE CASCADE,
"currentFloor" INTEGER NOT NULL, 
"statusId" INTEGER NOT NULL REFERENCES "Status" ("statusId") ON DELETE NO ACTION ON UPDATE CASCADE,
"direction" VARCHAR(100),
"targetFloor" INTEGER, 
"log" VARCHAR(100),
"createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
"updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), 
PRIMARY KEY ("elevatorLogId"));

CREATE TABLE IF NOT EXISTS "SQLLog" (
"sqlLogId" SERIAL,
"log" VARCHAR(100),
"createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
"updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), 
PRIMARY KEY ("sqlLogId"));

