const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  // check if user send token via Authorization header or not
  if (!token) {
    return res
      .status(401)
      .send({ status: "Forbidden", message: "Access Denied!" }); // rejected request and send response access denied
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_KEY); //verified token
    req.tb_user = verified;
    next();
  } catch (error) {
    console.log(error);
    // if token not valid, send response invalid token
    return res
      .status(400)
      .send({ status: "Forbidden", message: "Invalid Token" });
  }
};
