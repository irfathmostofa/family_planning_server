const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uploadFile = require("../models/uploadFile");

exports.register = async (req, res) => {
  const { user_type, emp_id, password, role_id } = req.body;

  if (!user_type || !emp_id || !password || !role_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const checkUserQuery = "SELECT * FROM user WHERE emp_id = ?";
    db.query(checkUserQuery, [emp_id], async (err, results) => {
      if (err) {
        console.error("Error checking existing user:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertQuery =
        "INSERT INTO user (user_type, emp_id, password, role_id) VALUES (?, ?, ?, ?)";
      db.query(
        insertQuery,
        [user_type, emp_id, hashedPassword, role_id],
        (err, result) => {
          if (err) {
            console.error("Error registering user:", err);
            return res.status(500).json({ message: "Internal server error" });
          }
          res.status(201).json({ message: "User registered successfully" });
        }
      );
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = (req, res) => {
  const { emp_id, password } = req.body;
  const query = "SELECT * FROM user WHERE emp_id = ?";

  db.query(query, [emp_id], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, results[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: results[0].emp_id, role_id: results[0].role_id },
      process.env.JWT_SECRET,
      {
        expiresIn: "90d",
      }
    );
    res.status(200).json({ token });
  });
};

exports.deleteUser = (req, res) => {
  const { user_id } = req.body;
  const query = "DELETE FROM user WHERE user_id = ?";
  db.query(query, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  });
};

exports.getUserFromToken = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const query = `
select e.emp_id,e.name,e.mobile,e.address,e.nid,e.image,e.designation_id,d.name as designation,r.role,r.create_privilege,r.read_privilege,r.delete_privilege,r.edit_privilege,ep.district,ep.district,upazila.name as upazila,ut.name as unionName,unit.name as unitName,ap.in_time,ap.out_time,ap.leaveBalance from user as u 
join employee as e on e.emp_id=u.emp_id 
join role as r on r.role_id=u.role_id
join designation as d on e.designation_id=d.id
left join employee_placement as ep on ep.emp_id=u.emp_id
left join attendance_period as ap on ap.designation_id=e.designation_id
left join upazila on ep.upazila_id=upazila.id
left join union_table as ut on ep.union_id=ut.id
left join unit on ep.unit_id=unit.id
WHERE e.emp_id=?
`;

    db.query(query, [decoded.id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching user details" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user: results[0] });
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    }
    res.status(400).json({ message: "Invalid token" });
  }
};

// exports.logout = (req, res) => {
//   const { token } = req.body;
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);

//   const sessionChk = "DELETE FROM um_user_sessions WHERE user_id = ?";
//   db.query(sessionChk, [decoded.id], (err, sessionResults) => {
//     return res.status(401).json({ message: "User token delete" });
//   });
// };

exports.getUsers = (req, res) => {
  const { designation, search } = req.body;
  let params = [];
  let query = `
    SELECT 
    e.*, 
    d.name AS designation_name, 
    u.user_type, 
    u.emp_id,
    r.role,
    u.user_id as userId
FROM employee AS e
JOIN designation AS d ON d.id = e.designation_id
JOIN user AS u ON u.emp_id = e.emp_id
JOIN role AS r ON u.role_id = r.role_id
GROUP BY e.emp_id, d.name, u.user_type, r.role,u.user_id
ORDER BY e.id DESC`;

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
