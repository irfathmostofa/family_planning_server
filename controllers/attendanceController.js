const db = require("../config/db");
const uploadFile = require("../models/uploadFile");

//Create (Add Attendance)
exports.addAttendancePeriod = async (req, res) => {
  const { designation_id, in_time, out_time, leaveBalance } = req.body;

  if (!designation_id || !in_time || !out_time || !leaveBalance) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "INSERT INTO attendance_period (designation_id, in_time, out_time,leaveBalance) VALUES (?,?,?,?)";
  db.query(
    query,
    [designation_id, in_time, out_time, leaveBalance],
    (err, result) => {
      if (err) {
        console.error("Error adding attendance:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.status(201).json({
        message: "Attendance Period Added successfully",
        id: result.insertId,
      });
    }
  );
};

//Read (Get All Attendance)
exports.getAllAttendancePeriod = async (req, res) => {
  const query =
    "SELECT designation.id as designationID,designation.name,apj.* FROM attendance_period as apj left join designation on designation.id=apj.designation_id ORDER BY designation.id DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching attendance:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json(results);
  });
};

// Update (Modify Attendance)
exports.updateAttendancePeriod = async (req, res) => {
  const { id, designation_id, in_time, out_time, leaveBalance } = req.body;

  if (!designation_id || !in_time || !out_time || !leaveBalance) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "UPDATE attendance_period SET designation_id=?, in_time=?, out_time=?,leaveBalance=? WHERE id=?";
  db.query(
    query,
    [designation_id, in_time, out_time, leaveBalance, id],
    (err, result) => {
      if (err) {
        console.error("Error updating attendance:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Attendance record not found" });
      }

      res.status(200).json({ message: "Attendance updated successfully" });
    }
  );
};

// Delete (Remove Attendance)
exports.deleteAttendancePeriod = async (req, res) => {
  const { id } = req.body;

  const query = "DELETE FROM attendance_period WHERE id=?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting attendance:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.status(200).json({ message: "Attendance deleted successfully" });
  });
};

exports.addAttendance = async (req, res) => {
  try {
    const { emp_id, date, in_time, type, description, location, lat, longi } =
      req.body;
    if (!emp_id || !date || !in_time || !type) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    let image = null;
    try {
      image = await uploadFile(req, res);
    } catch (uploadError) {
      console.error("File upload failed:", uploadError);
      return res.status(500).json({ message: "Image upload failed" });
    }

    const query =
      "INSERT INTO attendance (emp_id, date, in_time, type, image, description, location, lat, longi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(
      query,
      [emp_id, date, in_time, type, image, description, location, lat, longi],
      (err, result) => {
        if (err) {
          console.error("Error adding attendance:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        res.status(201).json({
          message: "Attendance added successfully",
        });
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.getAllAttendance = async (req, res) => {
  const { emp_id, startDate, endDate } = req.body;
  let query = "SELECT * FROM attendance WHERE 1";
  let params = [];

  if (emp_id) {
    query += " AND emp_id = ?";
    params.push(emp_id);
  }
  if (startDate && endDate) {
    query += " AND date BETWEEN ? AND ?";
    params.push(startDate, endDate);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching attendance:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json(results);
  });
};

exports.updateAttendance = async (req, res) => {
  try {
    const {
      id,
      emp_id,
      date,
      in_time,
      type,
      description,
      location,
      lat,
      longi,
    } = req.body;

    const checkQuery = "SELECT * FROM attendance WHERE id = ?";
    db.query(checkQuery, [id], (err, results) => {
      if (err) {
        console.error("Error checking attendance:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Attendance not found" });
      }

      const updateQuery =
        "UPDATE attendance SET emp_id = ?, date = ?, in_time = ?, type = ?, description = ?, location = ?, lat = ?, longi = ? WHERE id = ?";

      db.query(
        updateQuery,
        [emp_id, date, in_time, type, description, location, lat, longi, id],
        (err, result) => {
          if (err) {
            console.error("Error updating attendance:", err);
            return res.status(500).json({ message: "Internal server error" });
          }
          res.status(200).json({ message: "Attendance updated successfully" });
        }
      );
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteAttendance = async (req, res) => {
  const { id } = req.body;

  const deleteQuery = "DELETE FROM attendance WHERE id = ?";
  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error("Error deleting attendance:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json({ message: "Attendance deleted successfully" });
  });
};
