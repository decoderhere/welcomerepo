const errorHandler = require("./errorHandler");

const sendtoken = async (res, user, code) => {
  const token = await user.getToken();

  if (!token) {
    return next(new errorHandler("Cannot find token", 400));
  } else {
    res
      .status(code)
      .cookie("token", token, {
        expire: Date.now() + 2 * 24 * 60 * 60 * 1000,
        httpOnly : true
      })
      .json({ success: true, user, token });
  }
};

module.exports = sendtoken;
