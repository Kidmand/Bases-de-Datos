USE classicmodels;

-- ----- Procedimientos ----- --

-- Crear un procedimiento "Update Credit" en donde se modifique 
-- el límite de crédito de un cliente con un valor pasado por parámetro.
DROP PROCEDURE IF EXISTS Update_Credit;
create procedure Update_Credit(IN creditLimit DECIMAL(10,2), IN customerNumber INT)
BEGIN
	UPDATE customers
	SET customers.creditLimit = creditLimit
	WHERE 
		customers.customerNumber = customerNumber;
END;
	
CALL Update_Credit(5000.00, 103);


-- Cree una vista "Premium Customers" que devuelva el top 10 de clientes que más dinero
-- han gastado en la plataforma. La vista deberá devolver el nombre del cliente, 
-- la ciudad y el total gastado por ese cliente en la plataforma.
create view Premium_Customers AS
SELECT 
	customerName AS Name,
	city,
	SUM(payments.amount) AS amount
FROM 
	customers
INNER JOIN 
	payments 
	ON 
	customers.customerNumber = payments.customerNumber
GROUP BY 
	customers.customerNumber, customerName, city
ORDER BY 
	amount DESC 
LIMIT 10;

SELECT * FROM Premium_Customers;


-- Cree una función "employee of the month" que tome un mes y un año y devuelve el empleado 
-- (nombre y apellido) cuyos clientes hayan efectuado la mayor cantidad de órdenes en ese mes.

create function employee_of_the_month(month_ INT, year_ INT)
returns VARCHAR(100)
DETERMINISTIC
BEGIN
	DECLARE NameLastName VARCHAR(100);
	
	SELECT 
		CONCAT(firstName, ' ', lastName) 
	INTO
		 NameLastName
	FROM 
		(
			SELECT 
				firstName,
				lastName,
				COUNT(orders.orderNumber) AS cantidad
			FROM 
				employees
			INNER JOIN 
				customers 
				ON 
				employees.employeeNumber = customers.salesRepEmployeeNumber
			INNER JOIN 
				orders
				ON	
				customers.customerNumber = orders.customerNumber
			WHERE MONTH(orders.orderDate) = month_ AND YEAR(orders.orderDate) = year_
			GROUP BY 
				employees.employeeNumber
		) AS NamesEmployes
	ORDER BY 	
		cantidad DESC 
	LIMIT 1;

	RETURN NameLastName;
		
END;

SELECT employee_of_the_month(3, 2003) AS EmployeeName;


-- Definir un trigger "Restock Product" que esté pendiente de los cambios efectuados en 
-- `orderdetails` y cada vez que se agregue una nueva orden revise la cantidad 
-- de productos pedidos (`quantityOrdered`) y compare con la cantidad en stock 
-- (`quantityInStock`) y si es menor a 10 genere un pedido en la tabla "Product Refillment" 
-- por 10 nuevos productos.
DROP TRIGGER IF EXISTS Restock_Product;
create trigger Restock_Product 
AFTER INSERT ON orderdetails 
FOR EACH ROW 
BEGIN 
	DECLARE current_stock INT;

 	SELECT quantityInStock INTO current_stock
    FROM products
    WHERE productCode = NEW.productCode;
	
   	IF (current_stock - NEW.quantityOrdered) < 10 THEN
   		INSERT INTO ProductRefillment (productCode, orderDate, quantity)
   		VALUES (NEW.productCode, CURDATE(), 10);
   	END IF;
END;

insert  into `orderdetails`(`orderNumber`,`productCode`,`quantityOrdered`,`priceEach`,`orderLineNumber`) values 

(10100,'S12_1099',60,'136.00',3);



