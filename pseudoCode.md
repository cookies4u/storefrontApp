Main.JS

sql connection success runs start function

funct. start
	choice selection
	if userInput_Action = "user"
		get user input
		checkInvt()
		cost()
	if userInput_action = "manager"
		get user input
	if if userInput_action = "supervisor"
		get user input
		

user.js
class created
User PROVIDES ID & quantity
funct. invtUpdate
	query1 = Select quantity where ID = userInput_id
		quantity = quantity - userInput_quantity
	query2 = UPDATE quantity WHERE ID = userInput_id
funct. checkInvt
	query1 = Select quantity where ID = userInput_id
	if quantity - userInput_quantity < 0
		console "sorry there aren't enough products. You can purchase " + quantity + " instead"
	else invtUpdate();
funct. cost
	query1 = SELECT price WHERE ID = userInput_id
	cost = price * quantity

manager.js
class created

view products for sale
	list * ids, name, prices, quantities
view low inventory
	inventory count lower than 5 listed
add invenotry
	increase quantity of any existing item
add new product
	add completly new product

supervisor.js
class created

<sql not in the js file>
create departments table: department_id, department_name, over_head_cost (dummy number per department), total_sales

view product sales by department
	display summary table
		TotalProfit = totalSales - over_head_cost
create new department
	
	
