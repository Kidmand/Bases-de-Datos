USE `newdata`;

DROP TABLE if exists city;
DROP TABLE if exists countrylanguage;
DROP TABLE if exists country;
DROP TABLE if exists continent;



-- Crear la tabla `continent`
CREATE TABLE continent (
    Name varchar(255) NOT NULL,
    Area int,
    `Percent total mass` numeric(8, 2),
    `Most populous city` varchar(255),
    PRIMARY KEY (Name)
);

-- Crear la tabla `country`
CREATE TABLE country (
    Code varchar(255) NOT NULL,
    Name varchar(255),
    Continent varchar(255),
    Region varchar(255),
    SurfaceArea int,
    IndepYear int,
    Population int,
    LifeExpentancy int,
    GNP int,
    GNPOld int,
    LocalName varchar(255),
    GovernmentForm varchar(255),
    HeadOfState varchar(255),
    Capital int,
    Code2 varchar(255),
    PRIMARY KEY (Code),
    FOREIGN KEY (Continent) REFERENCES continent(Name)
);

-- Crear la tabla `city`
CREATE TABLE city (
    ID int NOT NULL,
    Name varchar(255),
    CountryCode varchar(255),
    District varchar(255),
    Population int,
    PRIMARY KEY (ID),
    FOREIGN KEY (CountryCode) REFERENCES country(Code)
);

-- Crear la tabla `countrylanguage`
CREATE TABLE countrylanguage (
    CountryCode varchar(255) NOT NULL,
    Language varchar(255) NOT NULL,
    IsOficial varchar(255),
    Percentage int,
    PRIMARY KEY (CountryCode, Language),
    FOREIGN KEY (CountryCode) REFERENCES country(Code)
);

 
