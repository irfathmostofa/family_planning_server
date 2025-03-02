const db = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.addRole = async (req, res) => {
  const {
    role,
    create_privilege,
    read_privilege,
    edit_privilege,
    delete_privilege,
  } = req.body;
  const query =
    "INSERT INTO role (role,create_privilege,read_privilege,edit_privilege,delete_privilege) VALUES (?,?,?,?,?)";
  db.query(
    query,
    [role, create_privilege, read_privilege, edit_privilege, delete_privilege],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: "Role Added successfully" });
    }
  );
};
