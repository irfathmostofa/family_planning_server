const db = require("../config/db");
const uploadFile = require("../models/uploadFile");

// Add Employee
exports.addEmployee = async (req, res) => {
  try {
    const image = await uploadFile(req, res);
    const { emp_id, designation_id, name, mobile, nid, address } = req.body;

    const query =
      "INSERT INTO employee (emp_id, designation_id, name, mobile, nid, address, image) VALUES (?,?,?,?,?,?,?)";
    db.query(
      query,
      [emp_id, designation_id, name, mobile, nid, address, image],
      (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: "Employee registered successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "File upload failed", details: error });
  }
};

// Get All Employees
exports.getEmployees = (req, res) => {
  const { designation, search } = req.body;
  let params = [];
  let query = `
    SELECT e.*, d.name as designation_name 
    FROM employee AS e 
    JOIN designation AS d ON d.id = e.designation_id
    WHERE 1=1`;

  if (designation) {
    query += " AND d.name = ?";
    params.push(designation);
  }

  if (search) {
    query += " AND (e.name LIKE ? OR e.mobile LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
};

// Get Employee by ID
exports.getEmployeeById = (req, res) => {
  const { id } = req.body;
  const query = "SELECT * FROM employee WHERE emp_id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0)
      return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(result[0]);
  });
};

// Update Employee
exports.updateEmployee = async (req, res) => {
  try {
    let image = null;
    if (req.file) {
      image = await uploadFile(req, res);
    }

    const { emp_id, designation_id, name, mobile, nid, address } = req.body;
    const query = `
      UPDATE employee 
      SET designation_id = ?, name = ?, mobile = ?, nid = ?, address = ?, 
          image = COALESCE(?, image) 
      WHERE emp_id = ?`;

    db.query(
      query,
      [designation_id, name, mobile, nid, address, image, emp_id],
      (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0)
          return res.status(404).json({ message: "Employee not found" });

        res.status(200).json({ message: "Employee updated successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "File upload failed", details: error });
  }
};

// Delete Employee
exports.deleteEmployee = (req, res) => {
  const { id } = req.body;
  const query = "DELETE FROM employee WHERE emp_id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: "Employee deleted successfully" });
  });
};
