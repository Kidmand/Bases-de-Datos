USE `newdata`;

-- Consultas de tablas.
SELECT * FROM continent;
SELECT * FROM city;
SELECT * FROM country;
SELECT * FROM countrylanguage;

-- Devuelva una lista de los nombres y las regiones a las que pertenece cada país ordenada alfabéticamente.
SELECT Name, Region
FROM country
ORDER BY Name ASC, Region ASC

-- Liste el nombre y la población de las 10 ciudades más pobladas del mundo.
SELECT Name, Population
FROM city
ORDER BY Population DESC
LIMIT 10;

-- Liste el nombre, región, superficie y forma de gobierno de los 10 países con menor superficie.
SELECT Name, Region, SurfaceArea, GovernmentForm
FROM country
ORDER BY SurfaceArea ASC 
LIMIT 10;

-- Liste todos los países que no tienen independencia (hint: ver que define la independencia de un país en la BD).
SELECT Name, GovernmentForm
FROM country
WHERE GovernmentForm LIKE '%Dependent Territory of the UK%';

-- Liste el nombre y el porcentaje de hablantes que tienen todos los idiomas declarados oficiales
SELECT CountryCode, Language, Percentage
FROM countrylanguage
WHERE IsOficial LIKE 'T';

-- Actualizar el valor de porcentaje del idioma inglés en el país con código 'AIA' a 100.0.
UPDATE countrylanguage SET Percentage = 100.0 
WHERE CountryCode = 'AIA' AND LANGUAGE = 'English';

-- Listar las ciudades que pertenecen a Córdoba (District) dentro de Argentina.
SELECT Name, CountryCode, District
FROM city
WHERE District = 'Córdoba' AND CountryCode = 'ARG';

-- Eliminar todas las ciudades que pertenezcan a Córdoba fuera de Argentina.
DELETE FROM city
WHERE District = 'Córdoba' AND CountryCode != 'ARG';

-- Listar los países cuyo Jefe de Estado se llame John
SELECT Name, HeadOfState 
FROM country
where HeadOfState LIKE '%John%';

-- Listar los países cuya población esté entre 35 M y 45 M ordenados por población de forma descendente.
SELECT  Name, Population
FROM country
WHERE Population BETWEEN 35000000 AND 45000000
ORDER BY Population DESC;

-- Práctico 3.

-- Lista el nombre de la ciudad, nombre del país, región y forma de gobierno de las 10 ciudades más pobladas del mundo.
SELECT 
city.Name AS CityName,
country.Name AS CountryName,
country.Region,
country.GovernmentForm
FROM city
INNER JOIN country ON city.CountryCode = country.Code
ORDER BY city.Population DESC
LIMIT 10;

-- Listar los 10 países con menor población del mundo, junto a sus ciudades capitales 
-- (Hint: puede que uno de estos países no tenga ciudad capital asignada, en este caso deberá mostrar "NULL").
SELECT 
country.Name AS CountryName,
city.Name AS NameCapitalCity,
country.Population
FROM country
LEFT JOIN city ON city.ID = country.Capital
ORDER BY city.Population ASC
LIMIT 10;

-- Listar el nombre, continente y todos los lenguajes oficiales de cada país. 
-- (Hint: habrá más de una fila por país si tiene varios idiomas oficiales).
SELECT 
country.Name,
country.Continent,
countrylanguage.Language
FROM country
INNER JOIN countrylanguage ON country.Code = countrylanguage.CountryCode
WHERE countrylanguage.IsOficial = 'T';

-- Listar el nombre del país y nombre de capital, de los 20 países con mayor superficie del mundo.
SELECT 
country.Name AS CountryName,
city.Name AS CapitalName
FROM country
LEFT JOIN city ON country.Capital = city.ID
ORDER BY country.SurfaceArea DESC 
LIMIT 20;

-- Listar las ciudades junto a sus idiomas oficiales (ordenado por la población de la ciudad) 
-- y el porcentaje de hablantes del idioma.
SELECT 
city.Name AS CityName,
countrylanguage.Language AS OficialLanguage,
countrylanguage.Percentage
FROM city
INNER JOIN countrylanguage ON city.CountryCode = countrylanguage.CountryCode
WHERE countrylanguage.IsOficial = 'T'
ORDER BY city.Population DESC, countrylanguage.Percentage;

