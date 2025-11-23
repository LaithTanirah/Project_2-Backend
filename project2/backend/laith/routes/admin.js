const express = require("express");
const adminRouter = express.Router();

const { login } = require("../controllers/login");
const {
  getDashboard,
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getTasks,
  addTask,
  updateTask,
  getTaskDetails,
  getOverallProgress,
  deleteTask,
} = require("../controllers/adminController");

const authentication = require("../../middleware/authentication");
const authorization = require("../../middleware/authorization");

// Login
adminRouter.post("/login", login);

// Dashboard overview
adminRouter.get(
  "/dashboard",
  authentication,
  authorization("read_task"),
  getDashboard
);

// Employees
adminRouter.get(
  "/employees",
  authentication,
  authorization("list_users"),
  getEmployees
);
adminRouter.post(
  "/employees",
  authentication,
  authorization("create_user"),
  addEmployee
);
adminRouter.put(
  "/employees/:id",
  authentication,
  authorization("update_user"),
  updateEmployee
);
adminRouter.delete(
  "/employees/:id",
  authentication,
  authorization("delete_user"),
  deleteEmployee
);

// Tasks
adminRouter.get(
  "/tasks",
  authentication,
  authorization("list_tasks"),
  getTasks
);
adminRouter.post(
  "/tasks",
  authentication,
  authorization("create_task"),
  addTask
);
adminRouter.put(
  "/tasks/:task_id",
  authentication,
  authorization("update_task"),
  updateTask
);
adminRouter.get(
  "/task/:task_id",
  authentication,
  authorization("read_task"),
  getTaskDetails
);
adminRouter.delete(
  "/tasks/:task_id",
  authentication,
  authorization("delete_task"),
  deleteTask
);

// Progress & Reports
adminRouter.get(
  "/progress",
  authentication,
  authorization("read_progress"),
  getOverallProgress
);

module.exports = adminRouter;
