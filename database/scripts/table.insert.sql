-- insert order status
INSERT INTO "Status" ("statusId","status") VALUES 
(1,'STATIONARY');
INSERT INTO "Status" ("statusId","status") VALUES 
(2,'IN-TRANSIT REQUESTED');
INSERT INTO "Status" ("statusId","status") VALUES 
(3,'STATIONARY DOOR OPEN PICKUP');
INSERT INTO "Status" ("statusId","status") VALUES 
(4,'STATIONARY DOOR CLOSE PICKUP');
INSERT INTO "Status" ("statusId","status") VALUES 
(5,'IN-TRANSIT TARGET');
INSERT INTO "Status" ("statusId","status") VALUES 
(6,'STATIONARY DOOR OPEN DROPOFF');
INSERT INTO "Status" ("statusId","status") VALUES 
(7,'STATIONARY DOOR CLOSE DROPOFF');

ALTER SEQUENCE "Status_statusId_seq" RESTART WITH 8;