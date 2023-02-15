const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({message: "Not authenticated", statusId: "UNAUTHORIZE ACCESS"});
  }
  
  const token = authHeader.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed");
    }
    let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JSONWEB_TOKEN);
  } catch (err) {
    console.log(err, 'Token Auth')
  }
  if(!decodedToken) {
    return res.status(401).json({message: "Not authenticated", statusId: "UNAUTHORIZE ACCESS"});
  }
  req.user_id = decodedToken.userId;
  req.type_Value = decodedToken.type;
  next();
};
