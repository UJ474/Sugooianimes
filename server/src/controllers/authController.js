const authService = require("../services/authService");

exports.signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const data = await authService.login(req.body);

    res.json({
      message: "Login successful",
      ...data,
    });

  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || "Login failed",
    });
  }
};



// // In your authController.js
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     const user = await Weeb.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // CREATE TOKEN WITH _id
//     const accessToken = jwt.sign(
//       { 
//         _id: user._id.toString(),  // Make sure this is _id
//         email: user.email 
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     const refreshToken = jwt.sign(
//       { _id: user._id.toString() },
//       process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
//       { expiresIn: '30d' }
//     );

//     res.json({
//       user: {
//         _id: user._id,
//         username: user.username,
//         email: user.email
//       },
//       accessToken,
//       refreshToken
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshTokens(refreshToken);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};