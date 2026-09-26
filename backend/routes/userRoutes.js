const express = require("express"); 
 
const db = require("../config/db"); 
 
const authMiddleware = require( 
  "../middleware/authMiddleware" 
); 
 
const roleMiddleware = require( 
  "../middleware/roleMiddleware" 
); 
 
const router = express.Router(); 
 
 
// ======================================== 
// GET CUSTOMER PROFILE 
// ======================================== 
 
router.get( 
  "/profile", 
 
  authMiddleware, 
 
  roleMiddleware("customer"), 
 
  async (req, res) => { 
    try { 
 
      const [users] = await db.query( 
        ` 
        SELECT 
          id, 
          name, 
          email, 
          phone, 
          role, 
          status, 
          created_at 
        FROM users 
        WHERE id = ? 
        `, 
        [req.user.id] 
      ); 
 
      if (users.length === 0) { 
        return res.status(404).json({ 
          success: false, 
          message: "Customer not found.", 
        }); 
      } 
 
      return res.json({ 
        success: true, 
        user: users[0], 
      }); 
 
    } catch (error) { 
 
      console.error( 
        "Get customer profile error:", 
        error 
      ); 
 
      return res.status(500).json({ 
        success: false, 
        message: "Failed to get customer profile.", 
      }); 
    } 
  } 
); 
 
module.exports = router;