USE `olympics`;

SELECT * FROM `person`;

ALTER TABLE person
ADD COLUMN total_medals INT DEFAULT 0;