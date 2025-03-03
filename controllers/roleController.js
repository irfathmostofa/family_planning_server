const db = require("../config/db");

// Add Role
exports.addRole = async (req, res) => {
  const {
    role,
    create_privilege,
    read_privilege,
    edit_privilege,
    delete_privilege,
  } = req.body;

  if (
    !role ||
    create_privilege === undefined ||
    read_privilege === undefined ||
    edit_privilege === undefined ||
    delete_privilege === undefined
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "INSERT INTO role (role, create_privilege, read_privilege, edit_privilege, delete_privilege) VALUES (?, ?, ?, ?, ?)";

  db.query(
    query,
    [role, create_privilege, read_privilege, edit_privilege, delete_privilege],
    (err, result) => {
      if (err) {
        console.error("Error adding role:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.status(201).json({ message: "Role added successfully" });
    }
  );
};

// Get All Roles
exports.getRoles = (req, res) => {
  const query = "SELECT * FROM role";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching roles:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json(results);
  });
};

// Update Role
exports.updateRole = (req, res) => {
  const {
    role_id,
    role,
    create_privilege,
    read_privilege,
    edit_privilege,
    delete_privilege,
  } = req.body;

  const query =
    "UPDATE role SET role = ?, create_privilege = ?, read_privilege = ?, edit_privilege = ?, delete_privilege = ? WHERE role_id = ?";

  db.query(
    query,
    [
      role,
      create_privilege,
      read_privilege,
      edit_privilege,
      delete_privilege,
      role_id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating role:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.status(200).json({ message: "Role updated successfully" });
    }
  );
};

// Delete Role
exports.deleteRole = (req, res) => {
  const { role_id } = req.body;
  const query = "DELETE FROM role WHERE role_id = ?";

  db.query(query, [role_id], (err, result) => {
    if (err) {
      console.error("Error deleting role:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.status(200).json({ message: "Role deleted successfully" });
  });
};
