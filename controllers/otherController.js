const db = require("../config/db");

// Create a Notice
exports.addNotice = async (req, res) => {
  const { publish_date, notice_name, notice_description } = req.body;

  if (!publish_date || !notice_name || !notice_description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "INSERT INTO notice (publish_date, notice_name, notice_description) VALUES (?, ?, ?)";

  db.query(
    query,
    [publish_date, notice_name, notice_description],
    (err, result) => {
      if (err) {
        console.error("Error adding notice:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.status(201).json({
        message: "Notice added successfully",
        notice_id: result.insertId,
      });
    }
  );
};

// Get All Notices
exports.getAllNotices = async (req, res) => {
  const query = "SELECT * FROM notice ORDER BY publish_date DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching notices:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json({ notices: results });
  });
};

// Get a Single Notice by ID
exports.getNoticeById = async (req, res) => {
  const { id } = req.body;

  const query = "SELECT * FROM notice WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching notice:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Notice not found" });
    }
    res.status(200).json({ notice: result[0] });
  });
};

// Update a Notice
exports.updateNotice = async (req, res) => {
  const { id, publish_date, notice_name, notice_description } = req.body;

  if (!publish_date || !notice_name || !notice_description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "UPDATE notice SET publish_date = ?, notice_name = ?, notice_description = ? WHERE id = ?";

  db.query(
    query,
    [publish_date, notice_name, notice_description, id],
    (err, result) => {
      if (err) {
        console.error("Error updating notice:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Notice not found" });
      }
      res.status(200).json({ message: "Notice updated successfully" });
    }
  );
};

// Delete a Notice
exports.deleteNotice = async (req, res) => {
  const { id } = req.body;

  const query = "DELETE FROM notice WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting notice:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notice not found" });
    }
    res.status(200).json({ message: "Notice deleted successfully" });
  });
};

exports.addHelpReport = async (req, res) => {
  const { emp_id, subject, description, date } = req.body;

  if (!emp_id || !subject || !description || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const query =
    "INSERT INTO help_report (emp_id, subject, description,date) VALUES (?, ?, ?,?)";

  db.query(query, [emp_id, subject, description, date], (err, result) => {
    if (err) {
      console.error("Error adding notice:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(201).json({
      message: "Help Report added successfully",
    });
  });
};

exports.getHelpReport = async (req, res) => {
  const { emp_id } = req.body;
  let query = "SELECT * FROM help_report WHERE 1=1";
  let params = [];

  if (emp_id) {
    query += " AND emp_id=?";
    params.push(emp_id);
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
