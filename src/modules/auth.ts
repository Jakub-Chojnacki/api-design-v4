import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

export const createJWT = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET
  );
  return token;
};

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.send("Not authorized");
    return;
  }

  const [_, token] = bearer.split(" "); // it's Bearer andsomekeystring  so we split and only take the second param

  if (!token) {
    res.status(401);
    res.send({ message: "Token is not valid" });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    console.log(payload);
    next();
    return;
  } catch (e) {
    console.error(e);
    res.status(401);
    res.send("Not authorized");
    return;
  }
};

export const comparePassword = (password, hash) => {
  return bcrypt.comparePassword(password, hash);
};

export const hashPassword = (password) => {
  return bcrypt.hash(password, bcrypt.gensalt());
};
