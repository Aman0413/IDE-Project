const axios = require("axios");
const JDoodleAPIEndpoint = "https://api.jdoodle.com/v1/execute";

exports.runCode = async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({
      success: false,
      message: "Please provide code and language",
    });
  }

  const requestData = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    script: code,
    language,
    versionIndex: "0",
  };

  try {
    const response = await axios({
      method: "post",
      url: JDoodleAPIEndpoint,
      data: requestData,
      headers: { "Content-Type": "application/json" },
    });
    return res.status(200).json({
      success: true,
      message: "Code run successfully",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while running code",
      error: error.message,
    });
  }
};
