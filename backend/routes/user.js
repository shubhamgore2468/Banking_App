const express = require("express");
const { User, Bank } = require("../db");
const JWT = require("jsonwebtoken");
const z = require("zod");
const authMiddleware = require("../middleware/middleware");
const e = require("express");

const userBody = z.object({
  email: z.string().email(),
  password: z.string(),
  firstname: z.string(),
  lastname: z.string(),
});

function getRandomInt(min, max) {
  min = Math.ceil(min); // Ensures min is rounded up to handle edge cases
  max = Math.floor(max); // Ensures max is rounded down to handle edge cases
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const router = express.Router();

router.post("/signup", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const balance = getRandomInt(1, 10000);

  const { success } = userBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({ message: "Incorrect inputs" });
  }

  const isExists = await User.findOne({ email });

  if (!isExists) {
    const user = await User.create({
      email,
      firstName,
      lastName,
      password,
    });
    const userId = user._id;

    await Bank.create({ userId, balance });

    const token = JWT.sign({ userId }, process.env.JWT_SECRET);
    res
      .status(200)
      .json({ message: "User created successfully", token: token });
  } else {
    console.log("last");
    res.status(411).json({ message: "Email already taken / Incorrect inputs" });
  }
});

const siginBody = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const { success } = siginBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const user = await User.findOne({ email, password });
  if (user) {
    const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token: token });
    console.log(`${token}logged in`);
  } else {
    res.status(411).json({ message: "error while logging in" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  const password = req.body.password;
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;

  const user = await User.findOne({ _id: req.userId });

  if (user) {
    res
      .status(200)
      .json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
  } else {
    res
      .status(411)
      .json({ message: "Updated successfullyError while updating info" });
  }
});

router.put("/", authMiddleware, async (req, res) => {
  const password = req.body.password;
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;

  const user = await User.findOne({ _id: req.userId });

  if (user) {
    await User.updateOne({
      password,
      firstName,
      lastName,
    });
    res.status(200).json({ message: "Updated successfully" });
  } else {
    res
      .status(411)
      .json({ message: "Updated successfullyError while updating info" });
  }
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        firstName: { $regex: filter },
      },
      {
        lastName: { $regex: filter },
      },
    ],
  });
  if (users) {
    res.status(200).json({
      user: users.map((user) => ({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
    console.log(
      users.map((user) => ({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user._id,
      }))
    );
  }
});

module.exports = router;
