const User = require("../schema/userSchema");

const registerUser = async (req, res) => {
  try {
    // TODO: Change schoolEmail to Email only
    const { type, email, fullName, userName, password } = req.body;

    const existingUser = await User.findOne({ userName });

    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "Username already exists. Please choose a different one.",
      });
    }

    const result = await new User({
      type,
      email,
      fullName,
      userName,
      password,
    }).save();

    // Returning JSON is optional unless you use frontend framework.
    return (
      res
        // .status(200)
        // .json({
        //   success: true,
        //   message: "Registration successful! Redirecting to login",
        //   userId: result.id,
        // })
        .redirect("/")
    );
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { registerUser };
