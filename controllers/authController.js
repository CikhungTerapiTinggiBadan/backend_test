const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: 'Registrasi berhasil', userId: user.id });
} catch (error) {
    console.error("Error Register:", error); 
    res.status(400).json({ error: 'Username sudah digunakan atau data tidak valid' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Kredensial tidak valid' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (error) {
    console.error("Error Login:", error); 
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};