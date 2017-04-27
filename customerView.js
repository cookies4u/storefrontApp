// npm packages 
var mysql = require("mysql");
var inquirer = require("inquirer");

// connection to mySQL database
var connection = require('./db');

// class created
var customerView = function() {};

// user prompts called with inquirer.prompt. prompt via terminal
var itemSelector = [ 
	{
		type: "input",
		name: "item_id",
		message: "which item would you like to purchase? Provide item ID."
	}
];
var quantitySelector = [ 
	{
		type: "input",
		name: "stock_quantity",
		message: "How many would you kie to purchase?"
	}
];

// class function aka method to update mySQL products table and department table when an item is purchsed
customerView.prototype.updateQuantity = function(callbackCustomer) {
	// inquirer used to prompt user via terminal/bash. asking for product id
	inquirer.prompt(itemSelector).then(function (answers1){
		var item_selected = answers1.item_id;
		var queryDBquantity = "SELECT price, stock_quantity, product_sales, department_name FROM products WHERE ?"; // better practice to put querys in seperate file
		// using mySQL connection to run queryDBquantity
		connection.query(queryDBquantity, {
		  item_id: item_selected // fills in the where clause
		}, function(err, res) {
			if (err) throw err;
			// saving mySQL output to variables
			var priceDB = res[0].price;
			var quantityDB = res[0].stock_quantity;
			var productSalesDB = res[0].product_sales;
			var deptNameDB = res[0].department_name;

			// inquirer used to prompt user via terminal/bash. asking for quantity
			inquirer.prompt(quantitySelector).then(function (answers2){
				var quantity_selected = answers2.stock_quantity; // saving user input to var
				if (quantity_selected > quantityDB) {
					console.log("not enough inventory try " + quantityDB + " instead");
				} 
				else {
					console.log("quantityDB " + quantityDB);
					quantityDB -= quantity_selected; // update mySQL quantity for selected product
					var productSales = purchaseCost(priceDB, quantity_selected); // function to calculate purchase price. saving result
					productSalesDB += productSales; // update mySQL product sales for selected product

					var queryUpdateQuantity = "UPDATE products SET ? WHERE ?";
					// using mySQL connection to run queryUpdateQuantity
					connection.query(queryUpdateQuantity, [{
						// fills in the SET clause
						stock_quantity: quantityDB,
						product_sales: productSalesDB
					}, {
						item_id: item_selected // fills in the WHERE clause
					}], function(err, res) {});

					// print results to terminal/bash
					console.log("priceDB " + priceDB);
					console.log("quantity_selected " + quantity_selected);
					console.log("quantityDB " + quantityDB);
					console.log("Your total purchase price is " + productSales);

					updateDeptsFunc(deptNameDB, productSales); // function to update department sales
				}
				callbackCustomer();
			});
		});
	});
};

// method will show all items in the products table
customerView.prototype.showItems = function(callbackshowItems) {
	var query = "SELECT * FROM products";
	// using mySQL connection to run queryShowProducts
	connection.query(query, function(err, res) {
		if (err) throw err;
		// will print the products table from mySQL to terminal
		for (var i = 0; i < res.length; i++) {
			console.log(
				"item_id: " + res[i].item_id 
				+ " || product: " + res[i].product_name 
				+ " || department: " + res[i].department_name 
				+ " || price: " + res[i].price
				+ " || quantity: " + res[i].stock_quantity
				+ " || product sales: " + res[i].product_sales
			);
		}
		callbackshowItems();
	});
};

// product sales called within updateQuantity method
function purchaseCost(price, quantity) {
	var totalCost = price * quantity;
	return totalCost;
};

// function to update department sales
function updateDeptsFunc(dept, sales) {
	var queryDBquantity = "SELECT total_sales FROM departments WHERE ?";
	// using mySQL connection to run queryDBquantity
	connection.query(queryDBquantity, {
	  department_name: dept
	}, function(err, res) {
		if (err) throw err;
		var deptSalesDB = res[0].total_sales;
		var deptSalesDB =  deptSalesDB + sales; // based on current deptSales
		var queryUpdateQuantity = "UPDATE departments SET ? WHERE ?";
		// using mySQL connection to run queryUpdateQuantity
		connection.query(queryUpdateQuantity, [{
			total_sales: deptSalesDB // fills in the SET clause
		}, {
			department_name: dept // fills in the WHERE clause
		}], function(err, res) {});
	});
};

// bamazonCustomer.js now has access
module.exports = customerView;


