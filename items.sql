DROP DATABASE IF EXISTS items_db;

CREATE DATABASE items_db;

USE items_db;

CREATE TABLE items (
    itemName VARCHAR(30),
    curBid INT,
    bidName VARCHAR(30)
);

INSERT INTO items (itemName, curBid, bidName) 
VALUES ("Space pen", 5, "Devon");

INSERT INTO items (itemName, curBid, bidName) 
VALUES ("Mug", 500, "Nora");

INSERT INTO items (itemName, curBid, bidName) 
VALUES ("Octopus", 501, "Beni");
