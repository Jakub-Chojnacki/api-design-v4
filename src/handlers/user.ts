import prisma from "../db";
import { createJWT, hashPassword, comparePassword } from "../modules/auth";

export const createNewUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const token = createJWT(user);

    res.status(201);
    res.json({ token });
  } catch (e) {
    e.type = 'input'
    next(e)
  }
};

export const signin = async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  const isValid = await comparePassword(password, user?.password);

  if (!isValid) {
    res.status(401);
    res.json({ message: "invalid credentials" });
    return;
  }

  const token = createJWT(user);
  res.json({ token });
};
