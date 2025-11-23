import pool from "../../models/db.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Please provide email and password.",
      });
    }

    const { rows: userRows } = await pool.query(
      `SELECT id, name, department, email, password, role_id, isactive
       FROM users 
       WHERE email = $1`,
      [email]
    );

    if (userRows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const user = userRows[0];

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const { rows: permissionRows } = await pool.query(
      `
      SELECT p.permission 
      FROM permissions p
      JOIN rolepermission rp ON rp.permission_id = p.id
      WHERE rp.role_id = $1
      `,
      [user.role_id]
    );

    const permissions = permissionRows.map((p) => p.permission);

    const payload = {
      id: user.id,
      name: user.name,
      department: user.department,
      email: user.email,
      role_id: user.role_id,
      permissions: permissions,
    };

    const token = JWT.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful.",
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "An error occurred during login." });
  }
};
