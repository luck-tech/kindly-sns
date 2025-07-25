<<<<<<< HEAD
const bcryptjs = require("bcryptjs");
=======
import bcryptjs from "bcryptjs";
>>>>>>> f0a0a8898ef350408a8b81c001153e776fcaf883

async function generateHash() {
  const password = "password123";
  const saltRounds = 10;
  const hash = await bcryptjs.hash(password, saltRounds);
  console.log("Password:", password);
  console.log("Hash:", hash);
}

generateHash();
