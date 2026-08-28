const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/students', auth, authController.getAllStudents);
router.delete('/users/:id', auth, authController.deleteUser);
router.put('/users/:id/role', auth, authController.updateUserRole);

module.exports = router;