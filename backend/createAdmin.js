
require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./config/db");

const createAdmin = async () => {
  try {

    const name = "CloudCart Admin";
    const email = "vineethpmural123@gmail.com";
    const password = "Admin@123";

    // CHECK IF ADMIN ALREADY EXISTS
    const [existing] =
      await db.query(
        `
        SELECT id
FROM admins
WHERE email = ?
        `,
        [email]
      );

    if (existing.length > 0) {
      console.log(
        "Admin account already exists."
      );

      process.exit();
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // CREATE ADMIN
    const [result] =
      await db.query(
        `
       INSERT INTO admins
(
  name,
  email,
  password,
  status
)
VALUES (?, ?, ?, ?)
        `,
        [
  name,
  email,
  hashedPassword,
  "Active",
]
      );

    console.log(
      "Admin created successfully!"
    );

    console.log(
      "Admin ID:",
      result.insertId
    );

    process.exit();

  } catch (error) {

    console.error(
      "Admin creation failed:",
      error
    );

    process.exit(1);

  }
};

createAdmin();