USE classicmodels;

-- ----- Pre Parcial ----- --

-- ----- Ver tablas ----- --
SELECT * FROM orders; 
SELECT * FROM orderdetails;
SELECT * FROM payments;
SELECT * FROM products; 
SELECT * FROM productlines; 
SELECT * FROM employees;
SELECT * FROM offices;
SELECT * FROM customers; 
SELECT * FROM ProductRefillment;


-- ----- Consulatas ----- --

-- Devuelva la oficina con mayor número de empleados.
SELECT 
	officeCode,
	COUNT(officeCode) AS MaxEmployedOffices
FROM 
	employees
GROUP BY 
	officeCode
ORDER BY 
	MaxEmployedOffices DESC
LIMIT 1;


-- ¿Cuál es el promedio de órdenes hechas por oficina?, 
SELECT 	
	offices.officeCode,
	AVG(promedioOrdenes.cantidadDeOrdenes) AS promedioPorOficina
FROM 
	(
	SELECT 
		customers.customerNumber,
		employees.officeCode,
		COUNT(orders.orderNumber) AS cantidadDeOrdenes
	FROM customers
	INNER JOIN orders ON customers.customerNumber = orders.customerNumber
	INNER JOIN employees ON employees.employeeNumber = customers.salesRepEmployeeNumber
	GROUP BY customers.customerNumber
	) AS promedioOrdenes
INNER JOIN offices ON promedioOrdenes.officeCode = offices.officeCode
GROUP BY offices.officeCode;



SELECT 
 ordenes_por_cliente.officeCode AS oficina,
  AVG(cantidad_ordenes_por_cliente) AS promedioOrdenesPorCliente
FROM (
  SELECT 
    customers.customerNumber,
    COUNT(orders.orderNumber) AS cantidad_ordenes_por_cliente,
    employees.officeCode
  FROM 
    customers
  INNER JOIN orders ON customers.customerNumber = orders.customerNumber
  INNER JOIN employees ON customers.salesRepEmployeeNumber = employees.employeeNumber
  GROUP BY customers.customerNumber
) AS ordenes_por_cliente
-- INNER JOIN offices ON ordenes_por_cliente.officeCode = offices.officeCode
GROUP BY ordenes_por_cliente.officeCode
ORDER BY ordenes_por_cliente.officeCode ASC;


-- -- ¿Qué oficina vendió la mayor cantidad de productos?
SELECT 
 	offices.officeCode AS oficina,
	SUM(orderdetails.quantityOrdered) AS cantidadVendidos
FROM 
	offices	
INNER JOIN employees ON offices.officeCode = employees.officeCode
INNER JOIN customers ON employees.employeeNumber = customers.salesRepEmployeeNumber
INNER JOIN orders ON customers.customerNumber = orders.customerNumber
INNER JOIN orderdetails ON orders.orderNumber = orderdetails.orderNumber
GROUP BY oficina
ORDER BY cantidadVendidos DESC 
LIMIT 1;
	

SELECT 
	offices.city AS ciudad,
	employees.firstName AS name,
	customers.customerName,
	orders.orderNumber,
	orderdetails.quantityOrdered
FROM 
	offices
INNER JOIN employees ON offices.officeCode = employees.officeCode
INNER JOIN customers ON employees.employeeNumber = customers.salesRepEmployeeNumber
INNER JOIN orders ON customers.customerNumber = orders.customerNumber
INNER JOIN orderdetails ON orders.orderNumber = orderdetails.orderNumber

-- Devolver el valor promedio, máximo y mínimo de pagos que se hacen por mes.
SELECT 
	MONTHNAME(paymentDate) AS Month,
	MAX(amount),
	MIN(amount),
	AVG(amount)
FROM 
	payments
GROUP BY
	MONTHNAME(paymentDate)
ORDER BY 
	MAX(amount) DESC;


-- Encontrar, para cada cliente de aquellas ciudades que comienzan por 'N', 
-- la menor y la mayor diferencia en días entre las fechas de sus pagos. 
-- No mostrar el id del cliente, sino su nombre y el de su contacto.
SELECT 
	customers.customerName,
	customers.contactFirstName,
	MAX(DATEDIFF(p1.paymentDate, p2.paymentDate)) AS mayorDiferencia,
	MIN(DATEDIFF(p1.paymentDate, p2.paymentDate)) AS MenorDiferencia	
FROM customers
INNER JOIN payments p1 ON p1.customerNumber = customers.customerNumber
INNER JOIN payments p2 ON p2.customerNumber = customers.customerNumber
WHERE customers.city LIKE 'N%' AND 	
      p1.paymentDate > p2.paymentDate	
GROUP BY customers.customerName, customers.contactFirstName
HAVING 
    COUNT(p1.paymentDate) > 1;  -- Solo considera clientes con más de un pago
    
    
-- Encontrar el nombre y la cantidad vendida total de los 10 productos más vendidos que, 
-- a su vez, representen al menos el 4% del total de productos, contando unidad por unidad, 
-- de todas las órdenes donde intervienen. No utilizar LIMIT.
WITH total_vendido AS (
    SELECT 
        SUM(quantityOrdered) AS ProductTotalVendidos
    FROM 
        orderdetails
),    
totalProducto_id AS (  -- Agregando 'AS'
    SELECT 
        products.productName,
        SUM(orderdetails.quantityOrdered) AS cantidadProductos
    FROM 
        products
    INNER JOIN orderdetails ON products.productCode = orderdetails.productCode
    GROUP BY 
        products.productName
    ORDER BY 
        cantidadProductos DESC  -- Corregido aquí
),

top10 AS (
	SELECT cantidadProductos.productName
		SUM(cantidadProductos.cantidadProductos) AS SUMtop10
	FROM totalProducto_id
	LIMIT 10
)

SELECT 
    totalProducto_id.productName,
    totalProducto_id.cantidadProductos
FROM
    totalProducto_id,
    top10,
    total_vendido
WHERE 
     (SELECT SUM(cantidadProductos) FROM top10) * total_vendido.ProductTotalVendidos



	
	