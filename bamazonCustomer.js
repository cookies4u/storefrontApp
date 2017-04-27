// node access to...
var mysql = require("mysql");
var inquirer = require("inquirer");

// access classes from other js files
var CustomerView = require("./customerView");
var customerView1 = new CustomerView();

var ManagerView = require("./managerView");
var managerView1 = new ManagerView();

var SupervisorView = require("./supervisorView");
var supervisorView1 = new SupervisorView();


// prompt user. which action to perform
var start = function() {
  console.log("runnning start");
  inquirer.prompt({
    type: "list",
    name: "Views",
    message: "Which view would you like?",
    choices: ["Customer View", "Manager View", "Super View"]
  }).then(function(answer) {
    // based on their answer
    if (answer.Views === "Customer View") {
      // since using require("./customerView"); can't require this file in ./customerView; thus use callbacks
      customerView1.showItems(function () { // callback for showItems is customerView1
        customerView1.updateQuantity(start); // callback for customerView1 is start
      });
    }
    else if (answer.Views === "Manager View") {
      managerView1.startManager(start);
    }
    else if (answer.Views === "Super View") {
      supervisorView1.startSupervisor(start);
    }
  });
};

start();