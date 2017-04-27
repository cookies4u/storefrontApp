// npm packages 
var mysql = require("mysql");
var inquirer = require("inquirer");

// connection to mySQL database
var connection = require('./db');

// class created
var supervisorView = function() {
	// option A or option B to avoid callback error using 'this'
	// this.startManager = this.startManager.bind(this); // Option A: when pass as argument lose what this is thus need this
};

// method to perform manager actions
supervisorView.prototype.startSupervisor = function(callbackSuper) {
  inquirer.prompt({
	name: "superViews",
	type: "list",
	message: "Which view would you like?",
	choices: ["Add New Department", "View All Departments", "Back to Main"]
  }).then((answer) => { // based on user input will run one of the following functions
    if (answer.superViews === "Add New Department") {
        // showItems(this.startManager); // Option A
        addDept(() => this.startSupervisor()); // option B: instead of bind
    }
    else if (answer.superViews === "View All Departments") {
    	showDepts(() => this.startSupervisor());
    }
    else if (answer.superViews === "Back to Main") {
    	callbackSuper(); 
    }
  });
};

// user prompts called with inquirer.prompt. prompt via terminal
var departmentSelector = [ 
	{
		type: "input",
		name: "department_name",
		message: "which department would you like to add? Provide department name:"
	}
];
var costSelector = [ 
	{
		type: "input",
		name: "over_head_costs",
		message: "whats the overhead cost of this item"
	}
];

// function to add new department to mySQL department table based on user input
addDept = function(callbackaddDept) {
	// inquirer used to prompt user via terminal/bash. asking for department name
	inquirer.prompt(departmentSelector).then(function (answers1){
		var department = answers1.department_name;
		// inquirer used to prompt user via terminal/bash. asking for department overhead cost
		inquirer.prompt(costSelector).then(function (answers2){
			var cost = answers2.over_head_costs;
			var queryDBquantity = "INSERT INTO departments SET ?";
			// using mySQL connection to run costSelecteor
			connection.query(queryDBquantity, { // fills in the SET clause
				department_name: department, 
				over_head_costs: cost
			}, function(err, res) {
				if (err) throw err;
				console.log("Your auction was created successfully!");
			});
			callbackaddDept();
		});
	});
};

// function shows a department summary based on mySQL department and products table
showDepts = function(callbackshowDepts) {
	// query based on bamazon.sql line 65
	var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, total_sales_by_dept.total_sales, total_sales_by_dept.total_sales - departments.over_head_costs AS total_profits FROM departments INNER JOIN (SELECT department_name, SUM(product_sales) AS total_sales FROM products GROUP BY department_name) total_sales_by_dept WHERE departments.department_name = total_sales_by_dept.department_name";
	// using mySQL connection to run query
	connection.query(query, function(err, res) {
		if (err) throw err;
		// will print the a department summary table from mySQL to terminal
		for (var i = 0; i < res.length; i++) {
			console.log(
				  " department id: " + res[i].department_id 
				+ " || department: " + res[i].department_name 
				+ " || over_head_costs: " + res[i].over_head_costs
				+ " || product_sales: " + res[i].total_sales
				+ " || total_profit: " + res[i].total_profits
			);
		}
		callbackshowDepts();
	});
};

// bamazonCustomer.js now has access
module.exports = supervisorView;
