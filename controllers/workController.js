const db = require("../config/db");
const uploadMultiFiles = require("../models/uploadMultiFiles");

// Add Work Type
exports.addWorkType = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Work type name is required" });
  }
  const query = "INSERT INTO work_type (name) VALUES (?)";
  db.query(query, [name], (err, result) => {
    if (err) {
      console.error("Error adding work type:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(201).json({ message: "Work type added successfully" });
  });
};

// Get All Work Types
exports.getWorkTypes = (req, res) => {
  const query = "SELECT * FROM work_type";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching work types:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json(results);
  });
};

// Update Work Type
exports.updateWorkType = (req, res) => {
  const { type_id, name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Work type name is required" });
  }

  const query = "UPDATE work_type SET name = ? WHERE type_id = ?";

  db.query(query, [name, type_id], (err, result) => {
    if (err) {
      console.error("Error updating work type:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Work type not found" });
    }
    res.status(200).json({ message: "Work type updated successfully" });
  });
};

// Delete Work Type
exports.deleteWorkType = (req, res) => {
  const { type_id } = req.body;
  const query = "DELETE FROM work_type WHERE type_id = ?";

  db.query(query, [type_id], (err, result) => {
    if (err) {
      console.error("Error deleting work type:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Work type not found" });
    }
    res.status(200).json({ message: "Work type deleted successfully" });
  });
};
// Add Work Field
exports.addWorkField = async (req, res) => {
  const { work_type_id, field, field_type, DropdownMenu } = req.body;

  if (!work_type_id || !field || !field_type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "INSERT INTO work_field (work_type_id, field, field_type,DropdownMenu) VALUES (?,?,?,?)";

  db.query(
    query,
    [work_type_id, field, field_type, DropdownMenu],
    (err, result) => {
      if (err) {
        console.error("Error adding work field:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.status(201).json({ message: "Work field added successfully" });
    }
  );
};

// Get All Work Fields
exports.getWorkFields = (req, res) => {
  const { work_type_id } = req.body;
  const params = [];
  let query = "SELECT * FROM work_field WHERE 1=1"; // Use 'let' instead of 'const'

  if (work_type_id) {
    query += " AND work_type_id = ?";
    params.push(work_type_id);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching work fields:", err);
      return res
        .status(500)
        .json({ message: "Internal server error", error: err });
    }
    res.status(200).json(results);
  });
};

// Update Work Field
exports.updateWorkField = (req, res) => {
  const { field_id, work_type_id, field, field_type, DropdownMenu } = req.body;

  if (!work_type_id || !field || !field_type || !DropdownMenu) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "UPDATE work_field SET work_type_id = ?, field = ?, field_type = ?,DropdownMenu=? WHERE field_id = ?";

  db.query(
    query,
    [work_type_id, field, field_type, field_id, DropdownMenu],
    (err, result) => {
      if (err) {
        console.error("Error updating work field:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Work field not found" });
      }
      res.status(200).json({ message: "Work field updated successfully" });
    }
  );
};

// Delete Work Field
exports.deleteWorkField = (req, res) => {
  const { field_id } = req.body;
  const query = "DELETE FROM work_field WHERE field_id = ?";

  db.query(query, [field_id], (err, result) => {
    if (err) {
      console.error("Error deleting work field:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Work field not found" });
    }
    res.status(200).json({ message: "Work field deleted successfully" });
  });
};

// Add Work
exports.addWork = async (req, res) => {};

// Get All Work Entries
exports.getAllWork = (req, res) => {
  const { emp_id, work_type_id } = req.body;

  let query = `
        SELECT 
            work.*, 
            wt.name AS work_type,
            e.name, 
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'field', wf.field,
                    'field_type', wf.field_type,
                    'field_id', wi.field_id,
                    'value', wi.value
                )
            ) AS work_info
        FROM work 
        JOIN employee AS e ON e.emp_id = work.emp_id
        JOIN work_type AS wt ON wt.type_id = work.work_type_id
        JOIN work_field AS wf ON wf.work_type_id = wt.type_id
        LEFT JOIN work_info AS wi ON wi.work_id = work.work_id AND wf.field_id = wi.field_id
    `;

  const conditions = [];
  const params = [];

  if (emp_id) {
    conditions.push("work.emp_id = ?");
    params.push(emp_id);
  }

  if (work_type_id) {
    conditions.push("work.work_type_id = ?");
    params.push(work_type_id);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " GROUP BY work.work_id, wt.name, e.name";

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching work records:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json(results);
  });
};

// Update Work
exports.updateWork = (req, res) => {
  const { work_id, emp_id, work_type_id, date } = req.body;

  if (!emp_id || !work_type_id || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "UPDATE work SET emp_id = ?, work_type_id = ?, date = ? WHERE work_id = ?";

  db.query(query, [emp_id, work_type_id, date, work_id], (err, result) => {
    if (err) {
      console.error("Error updating work record:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Work record not found" });
    }
    res.status(200).json({ message: "Work updated successfully" });
  });
};

// Delete Work
exports.deleteWork = (req, res) => {
  const { work_id } = req.body;
  const query = "DELETE FROM work WHERE work_id = ?";

  db.query(query, [work_id], (err, result) => {
    if (err) {
      console.error("Error deleting work record:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Work record not found" });
    }
    res.status(200).json({ message: "Work deleted successfully" });
  });
};

// exports.addWorkInfo = async (req, res) => {
//   const { emp_id, work_type_id, date, WorkInfoData } = req.body;

