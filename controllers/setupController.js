const db = require("../config/db");
const uploadFile = require("../models/uploadFile");

exports.addDesignation = async (req, res) => {
  const { name } = req.body;
  const query = "INSERT INTO designation (name) VALUES (?)";
  db.query(query, [name], (err, result) => {
    if (err) return res.status(500).json(err);
    res
      .status(201)
      .json({ message: "Designation Added successfully", id: result.insertId });
  });
};

// Get All Designations
exports.getDesignations = (req, res) => {
  const query = "SELECT * FROM designation";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
};

// Update Designation
exports.updateDesignation = (req, res) => {
  const { id, name } = req.body;
  const query = "UPDATE designation SET name = ? WHERE id = ?";
  db.query(query, [name, id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Designation not found" });

    res.status(200).json({ message: "Designation updated successfully" });
  });
};

// Delete Designation
exports.deleteDesignation = (req, res) => {
  const { id } = req.body;
  const query = "DELETE FROM designation WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Designation not found" });

    res.status(200).json({ message: "Designation deleted successfully" });
  });
};

// Add Upazila
exports.addUpazila = async (req, res) => {
  const { name } = req.body;
  const query = "INSERT INTO upazila (name) VALUES (?)";
  db.query(query, [name], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: "Upazila added successfully" });
  });
};

// Get All Upazilas
exports.getUpazilas = (req, res) => {
  const query = "SELECT * FROM upazila";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
};

// Update Upazila
exports.updateUpazila = (req, res) => {
  const { id, name } = req.body;
  const query = "UPDATE upazila SET name = ? WHERE id = ?";
  db.query(query, [name, id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Upazila not found" });

    res.status(200).json({ message: "Upazila updated successfully" });
  });
};

// Delete Upazila
exports.deleteUpazila = (req, res) => {
  const { id } = req.body;
  const query = "DELETE FROM upazila WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Upazila not found" });

    res.status(200).json({ message: "Upazila deleted successfully" });
  });
};

// Add Union
exports.addUnion = async (req, res) => {
  const { name, upazila_id } = req.body;
  const query = "INSERT INTO union_table (name, upazila_id) VALUES (?, ?)";
  db.query(query, [name, upazila_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: "Union added successfully" });
  });
};

// Get All Unions
exports.getUnions = (req, res) => {
  const query = `
    SELECT u.*, up.name AS upazila_name
    FROM union_table AS u
    JOIN upazila AS up ON u.upazila_id = up.id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
};

// Get Union by ID
exports.getUnionById = (req, res) => {
  const { id } = req.body;
  const query = `
    SELECT u.*, up.name AS upazila_name
    FROM union_table AS u
    JOIN upazila AS up ON u.upazila_id = up.id
    WHERE u.id = ?
  `;
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0)
      return res.status(404).json({ message: "Union not found" });
    res.status(200).json(result[0]);
  });
};

// Update Union
exports.updateUnion = (req, res) => {
  const { id, name, upazila_id } = req.body;
  const query = "UPDATE union_table SET name = ?, upazila_id = ? WHERE id = ?";
  db.query(query, [name, upazila_id, id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Union not found" });

    res.status(200).json({ message: "Union updated successfully" });
  });
};

// Delete Union
exports.deleteUnion = (req, res) => {
  const { id } = req.body;
  const query = "DELETE FROM union_table WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Union not found" });

    res.status(200).json({ message: "Union deleted successfully" });
  });
};
// Add Unit
exports.addUnit = async (req, res) => {
  const { name, upazila_id, union_id } = req.body;

  if (!name || !upazila_id || !union_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "INSERT INTO unit (name, upazila_id, union_id) VALUES (?, ?, ?)";
  db.query(query, [name, upazila_id, union_id], (err, result) => {
    if (err) {
      console.error("Error adding unit:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(201).json({ message: "Unit added successfully" });
  });
};

// Get All Units
exports.getUnits = (req, res) => {
  const query = `
    SELECT u.*, up.name AS upazila_name, un.name AS union_name
    FROM unit AS u
    JOIN upazila AS up ON u.upazila_id = up.id
    JOIN union_table AS un ON u.union_id = un.id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
};

// Get Unit by ID
exports.getUnitById = (req, res) => {
  const { id } = req.body;
  const query = `
    SELECT u.*, up.name AS upazila_name, un.name AS union_name
    FROM unit AS u
    JOIN upazila AS up ON u.upazila_id = up.id
    JOIN union_table AS un ON u.union_id = un.id
    WHERE u.id = ?
  `;
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0)
      return res.status(404).json({ message: "Unit not found" });
    res.status(200).json(result[0]);
  });
};

// Update Unit
exports.updateUnit = (req, res) => {
  const { id, name, upazila_id, union_id } = req.body;

  if (!name || !upazila_id || !union_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "UPDATE unit SET name = ?, upazila_id = ?, union_id = ? WHERE id = ?";
  db.query(query, [name, upazila_id, union_id, id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Unit not found" });

    res.status(200).json({ message: "Unit updated successfully" });
  });
};

// Delete Unit
exports.deleteUnit = (req, res) => {
  const { id } = req.body;
  const query = "DELETE FROM unit WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Unit not found" });

    res.status(200).json({ message: "Unit deleted successfully" });
  });
};

exports.addPageRoute = async (req, res) => {
  const { pageName, pageRoute } = req.body;
  const query = "INSERT INTO privillegeroute (pageName,pageRoute) VALUES (?,?)";
  db.query(query, [pageName, pageRoute], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: "Page Route Added successfully" });
  });
};

exports.deletePageRoute = (req, res) => {
  const { id } = req.body;
  const query = "DELETE FROM privillegeroute WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Page Route not found" });

    res.status(200).json({ message: "Page Route deleted successfully" });
  });
};

exports.getRoleWithPrivileges = async (req, res) => {
  const { role_id } = req.params;
  const query = `
    SELECT 
        p.pageName,
        p.pageRoute,
        r.create_privilege,
        r.read_privilege,
        r.edit_privilege,
        r.delete_privilege
    FROM 
        role r
    JOIN 
        privillegeroute p 
    ON 
        FIND_IN_SET(p.pageRoute, r.create_privilege) 
        OR FIND_IN_SET(p.pageRoute, r.read_privilege)
        OR FIND_IN_SET(p.pageRoute, r.edit_privilege)
        OR FIND_IN_SET(p.pageRoute, r.delete_privilege)
    WHERE 
        r.role_id = ?;
  `;

  db.query(query, [role_id], (err, results) => {
    if (err) {
      console.error("Error fetching role data:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Role not found" });
    }

    const storedPrivileges = results[0];

    const roleData = {
      roleName: storedPrivileges.roleName,
      page: results.map((row) => ({
        pageName: row.pageName,
        pageRoute: row.pageRoute,
        create_privilege: storedPrivileges.create_privilege,
        read_privilege: storedPrivileges.read_privilege,
        edit_privilege: storedPrivileges.edit_privilege,
        delete_privilege: storedPrivileges.delete_privilege,
      })),
    };

    res.status(200).json(roleData);
  });
};
