var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = require('./db');


var supervisorView = function() {
	// option A or option B to avoid callback error using 'this'
	// this.startManager = this.startManager.bind(this); // Option A: when pass as argument lose what this is thus need this
};

//try calling it something like callback2()
supervisorView.prototype.startSupervisor = function(callbackSuper) {  // doesn't work when a prototype will only work once then will get error callback not a function
  inquirer.prompt({
    name: "Views",
    type: "list",
    message: "Which view would you like?",
    choices: ["Add New Department", "View All Departments", "Back to Main"]
  }).then((answer) => {
    // based on their answer
    if (answer.Views === "Add New Department") {
        // showItems(this.startManager); // Option A
        addDept(() => this.startSupervisor()); // option B: instead of bind
    }
    else if (answer.Views === "View All Departments") {
    	showDepts(() => this.startSupervisor());
    }
    else if (answer.Views === "Back to Main") {
    	callbackSuper(); 
    }
  });
};


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
		message: "whats the cost of this item"
	}
];


// the bottom two move to diff file
// only needed to create new department
addDept = function(callbackaddDept) {
	inquirer.prompt(departmentSelector).then(function (answers1){
		var department = answers1.department_name;
		inquirer.prompt(costSelector).then(function (answers2){
			var cost = answers2.over_head_costs;
			
			var queryDBquantity = "INSERT INTO departments SET ?";
			connection.query(queryDBquantity, { // user will be prompted in supervisor view
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

// only needed to create new department
showDepts = function(callbackshowDepts) {
	var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, total_sales_by_dept.total_sales, total_sales_by_dept.total_sales - departments.over_head_costs AS total_profits FROM departments INNER JOIN (SELECT department_name, SUM(product_sales) AS total_sales FROM products GROUP BY department_name) total_sales_by_dept WHERE departments.department_name = total_sales_by_dept.department_name";
	connection.query(query, function(err, res) {
		if (err) throw err;
		// console.log(res); // return arry with objects within
		for (var i = 0; i < res.length; i++) {
			//console.log(res);
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

module.exports = supervisorView;