SELECT 

-- Listar los 10 países con mayor población y los 10 países con menor población 
-- (que tengan al menos 100 habitantes) en la misma consulta.
(
SELECT Name, Population 
FROM country
WHERE Population >= 100
ORDER BY Population DESC
LIMIT 10
)

UNION ALL

(
SELECT Name, Population 
FROM country
WHERE Population >= 100
ORDER BY Population ASC
LIMIT 10
);

-- Listar aquellos países cuyos lenguajes oficiales son el Inglés y el Francés 
-- (hint: no debería haber filas duplicadas).
(
SELECT 
country.Name AS CityName
FROM country
INNER JOIN countrylanguage ON country.Code = countrylanguage.CountryCode
WHERE countrylanguage.Language = 'English'
AND countrylanguage.IsOficial = 'T'
)

INTERSECT

(
SELECT 
country.Name AS CityName
FROM country
INNER JOIN countrylanguage ON country.Code = countrylanguage.CountryCode
WHERE countrylanguage.Language = 'French'
AND countrylanguage.IsOficial = 'T'
);

-- Listar aquellos países que tengan hablantes del Inglés pero no del Español en su población.

(
SELECT 
country.Name AS CityName
FROM country
INNER JOIN countrylanguage ON country.Code = countrylanguage.CountryCode
WHERE countrylanguage.Language = 'English'
AND countrylanguage.IsOficial = 'T'
)

EXCEPT

(
SELECT 
country.Name AS CityName
FROM country
INNER JOIN countrylanguage ON country.Code = countrylanguage.CountryCode
WHERE countrylanguage.Language = 'Spanish'
AND countrylanguage.IsOficial = 'T'
);


-- Parte 2 del trabajo práctico 3.

-- ¿Devuelven los mismos valores las siguientes consultas? ¿Por qué? 

SELECT city.Name, country.Name
FROM city
INNER JOIN country ON city.CountryCode = country.Code AND country.Name = 'Argentina';


SELECT city.Name, country.Name
FROM city
INNER JOIN country ON city.CountryCode = country.Code
WHERE country.Name = 'Argentina';

-- Pruebo con LEFT JOIN para ver que es lo que sucede.

SELECT city.Name, country.Name
FROM city
LEFT JOIN country ON city.CountryCode = country.Code AND country.Name = 'Argentina';

-- Estas dos consultas devuelven lo mismo, ya que la condición del INNER JOIN actúa como un WHERE. 
-- Es decir, se seleccionan los datos de ambos conjuntos que cumple con la condición del INNER JOIN.


SELECT city.Name, country.Name
FROM city
LEFT JOIN country ON city.CountryCode = country.Code
WHERE country.Name = 'Argentina';

-- No me devuleven los mismo resultados, porque en la primera parte selecionamos todo el 
-- conjunto de las ciudades, y luego seleccionamos el pais que cumple con la condición del LEFT JOIN.
-- En cambio, cuando hacemo WHERE country.Name = 'Argentina' etsamos restrigiendo el conjunto solo 
-- a las ciudades de Argentina y ninguna otra más.


-- Práctico 4. 


-- Listar el nombre de la ciudad y el nombre del país de todas las ciudades que pertenezcan a países 
-- con una población menor a 10000 habitantes.

SELECT 
city.Name AS cityName, 
country.Name AS countryName,
city.Population,
country.Continent
FROM city 
INNER JOIN country ON city.CountryCode = country.Code
WHERE 
    city.CountryCode IN (
        SELECT Code
        FROM country
        WHERE Population < 10000
    );

 -- Listar todas aquellas ciudades cuya población sea mayor que la población promedio entre todas las ciudades
   
SELECT 
Name,
Population
FROM city
WHERE Population > (
		SELECT AVG(Population)
		FROM city
	);


 -- Listar todas aquellas ciudades no asiáticas cuya población sea igual o mayor a la población total de algún país de Asia.
   
SELECT city.Name, 
city.Population
FROM city
INNER JOIN country ON city.CountryCode = country.Code
WHERE 
   	country.Continent != 'Asia' 
   	AND city.Population >= SOME (
   		SELECT Population
   		FROM country
   		WHERE Continent = 'Asia'
	);
   	
