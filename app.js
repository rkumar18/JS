const express = require("express");
const md5 = require("md5");
var jwt = require("jsonwebtoken");
const connect = require("./connection/connect");
const User = require("./models/user");
const app = express();
const port = 8000;
app.use(express.json());
connect();
app.post("/sum", (req, res) => {
  const firstNumber = req.body.firstNumber;
  const secondNumber = req.body.secondNumber;
  const sum = firstNumber + secondNumber;
  // res.json(sum)
  res.send({ result: sum });
});

app.post("/register", async (req, res) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const address = req.body.address;
    const phone = req.body.phone;
    const password = md5(req.body.password);
    const confirmPassword = password;
    const userData = {
      email,
      address,
      phone,
      firstName,
      lastName,
      address,
      password,
      confirmPassword,
    };
    const isUserExist = await User.findOne({ email: email });
    if (!isUserExist) {
      console.log(userData);
      const user = new User(userData);
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: "user added successsully !!" });
    } else {
      return res
        .status(400)
        .json({ error: true, message: "email already exist" });
    }
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    //const Password = password;
    const isUserExist = await User.findOne({ email: email });
    if (isUserExist) {
      const enteredPassword = md5(req.body.password);
      console.log("entered password", enteredPassword);
      const user = await User.findOne({ password: enteredPassword });
      const mainPassword = user.password;
      console.log("main password", mainPassword);
      if (mainPassword == enteredPassword) {
        const payload = {
          user: {
            id: user.id, //mongo obj id
          },
        };
        const token = jwt.sign(payload, "secretKey101", {
          expiresIn: "1h",
        });
        console.log(token);
        return res
          .status(200)
          .json({ success: true, message: "login successfully !!", token });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "wrong password!!" });
      }
    } else {
      return res.status(400).json({ error: false, message: "user not exist" });
    }
  } catch (error) {
    return res.status(400).json({ error: false, message: error.message });
  }
});

app.post("/getprofile", async (req, res) => {
  try {
    const token = req.header("authorization");
    if (!token) return res.status(401).json({ message: "unauthorizised user" });
    const decode = jwt.verify(token, "secretKey101");
    const user = decode.user;
    const userId = await User.findById(user.id);
    return res.status(200).json({ message: "user profile data", user: userId });
  } catch (error) {
    return res.status(400).json({ error: false, message: error.message });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
