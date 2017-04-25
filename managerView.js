var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = require('./db');

var managerView = function() {
	// option A or option B to avoid callback error using 'this'
	// this.startManager = this.startManager.bind(this); // Option A: when pass as argument lose what this is thus need this
	// this.startManager = this.startManager.bind(this); // Option A: when pass as argument lose what this is thus need this
};

//try calling it something like callback1()
managerView.prototype.startManager = function(callbackManager) {  // doesn't work when a prototype will only work once then will get error callback not a function
//managerView.prototype.startManager = function(callback) {  // doesn't work when a prototype will only work once then will get error callback not a function
  inquirer.prompt({
    name: "Views",
    type: "list",
    message: "Which view would you like?",
    choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New product", "Back to Main"]
  }).then((answer) => {
    // based on their answer
    if (answer.Views === "View Products") {
        // showProducts(this.startManager); // Option A
        showProducts(() => this.startManager()); // option B: instead of bind
    }
    else if (answer.Views === "View Low Inventory") {
    	// lowInventory(this.startManager); // Option A
    	console.log("7777777777");
        lowInventory(() => this.startManager()); // option B: instead of bind
    }
    else if (answer.Views === "Add to Inventory") {
     	// addInventory(this.startManager); // Option A
        addInventory(() => this.startManager()); // option B: instead of bind
    }
    else if (answer.Views === "Add New product") {
     	// addProduct(this.startManager); // Option A
        addProduct(() => this.startManager()); // option B: instead of bind
    }
    else if (answer.Views === "Back to Main") {
    	callbackManager(); //try calling it something like callback1()
    }
  });
};

showProducts = function(callback) {
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
};

lowInventory = function(callback) {
	var query = "SELECT product_name, stock_quantity FROM products WHERE stock_quantity < 5";
	console.log(" xxxxxxxxxxx ");
	connection.query(query, function(err, res) {
		if (err) throw err;
		// console.log(res); // return arry with objects within
		for (var i = 0; i < res.length; i++) {
			console.log(
				  " lowInventory product: " + res[i].product_name 
				+ " || lowInventory quantity: " + res[i].stock_quantity
			);
		}
		callback();
	});
};


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


addInventory = function(callback) {
	inquirer.prompt(itemSelector).then(function (answers1){
		var item_selected = answers1.item_id;
		console.log("item_selected " + item_selected);
		//throw new Error("xxxxxxxxxxx");
		var queryDBquantity = "SELECT price, stock_quantity FROM products WHERE ?";
		connection.query(queryDBquantity, {
		  item_id: item_selected
		}, function(err, res) {
			if (err) throw err;

			var quantityDB = res[0].stock_quantity;

			inquirer.prompt(quantitySelector).then(function (answers2){
				var quantity_selected = answers2.stock_quantity;
				console.log("quantityDB " + quantityDB);
				//quantityDB += quantity_selected;
				quantityDB = parseInt(quantityDB, 10) + parseInt(quantity_selected, 10);
				var queryUpdateQuantity = "UPDATE products SET ? WHERE ?";
				connection.query(queryUpdateQuantity, [{
					stock_quantity: quantityDB
				}, {
					item_id: item_selected
				}], function(err, res) { 
					if(err) {console.log(err);}
					else { callback(); }
					
				});
			});
		});
	});
};

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

addProduct = function(callbackaddProduct) {
	inquirer.prompt(addItemSelector).then(function (answers){
		console.log("i'm in");
		connection.query("INSERT INTO products SET ?", {
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