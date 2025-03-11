const db = require("../config/db");
const uploadFile = require("../models/uploadFile");

// Add Employee
exports.addEmployee = async (req, res) => {
  try {
    const image = await uploadFile(req, res);
    const {
      emp_id,
      designation_id,
      district,
      upazila_id,
      union_id,
      unit_id,
      name,
      mobile,
      nid,
      address,
    } = req.body;

    const employeeQuery =
      "INSERT INTO employee (emp_id, designation_id, name, mobile, nid, address, image) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const placementQuery =
      "INSERT INTO employee_placement (emp_id, district, upazila_id, union_id, unit_id) VALUES (?, ?, ?, ?, ?)";

    // Insert employee
    db.query(
      employeeQuery,
      [emp_id, designation_id, name, mobile, nid, address, image],
      (err) => {
        if (err) {
          console.error("Error inserting employee:", err);
          return res
            .status(500)
            .json({ message: "Employee registration failed" });
        }

        // Insert employee placement
        db.query(
          placementQuery,
          [emp_id, district, upazila_id, union_id, unit_id],
          (err) => {
            if (err) {
              console.error("Error inserting employee placement:", err);
              return res
                .status(500)
                .json({ message: "Placement registration failed" });
            }

            res
              .status(201)
              .json({ message: "Employee registered successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ message: "File upload failed", details: error });
  }
};


// Get All Employees
exports.getEmployees = (req, res) => {
  const { designation, search } = req.body;
  let params = [];
  let query = `
    SELECT e.*, d.name as designation_name ,u.user_type,role
    FROM employee AS e 
    JOIN designation AS d ON d.id = e.designation_id
    JOIN user AS u ON u.emp_id=e.emp_id
    JOIN role AS r ON u.role_id=r.role_id
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
    const { emp_id, designation_id, name, mobile, nid, address } = req.body;
    let image = null;

    // Check if a new image is uploaded
    if (req.file) {
      image = await uploadFile(req, res);
    } else {
      // Fetch the existing image from the database
      const selectQuery = "SELECT image FROM employee WHERE emp_id = ?";
      db.query(selectQuery, [emp_id], (err, results) => {
        if (err) {
          console.error("Error fetching existing image:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        if (results.length > 0) {
          image = results[0].image; // Keep the old image
        }

        // Proceed with the update
        updateEmployee(
          emp_id,
          designation_id,
          name,
          mobile,
          nid,
          address,
          image,
          res
        );
      });
      return; // Stop execution here as the update happens in the callback
    }

    // If image is available immediately, update without fetching
    updateEmployee(
      emp_id,
      designation_id,
      name,
      mobile,
      nid,
      address,
      image,
      res
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Separate function to handle the update query
const updateEmployee = (
  emp_id,
  designation_id,
  name,
  mobile,
  nid,
  address,
  image,
  res
) => {
  const query = `
    UPDATE employee 
    SET designation_id = ?, name = ?, mobile = ?, nid = ?, address = ?, image = ? 
    WHERE emp_id = ?`;

  db.query(
    query,
    [designation_id, name, mobile, nid, address, image, emp_id],
    (err, result) => {
      if (err) {
        console.error("Error updating employee:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.status(200).json({ message: "Employee updated successfully" });
    }
  );
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
