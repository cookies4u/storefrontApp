// npm packages 
var mysql = require("mysql");
var inquirer = require("inquirer");

// connection to mySQL database
var connection = require('./db');

var managerView = function() {
	// option A or option B to avoid callback error using 'this'
	// this.startManager = this.startManager.bind(this); // Option A: when pass as argument lose what this is thus need this
};

// method to perform manager actions
managerView.prototype.startManager = function(callbackManager) { 
	// inquirer used to prompt user via terminal/bash. asking for manager action
	inquirer.prompt({
		name: "managerViews",
		type: "list",
		message: "Which view would you like?",
		choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New product", "Back to Main"]
	}).then((answer) => { // based on user input will run one of the following functions
    if (answer.managerViews === "View Products") {
        // showProducts(this.startManager); // Option A
        showProducts(() => this.startManager()); // option B: instead of bind
    }
    else if (answer.managerViews === "View Low Inventory") {
    	// lowInventory(this.startManager); // Option A
        lowInventory(() => this.startManager()); // option B: instead of bind
    }
    else if (answer.managerViews === "Add to Inventory") {
     	// addInventory(this.startManager); // Option A
        addInventory(() => this.startManager()); // option B: instead of bind
    }
    else if (answer.managerViews === "Add New product") {
     	// addProduct(this.startManager); // Option A
        addProduct(() => this.startManager()); // option B: instead of bind
    }
    else if (answer.managerViews === "Back to Main") {
    	callbackManager();
    }
  });
};

// function will show all items in the products table
showProducts = function(callbackshowProducts) {
	var query = "SELECT * FROM products";
	// using mySQL connection to run queryDBquantity
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
		callbackshowProducts();
	});
};

// function returns low invetory products
lowInventory = function(callbacklowInventory) {
	var query = "SELECT product_name, stock_quantity FROM products WHERE stock_quantity < 5";
	// using mySQL connection to run queryDBquantity
	connection.query(query, function(err, res) {
		if (err) throw err;
		// will print low inventory products with less than 5 in quantity
		for (var i = 0; i < res.length; i++) {
			console.log(
				  " lowInventory product: " + res[i].product_name 
				+ " || lowInventory quantity: " + res[i].stock_quantity
			);
		}
		callbacklowInventory();
	});
};

// user prompts called with inquirer.prompt. prompt via terminal
var itemSelector = [ 
	{
		type: "input",
		name: "item_id",
		message: "which item would you like to add inventory to? Provide item ID."
	}
];
var quantitySelector = [ 
	{
		type: "input",
		name: "stock_quantity",
		message: "How many would you like to add?"
	}
];

// function to update mySQL department table by increasing quantity based on the product the user selects
addInventory = function(callbackaddInventory) {
	// inquirer used to prompt user via terminal/bash. asking for product id
	inquirer.prompt(itemSelector).then(function (answers1){
		var item_selected = answers1.item_id;
		var queryDBquantity = "SELECT price, stock_quantity FROM products WHERE ?";
		// using mySQL connection to run queryDBquantity
		connection.query(queryDBquantity, {
		  item_id: item_selected
		}, function(err, res) {
			if (err) throw err;
			var quantityDB = res[0].stock_quantity; // saving mySQL output to variables
			// inquirer used to prompt user via terminal/bash. asking for quantity
			inquirer.prompt(quantitySelector).then(function (answers2){
				var quantity_selected = answers2.stock_quantity;
				quantityDB = parseInt(quantityDB, 10) + parseInt(quantity_selected, 10);
				var queryUpdateQuantity = "UPDATE products SET ? WHERE ?";
				connection.query(queryUpdateQuantity, [{
					stock_quantity: quantityDB
				}, {
					item_id: item_selected
				}], function(err, res) { 
					if(err) {console.log(err);}
					else { callbackaddInventory(); }
					
				});
			});
		});
	});
};

// user prompts called with inquirer.prompt. prompt via terminal
var addItemSelector = [ 
	{
		type: "input",
		name: "product",
		message: "product name"
	},
	{
		type: "input",
		name: "department",
		message: "department"
	},
	{
		type: "input",
		name: "prices",
		message: "price"
	},
	{
		type: "input",
		name: "quantity",
		message: "quantity"
	}
];

// function to update mySQL product table by adding a new product
addProduct = function(callbackaddProduct) {
	// inquirer used to prompt user via terminal/bash. asking for all the information related to inserting a new product
	inquirer.prompt(addItemSelector).then(function (answers){
		connection.query("INSERT INTO products SET ?", {
			// fills in the SET clause
			product_name: answers.product,
			department_name: answers.department,
			price: answers.prices,
			stock_quantity: answers.quantity
		}, function(err, res) {
			if (err) throw err;
      		console.log("Your auction was created successfully!");
		});
	callbackaddProduct();
	});
};


// bamazonCustomer.js now has access
module.exports = managerView;