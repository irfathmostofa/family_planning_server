const db = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// exports.register = async (req, res) => {
//   const { name, email, password, phone, role_id } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const query =
//     "INSERT INTO um_users (name, email, password, phone, role_id) VALUES (?, ?, ?,?,?)";
//   db.query(
//     query,
//     [name, email, hashedPassword, phone, role_id],
//     (err, result) => {
//       if (err) return res.status(500).json(err);
//       res.status(201).json({ message: "User registered successfully" });
//     }
//   );
// };

// exports.login = (req, res) => {
//   const { phone, password } = req.body;
//   const query = "SELECT * FROM um_users WHERE phone = ?";

//   db.query(query, [phone], async (err, results) => {
//     if (err || results.length === 0) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const validPassword = await bcrypt.compare(password, results[0].password);
//     if (!validPassword) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: results[0].id, role_id: results[0].role_id },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "90d",
//       }
//     );

//     const sessionQuery =
//       "INSERT INTO um_user_sessions (user_id, token, expires_at) VALUES (?, ?, ?)";

//     const expiresAt = new Date();
//     expiresAt.setDate(expiresAt.getDate() + 90);

//     db.query(sessionQuery, [results[0].id, token, expiresAt], (err) => {
//       if (err) {
//         return res.status(500).json({ message: "Error saving session" });
//       }
//       res.status(200).json({ token });
//     });
//   });
// };

// exports.getUserFromToken = (req, res) => {
//   const { token } = req.body;

//   if (!token) {
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const sessionChk =
//       "SELECT * FROM um_user_sessions WHERE user_id = ? AND token = ?";
//     db.query(sessionChk, [decoded.id, token], (err, sessionResults) => {
//       if (err) {
//         return res.status(500).json({ message: "Database query error" });
//       }

//       if (!sessionResults || sessionResults.length === 0) {
//         return res
//           .status(401)
//           .json({ message: "User token expired or invalid." });
//       }

//       const query =
//         "SELECT id, name, phone, email, profile_image, role_id, status FROM um_users WHERE id = ?";

//       db.query(query, [decoded.id], (err, results) => {
//         if (err) {
//           return res
//             .status(500)
//             .json({ message: "Error fetching user details" });
//         }

//         if (results.length === 0) {
//           return res.status(404).json({ message: "User not found" });
//         }

//         res.status(200).json({ user: results[0] });
//       });
//     });
//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       return res
//         .status(401)
//         .json({ message: "Token expired. Please log in again." });
//     }
//     res.status(400).json({ message: "Invalid token" });
//   }
// };

// exports.logout = (req, res) => {
//   const { token } = req.body;
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);

//   const sessionChk = "DELETE FROM um_user_sessions WHERE user_id = ?";
//   db.query(sessionChk, [decoded.id], (err, sessionResults) => {
//     return res.status(401).json({ message: "User token delete" });
//   });
// };
