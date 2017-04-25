var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = require('./db');

//var restart = require('./bamazonCustomer');
//var restart1 = restart();

var customerView = function() {};

customerView.prototype.updateQuantity = function(callbackCustomer) {
	inquirer.prompt(itemSelector).then(function (answers1){
		var item_selected = answers1.item_id;
		var queryDBquantity = "SELECT price, stock_quantity, product_sales, department_name FROM products WHERE ?";
		connection.query(queryDBquantity, {
		  item_id: item_selected
		}, function(err, res) {
			if (err) throw err;
			var priceDB = res[0].price;
			var quantityDB = res[0].stock_quantity;
			var productSalesDB = res[0].product_sales;
			var deptNameDB = res[0].department_name;

			inquirer.prompt(quantitySelector).then(function (answers2){
				var quantity_selected = answers2.stock_quantity;
				if (quantity_selected > quantityDB) {
					console.log("not enough inventory try " + quantityDB + " instead");
				} 
				else {
					console.log("quantityDB " + quantityDB);
					quantityDB -= quantity_selected;
					var productSales = purchaseCost(priceDB, quantity_selected);
					productSalesDB += productSales;

					var queryUpdateQuantity = "UPDATE products SET ? WHERE ?";
					connection.query(queryUpdateQuantity, [{
						stock_quantity: quantityDB,
						product_sales: productSalesDB
					}, {
						item_id: item_selected
					}], function(err, res) {});

					//this.purchaseCost(priceDB, quantity_selected);
					console.log("priceDB " + priceDB);
					console.log("quantity_selected " + quantity_selected);
					console.log("quantityDB " + quantityDB);
					console.log("Your total purchase price is " + productSales);

					updateDeptsFunc(deptNameDB, productSales);
				}
				callbackCustomer();
			});
		});
	});
};

customerView.prototype.showItems = function(callback) {
	var query = "SELECT * FROM products";

	connection.query(query, function(err, res) {
		if (err) throw err;
		// console.log(res); // return arry with objects within
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
		callback();
	});
	//var restart = require('./bamazonCustomer');
};

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

//customerView.prototype.purchaseCost = function(price, quantity) {
function purchaseCost(price, quantity) {
	var totalCost = price * quantity;
	return totalCost;
};

////////////////////////
// to update amounts needed in this file

function updateDeptsFunc(dept, sales) {
	console.log("........ " + dept);
	var queryDBquantity = "SELECT total_sales FROM departments WHERE ?";
	connection.query(queryDBquantity, {
	  department_name: dept
	}, function(err, res) {
		if (err) throw err;
		var deptSalesDB = res[0].total_sales;

		var deptSalesDB =  deptSalesDB + sales; // based on current deptSales
		var queryUpdateQuantity = "UPDATE departments SET ? WHERE ?";
		connection.query(queryUpdateQuantity, [{
			total_sales: deptSalesDB
		}, {
			department_name: dept
		}], function(err, res) {});
	});
};


// var customerView1 = new customerView();
// customerView1.showItems(customerView1.updateQuantity);

// bamazonCustomer.js now has access
module.exports = customerView;


