import { connectToDatabases, closeDatabaseConnections } from "../server";
export const registerUser = async (req, res) => {
  try {
    await connectToDatabases();

    // TODO: Change schoolEmail to Email only
    const { registrationType, schoolEmail, fullName, username, password } = req.body;

    const registrationCollection = databases.registration.collection;

    const existingUser = await registrationCollection.findOne({ username });

    if (existingUser) {
      res.status(200).json({
        success: false,
        message: "Username already exists. Please choose a different one.",
      });
      return;
    }

    const result = await registrationCollection.insertOne({
      registrationType,
      schoolEmail,
      fullName,
      username,
      password,
    });
    res.status(200).json({
      success: true,
      message: "Registration successful! Redirecting to login",
      userId: result.insertedId,
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    await closeDatabaseConnections();
  }
};
