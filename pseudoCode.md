************* bamazonCustomer.JS ************* 

func. start
	prompt user for a selection

	if userSelection = "customer"
		run customerView.js file
	if userSelection = "manager"
		run managerViwe.js file
	if userSelection = "supervisor"
		run supervisorView.js file

************* customerView.js ************* 

sql connection success runs update function

User provides ID & quantity

func. update quantity
	query1 = SELECT quantityDB FROM product WHERE ID = userInput_id
		NewQuantity = quantityDB - userInput_quantity
	query2 = UPDATE product SET quantityDB = NewQuantity WHERE ID = userInput_id

func. purchase cost
	TotalSales = NewQuantity * price // printed to the screen and used to update departments
	query1 = SELECT totalSalesDB FROM department WHERE department_name = userInput_DeptName
		NewTotalSales = totalSalesDB + TotalSales
	query2 = UPDATE department SET totalSalesDB = NewTotalSales WHERE department_name = userInput_DeptName

func. show all items in product table
	query1 = SELECT * FROM products


************* managerView.js ************* 
func. startManager
	prompt user for a selection
	if userSelection = "view products"
		run showProducts()
	if userSelection = "view low inventory"
		run lowInventory()
	if userSelection = "add inventory"
		run addInvenotry()
	if userSelection = "add product"
		run addProduct()
	if userSelection = "back to main"
		run start() // from bamazonCustomer.js

func. showProducts
	query1 = SELECT * FROM product
func. lowInventory
	query1 = SELECT productName, Quantity FROM product WHERE quantity < 5
func. addInvenotry
	query1 = SELECT quantityDB FROM product WHERE ID = userInput_id
		NewQuantity = quantityDB + userInput_quantity
	query2 = UPDATE product SET quantityDB = NewQuantity WHERE ID = userInput_id
func. addProduct
	query1 = INSERT INTO product SET (prompts)
        user prompted to provide the required table fields

************* supervisorView.js ************* 

func. startSupervisor
	prompt user for a selection
	if userSelection = "add new department"
		run addDept()
	if userSelection = "view all departments"
		run showDepts()
	if userSelection = "back to main"
		run start() // from bamazonCustomer.js

func. addDept
    query1 = INSERT INTO department SET (prompts)
        user prompted to provide the required table fields
func. showDepts
    query1 = using product and deparment tables to dispaly a department summary with product total sales
    SELECT departments.department_id, departments.department_name, departments.over_head_costs, total_sales_by_dept.total_sales, (total_sales_by_dept.total_sales - departments.over_head_costs) AS total_profits 
    FROM departments 
    INNER JOIN 
        (SELECT department_name, SUM(product_sales) AS total_sales 
        FROM products 
        GROUP BY department_name) 
        total_sales_by_dept 
    WHERE departments.department_name = total_sales_by_dept.department_name";



