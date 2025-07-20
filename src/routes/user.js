const express = require('express');
const router = express.Router();
const { User, Person } = require('../../models');
const { where } = require('sequelize');

router.delete('/delete', async (req, res) => {
  try {

    console.log("User deletion request received", req.body);
    const { userId } = req.body;

    // Validate request body
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find the user by ID
    const user = await User.findOne({
      where: { person_id: userId }
    });
    console.log("User found:", user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user
    await user.destroy();

    // Optionally, delete the associated person record
    await Person.destroy({ where: { person_id: user.person_id } });

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;