const db = require("../config/db");
const uploadFile = require("../models/uploadFile");

// Add Leave Request
exports.addLeave = async (req, res) => {
  const { emp_id, description, start_date, end_date } = req.body;
  const image = await uploadFile(req, res);
  if (!emp_id || !description || !image || !start_date || !end_date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "INSERT INTO leave_table (emp_id, description, image, start_date, end_date) VALUES (?, ?, ?, ?, ?)";

  db.query(
    query,
    [emp_id, description, image, start_date, end_date],
    (err, result) => {
      if (err) {
        console.error("Error adding leave request:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.status(201).json({ message: "Leave request added successfully" });
    }
  );
};
exports.getLeave = async (req, res) => {
  const { emp_id, startDate, endDate } = req.body;
  let query = "SELECT * FROM leave_table WHERE 1=1";
  let params = [];

  if (emp_id) {
    query += " AND emp_id=?";
    params.push(emp_id);
  }
  if (startDate && endDate) {
    query += " AND start_date BETWEEN ? AND ?";
    params.push(startDate, endDate);
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error fetching help report:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ data: result });
  });
};
exports.updateLeave = async (req, res) => {
  const { leave_id, emp_id, description, start_date, end_date } = req.body;
  const newImage = req.file ? await uploadFile(req, res) : null;
  let query = "SELECT image FROM leave_table WHERE leave_id = ?";

  db.query(query, [leave_id], (err, results) => {
    if (err) {
      console.error("Error fetching leave request:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    const existingImage = results[0].image;
    const finalImage = newImage || existingImage;

    let updateQuery =
      "UPDATE leave_table SET emp_id = ?, description = ?, start_date = ?, end_date = ?, image = ? WHERE leave_id = ?";

    let params = [
      emp_id,
      description,
      start_date,
      end_date,
      finalImage,
      leave_id,
    ];

    db.query(updateQuery, params, (updateErr, result) => {
      if (updateErr) {
        console.error("Error updating leave request:", updateErr);
        return res.status(500).json({ message: "Internal server error" });
      }

      res.status(200).json({ message: "Leave request updated successfully" });
    });
  });
};

exports.deleteLeave = async (req, res) => {
  const { leave_id } = req.body;

  db.query(
    "DELETE FROM leave_table WHERE leave_id = ?",
    [leave_id],
    (err, result) => {
      if (err) {
        console.error("Error deleting leave request:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Leave request not found" });
      }
      res.status(200).json({ message: "Leave request deleted successfully" });
    }
  );
};
