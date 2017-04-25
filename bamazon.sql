-- creating database
CREATE DATABASE Bamazon;

USE Bamazon;

-- creating table products
CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (item_id),
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10, 2) NULL,
  stock_quantity DECIMAL(10, 2) NULL,
  product_sales DECIMAL(10, 2) DEFAULT
);

-- adding 10 products to table products
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("xBox", "gamming", 299, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("playstation", "gamming", 250, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wii", "gamming", 100, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("pac man", "gamming", 10, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("running shoes", "fitness", 80, 40);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("shorts", "fitness", 25, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("t-shirt", "fitness", 15, 35);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPhone", "phones", 750, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Galaxy", "phones", 800, 125);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pixel", "phones", 700, 130);

-- creating table departments
CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (department_id),
  department_name VARCHAR(100) NULL,
  over_head_costs DECIMAL(10, 2) DEFAULT 10,
  total_sales DECIMAL(10, 2) DEFAULT 0
);

-- adding current departments to table products
INSERT INTO departments (department_name, over_head_costs)
VALUES ("gamming", 5);
INSERT INTO departments (department_name, over_head_costs)
VALUES ("fitness", 10);
INSERT INTO departments (department_name, over_head_costs)
VALUES ("phones", 45);

-- view dept. summary
SELECT 
  departments.department_id, 
  departments.department_name, 
  departments.over_head_costs, 
  total_sales_by_dept.total_sales,  
  total_sales_by_dept.total_sales - departments.over_head_costs 
AS total_profits 
FROM departments INNER JOIN 
  (SELECT 
    department_name, 
    SUM(product_sales) AS total_sales 
   FROM products 
   GROUP BY department_name) total_sales_by_dept 
WHERE 
  departments.department_name = total_sales_by_dept.department_name;

