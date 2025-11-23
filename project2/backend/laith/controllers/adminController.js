import pool from "../../models/db.js";
import bcrypt from "bcryptjs";

// =====================================================================
//   GET /admin/dashboard
// =====================================================================
export const getDashboard = async (req, res) => {
  try {
    const employees = await pool.query(`SELECT COUNT(*) FROM users`);
    const tasks = await pool.query(`SELECT COUNT(*) FROM tasks`);

    const taskStats = await pool.query(`
      SELECT 
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) AS in_progress,
        SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) AS overdue
      FROM tasks
    `);

    res.json({
      totalEmployees: employees.rows[0].count,
      totalTasks: tasks.rows[0].count,
      taskStatistics: taskStats.rows[0],
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// =====================================================================
//   GET /admin/employees
// =====================================================================
export const getEmployees = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, u.name, u.department, u.photo,
        COUNT(t.id) FILTER (WHERE t.status = 'completed') AS completed_tasks,
        COUNT(t.id) FILTER (WHERE t.status = 'in-progress') AS in_progress_tasks,
        COUNT(t.id) FILTER (WHERE t.status = 'overdue') AS overdue_tasks
      FROM users u
      LEFT JOIN tasks t ON t.user_id = u.id
      GROUP BY u.id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Employees Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// =====================================================================
//  POST /admin/employees  (Add Employee)
// =====================================================================
export const addEmployee = async (req, res) => {
  try {
    const { name, photo, department, email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, photo, department, email, password ,role_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email`,
      [name, photo, department, email, hashedPassword, 1]
    );

    res.status(201).json({ message: "Employee added", user: result.rows[0] });
  } catch (err) {
    console.error("Add Employee Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// =====================================================================
//   PUT /admin/employees/:id (Update Employee)
// =====================================================================
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, photo, email } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET name = $1, department = $2, photo = $3, email = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [name, department, photo, email, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update Employee Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// =====================================================================
//   DELETE /admin/employees/:id
// =====================================================================
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

    res.json({ message: "Employee deleted" });
  } catch (err) {
    console.error("Delete Employee Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// =====================================================================
//   GET /admin/tasks
// =====================================================================
export const getTasks = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.id, t.task_name, t.due_date, t.status, t.priority,
        u.name AS assigned_employee
      FROM tasks t
      LEFT JOIN users u ON t.user_id = u.id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Get Tasks Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// =====================================================================
//   POST /admin/tasks (Add Task)
// =====================================================================
export const addTask = async (req, res) => {
  try {
    const employee_id = req.token.id;

    const { task_name, description, due_date, priority, status } = req.body;
    const assigned_date = new Date();

    const taskResult = await pool.query(
      `INSERT INTO tasks (task_name, user_id, description, assigned_date, due_date, status, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        task_name,
        employee_id,
        description,
        assigned_date,
        due_date,
        status,
        priority,
      ]
    );

    const newTask = taskResult.rows[0];

    await pool.query(
      `INSERT INTO task_progress (task_id, employee_id, progress_percentage)
       VALUES ($1, $2, $3)`,
      [newTask.id, employee_id, 0]
    );

    res.status(201).json({
      message: "Task created and progress initialized",
      task: newTask,
    });
  } catch (err) {
    console.error("Add Task Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// =====================================================================
//   PUT /admin/tasks/:task_id (Update Task)
// =====================================================================
export const updateTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { status, progress_percentage } = req.body;
    const employee_id = req.token.id;

    await pool.query(`UPDATE tasks SET status = $1 WHERE id = $2`, [
      status,
      task_id,
    ]);

    if (progress_percentage !== undefined) {
      await pool.query(
        `UPDATE task_progress 
         SET progress_percentage = $1, updated_at = NOW()
         WHERE task_id = $2 AND employee_id = $3`,
        [progress_percentage, task_id, employee_id]
      );
    }

    res.json({ message: "Task updated" });
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// =====================================================================
//   GET /admin/task/:task_id (Single Task Details)
// =====================================================================
export const getTaskDetails = async (req, res) => {
  try {
    const { task_id } = req.params;

    const task = await pool.query(
      `SELECT 
        t.*, 
        u.name AS assigned_employee
       FROM tasks t
       LEFT JOIN users u ON t.user_id = u.id
       WHERE t.id = $1`,
      [task_id]
    );

    const progress = await pool.query(
      `SELECT progress_percentage, updated_at 
       FROM task_progress 
       WHERE task_id = $1`,
      [task_id]
    );

    res.json({
      ...task.rows[0],
      progress: progress.rows,
    });
  } catch (err) {
    console.error("Task Details Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// =====================================================================
//   GET /admin/progress (Overview Reports)
// =====================================================================
export const getOverallProgress = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.task_name,
        u.name AS employee,
        p.progress_percentage,
        p.updated_at
      FROM task_progress p
      JOIN tasks t ON p.task_id = t.id
      JOIN users u ON p.employee_id = u.id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Progress Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// =====================================================================
//   DELETE /admin/tasks/:task_id
// =====================================================================
export const deleteTask = async (req, res) => {
  try {
    const { task_id } = req.params;

    await pool.query(`DELETE FROM tasks WHERE id = $1`, [task_id]);

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete Task Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