-- Listar aquellos países junto a sus idiomas no oficiales, 
-- que superen en porcentaje de hablantes a cada uno de los idiomas oficiales del país.
   	
SELECT country.Name, 
countrylanguage.Language
FROM country 
INNER JOIN countrylanguage ON country.Code = countrylanguage.CountryCode
WHERE countrylanguage.IsOficial = 'F' 
AND countrylanguage.Percentage > ALL (
   	SELECT Percentage
   	FROM countrylanguage
   	WHERE IsOficial = 'T' 
   	AND CountryCode = country.Code
   ); 
   	
-- Listar (sin duplicados) aquellas regiones que tengan países con una superficie menor a 1000 km2 
-- y exista (en el país) al menos una ciudad con más de 100000 habitantes. 
-- (Hint: Esto puede resolverse con o sin una subquery, intenten encontrar ambas 

SELECT DISTINCT country.Region,
country.Name
FROM country 
WHERE country.SurfaceArea < 1000 
	AND EXISTS (
		SELECT Name
		FROM city
		WHERE Population > 100000 
		AND city.CountryCode = country.Code
	);
	
-- Método dos sin usar subquery.

SELECT DISTINCT country.Region,
country.Name
FROM country
INNER JOIN city ON city.CountryCode = country.Code
WHERE country.SurfaceArea < 1000 AND city.Population > 100000; 


-- Listar aquellos países y sus lenguajes no oficiales cuyo porcentaje de hablantes 
-- sea mayor al promedio de hablantes de los lenguajes oficiales. (Entiendo que se refiere a cada país)

SELECT 
country.Name AS countryName,
countrylanguage.Language AS LanguageNotOficial
FROM country
INNER JOIN countrylanguage ON country.Code = countrylanguage.CountryCode
WHERE countrylanguage.IsOficial = 'F' AND countrylanguage.Percentage > (
		SELECT AVG(Percentage)
		FROM countrylanguage
		WHERE countrylanguage.IsOficial = 'T' AND country.Code = countrylanguage.CountryCode
);


-- Listar la cantidad de habitantes por continente ordenado en forma descendente.

SELECT 
country.Continent AS NameContinent,
SUM(country.Population) AS TotalPopulation
FROM country
GROUP BY country.Continent
ORDER BY TotalPopulation DESC;

-- Listar el promedio de esperanza de vida (LifeExpectancy) 
-- por continente con una esperanza de vida entre 40 y 70 años.

SELECT 
country.Continent AS NameContinent,
AVG(country.LifeExpentancy) AS AvgLifeExpentancy
FROM country
WHERE country.LifeExpentancy BETWEEN 40 AND 70
GROUP BY country.Continent;


-- Listar la cantidad máxima, mínima, promedio y suma de habitantes por continente.

SELECT 
MAX(country.Population) AS MaxPopulation,
MIN(country.Population) AS MinPopulation,
AVG(country.Population) AS AvgPopulation,
country.Continent,
FROM country
GROUP BY country.Continent;


SELECT 
country.Name,
country.Population
FROM country
WHERE country.Continent = 'Antartica';

-- Listar el nombre de cada país con la cantidad de habitantes de su ciudad más poblada. 
-- (Hint: Hay dos maneras de llegar al mismo resultado. 
-- Usando consultas escalares o usando agrupaciones, encontrar ambas).


-- Usando escalares.
SELECT 
country.Name AS CountryName,
	(	SELECT 
		MAX(city.Population)
		FROM city
		WHERE city.CountryCode = country.Code
	) AS MaxCityPopulation
FROM country;


-- Usando agrupaciones. GROUP BY
WITH MaxPopulationCity AS 
(
	SELECT 
	city.CountryCode,
	MAX(city.Population) AS MaxCitysPopulation
	FROM city
	GROUP BY city.CountryCode
)

SELECT 
country.Name AS CountryName,
(
	SELECT 
	MaxCitysPopulation
	FROM MaxPopulationCity
	WHERE MaxPopulationCity.CountryCode = country.Code
	
) AS MaxCityPopulation
FROM country;


-- Usando agrupaciones con JOIN
SELECT 
    country.Name AS CountryName,
    MAX(city.Population) AS MaxCityPopulation
FROM 
    country 
INNER JOIN 
    city ON city.CountryCode = country.Code
GROUP BY 
    country.Name;

	