const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Employee = mongoose.model("Employee");

router.get("/", (req, res) => {
  res.render("employee/addOrEdit", {
    viewTitle: "Insert Employee",
  });
});
router.post("/", (req, res) => {
  //console.log(req.body);
  insertRecord(req, res);
});

function insertRecord(req, res) {
  var employee = new Employee();
  employee.fullName = req.body.fullName;
  employee.email = req.body.email;
  employee.mobile = req.body.mobile;
  employee.city = req.body.city;
  employee.save((err, doc) => {
    if (!err) {
      res.redirect("employee/list");
      console.log("Data inserted");
    } else {
      if (err.name == "validationError") {
        handleValidationError(err, req.body);
        res.render("employee/addOrEdit", {
          viewTitle: "Insert Employee",
          employee: req.body,
        });
      }

      console.log("Error during record insertion : " + err);
    }
  });
}

router.get("/list", (req, res) => {
  //res.json('from list');
  Employee.find((err, docs) => {
    if (!err) {
      res.render("employee/list", {
        list: docs,
        viewTitle : "List of Employee"
      });
      // console.log(docs);
    } else {
      console.log("Error in retrieving employee list : " + err);
    }
  }).lean(); //very important keyword lean()
});

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case "fullName":
        body["fullNameError"] = err.errors[field].message;
        break;
      case "email":
        body["emailError"] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

// Update Employee
router.get("/:id", (req, res) => {
    Employee.findById(req.params.id,(err,doc)=>{
        if(!err){
            res.render("employee/addOrEdit",{
                viewTitle: "Update Employee",
                employee : doc
            });
        }
    }).lean()
});

//delete
router.get("/delete/:id", (req,res)=>{
    Employee.findByIdAndRemove(req.params.id,(err,doc)=>{
        if(!err){
            res.redirect('/employee/list');
        }
        else{
            console.log('Error in employee delete : ' + err );
        }

    });
});

module.exports = router;
