const db = require("../config/db");

const logActivity = (emp_id, action, module) => {
  const query = `
        INSERT INTO activity_log (emp_id, action, module) 
        VALUES (?, ?, ?)
    `;
  db.query(query, [emp_id, action, module], (err, result) => {
    if (err) {
      console.error("Error inserting activity log:", err);
    } else {
      console.log("Activity logged successfully:", result.insertId);
    }
  });
};

module.exports = logActivity;