//   if (!emp_id || !work_type_id || !date) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   if (!WorkInfoData) {
//     return res.status(400).json({ message: "WorkInfoData is required" });
//   }

//   let parseData;
//   try {
//     parseData = JSON.parse(WorkInfoData);
//     if (parseData.length === 0) {
//       return res.status(400).json({ message: "Invalid or empty data" });
//     }
//   } catch (error) {
//     return res.status(400).json({ message: "Invalid JSON format" });
//   }

//   // Insert work first
//   const workQuery =
//     "INSERT INTO work (emp_id, work_type_id, date) VALUES (?,?,?)";
//   db.query(workQuery, [emp_id, work_type_id, date], (err, result) => {
//     if (err) {
//       console.error("Error adding work:", err);
//       return res.status(500).json({ message: "Internal server error" });
//     }

//     const workId = result.insertId;

//     // Prepare data for work_info
//     const values = parseData.map((item) => [workId, item.field_id, item.value]);

//     const query = "INSERT INTO work_info (work_id, field_id, value) VALUES ?";
//     db.query(query, [values], (err, result) => {
//       if (err) {
//         console.error("Error adding work info:", err);
//         return res.status(500).json({ message: "Internal server error" });
//       }

//       res
//         .status(201)
//         .json({ message: "Work and Work Info added successfully" });
//     });
//   });
// };

exports.addWorkInfo = async (req, res) => {
  uploadMultiFiles.array("images")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const { emp_id, work_type_id, date, WorkInfoData } = req.body;

    if (!emp_id || !work_type_id || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!WorkInfoData) {
      return res.status(400).json({ message: "WorkInfoData is required" });
    }

    let parseData;
    try {
      parseData = JSON.parse(WorkInfoData);
      if (parseData.length === 0) {
        return res.status(400).json({ message: "Invalid or empty data" });
      }
    } catch (error) {
      return res.status(400).json({ message: "Invalid JSON format" });
    }

    // Insert work first
    const workQuery =
      "INSERT INTO work (emp_id, work_type_id, date) VALUES (?,?,?)";
    db.query(workQuery, [emp_id, work_type_id, date], (err, result) => {
      if (err) {
        console.error("Error adding work:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      const workId = result.insertId;
      const uploadedFiles = req.files || [];

      // Map images to the correct field_id
      const fieldImages = {};
      uploadedFiles.forEach((file, index) => {
        fieldImages[parseData[index]?.field_id] = file.path; // Assign image path to field_id
      });

      // Prepare data for work_info, storing the image path inside the value field
      const values = parseData.map((item) => [
        workId,
        item.field_id,
        fieldImages[item.field_id] || item.value, // If image exists, use its path; otherwise, use item.value
      ]);

      const query = "INSERT INTO work_info (work_id, field_id, value) VALUES ?";
      db.query(query, [values], (err, result) => {
        if (err) {
          console.error("Error adding work info:", err);
          return res.status(500).json({ message: "Internal server error" });
        }

        res
          .status(201)
          .json({ message: "Work and Work Info added successfully" });
      });
    });
  });
};

exports.AssignDesignationWorkType = async (req, res) => {
  const { assignData } = req.body;

  if (!assignData) {
    return res.status(400).json({ message: "assignData is required" });
  }

  const parseData = JSON.parse(assignData);
  if (parseData.length === 0) {
    return res.status(400).json({ message: "Invalid or empty data" });
  }

  const values = parseData.map((item) => [
    item.designation_id,
    item.work_type_id,
  ]);

  // Check for duplicates
  const checkQuery = `
    SELECT designation_id, work_type_id 
    FROM designation_work_type 
    WHERE (designation_id, work_type_id) IN (${values
      .map(() => "(?, ?)")
      .join(",")})
  `;

  const flatValues = values.flat(); // Flatten the array for SQL placeholders

  db.query(checkQuery, flatValues, (err, existingRecords) => {
    if (err) {
      console.error("Error checking existing assignments:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    // Filter out already existing records
    const existingSet = new Set(
      existingRecords.map(
        (record) => `${record.designation_id}-${record.work_type_id}`
      )
    );

    const newValues = values.filter(
      ([designation_id, work_type_id]) =>
        !existingSet.has(`${designation_id}-${work_type_id}`)
    );

    if (newValues.length === 0) {
      return res.status(400).json({ message: "All entries already exist" });
    }

    // Insert new records
    const insertQuery =
      "INSERT INTO designation_work_type (designation_id, work_type_id) VALUES ?";
    db.query(insertQuery, [newValues], (insertErr, result) => {
      if (insertErr) {
        console.error("Error inserting assignments:", insertErr);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.status(201).json({ message: "Assignments added successfully" });
    });
  });
};

exports.getAssignedDesignationWorkTypes = async (req, res) => {
  const { id } = req.body;

  let query = `
    SELECT dwt.id, d.name, dwt.work_type_id, wt.name AS work_type
    FROM designation_work_type dwt
    JOIN designation d ON dwt.designation_id = d.id
    JOIN work_type wt ON dwt.work_type_id = wt.type_id
    WHERE 1=1
  `;

  const params = [];

  if (id) {
    query += " AND d.id = ?";
    params.push(id);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching assigned work types:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json(results);
  });
};

exports.deleteAssignDesignationWorkType = (req, res) => {
  const { id } = req.body;
  const query = "DELETE FROM designation_work_type WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting work record:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Work record not found" });
    }
    res.status(200).json({ message: "Work deleted successfully" });
  });
};
