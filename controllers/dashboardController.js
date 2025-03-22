const db = require("../config/db");

exports.getDashboardData = async (req, res) => {
  try {
    // Queries
    const designationWiseTodayPresent = `
      SELECT 
        d.name AS designation_name, 
        COUNT(DISTINCT e.id) AS total_employees, 
        COUNT(DISTINCT a.att_id) AS present_today 
      FROM designation AS d
      LEFT JOIN employee AS e ON e.designation_id = d.id
      LEFT JOIN attendance AS a ON a.emp_id = e.emp_id 
        AND a.type = 'In' 
        AND a.date = CURRENT_DATE
      GROUP BY d.id;
    `;

    const topAttendance = `
      SELECT  
        COUNT(DISTINCT a.emp_id) AS today_present, 
        COUNT(DISTINCT CASE WHEN a.in_time > ap.in_time THEN a.emp_id END) AS today_late, 
        COUNT(DISTINCT CASE WHEN ao.in_time < ap.out_time THEN ao.emp_id END) AS today_early_leave, 
        COUNT(DISTINCT CASE WHEN lt.emp_id IS NOT NULL THEN e.emp_id END) AS today_on_leave 
      FROM designation AS d
      LEFT JOIN employee AS e ON e.designation_id = d.id
      LEFT JOIN attendance_period AS ap ON ap.designation_id = d.id
      LEFT JOIN leave_table AS lt ON lt.emp_id = e.emp_id 
        AND CURRENT_DATE BETWEEN lt.start_date AND lt.end_date
      LEFT JOIN attendance AS a ON a.emp_id = e.emp_id 
        AND a.date = CURRENT_DATE 
        AND a.type = 'In'
      LEFT JOIN attendance AS ao ON ao.emp_id = e.emp_id 
        AND ao.date = CURRENT_DATE 
        AND ao.type = 'Out';
    `;

    const topRight = `
      SELECT 
        1 AS district,
        (SELECT COUNT(id) FROM upazila) AS upazila, 
        (SELECT COUNT(id) FROM union_table) AS unionData, 
        (SELECT COUNT(id) FROM unit) AS unit;
    `;

    const lastNotice = `
      SELECT * FROM notice ORDER BY id DESC LIMIT 1;
    `;

    const lastSubmittedWork = `
      SELECT 
        work.*, 
        wt.name AS work_type,
        e.name,
        ep.district,
        upazila.name AS upazila,
        ut.name AS unionName,
        unit.name AS unit
      FROM work 
      LEFT JOIN employee AS e ON e.emp_id = work.emp_id
      LEFT JOIN employee_placement AS ep ON e.emp_id = ep.emp_id
      LEFT JOIN upazila ON ep.upazila_id = upazila.id
      LEFT JOIN union_table AS ut ON ep.union_id = ut.id
      LEFT JOIN unit ON unit.id = ep.unit_id
      LEFT JOIN work_type AS wt ON wt.type_id = work.work_type_id
      ORDER BY work.id DESC LIMIT 10;
    `;

    // Execute all queries in parallel using Promise.all
    const results = await Promise.all([
      new Promise((resolve, reject) =>
        db.query(designationWiseTodayPresent, (err, data) =>
          err ? reject(err) : resolve(data)
        )
      ),
      new Promise((resolve, reject) =>
        db.query(topAttendance, (err, data) =>
          err ? reject(err) : resolve(data)
        )
      ),
      new Promise((resolve, reject) =>
        db.query(topRight, (err, data) => (err ? reject(err) : resolve(data)))
      ),
      new Promise((resolve, reject) =>
        db.query(lastNotice, (err, data) => (err ? reject(err) : resolve(data)))
      ),
      new Promise((resolve, reject) =>
        db.query(lastSubmittedWork, (err, data) =>
          err ? reject(err) : resolve(data)
        )
      ),
    ]);

    // Construct the final response
    res.status(200).json({
      designationWiseTodayPresent: results[0],
      topAttendance: results[1],
      topRight: results[2],
      lastNotice: results[3][0] || {}, // Return empty object if no notice
      lastSubmittedWork: results[4],
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
