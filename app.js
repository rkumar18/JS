const express = require("express");
const md5 = require("md5");
var jwt = require("jsonwebtoken");
const connect = require("./connection/connect");
const User = require("./models/user");
const Restaurant = require("./models/restaurant");
const utility = require("./utility/responses");
const app = express();
const port = 8000;
app.use(express.json());
connect();

app.get("/", (req, res, next) => res.end("Hello this is heroku app"));

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
    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
      console.log(userData);
      const user = new User(userData);
      await user.save();
      return res.status(200).json({
        success: true,
        message: utility.responseMessages.userAddedSuccessfully,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: utility.responseMessages.emailAlreadyExist,
      });
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
      const user = await User.findOne({ password: enteredPassword });
      const mainPassword = user.password;
      if (mainPassword == enteredPassword) {
        const payload = {
          user: {
            _id: user._id, //mongo obj id
          },
        };
        const token = jwt.sign(payload, "secretKey101", {
          expiresIn: "1y",
        });
        return res.status(200).json({
          success: true,
          message: utility.responseMessages.loginSuccess,
          token,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: utility.responseMessages.wrongPassword,
        });
      }
    } else {
      return res
        .status(400)
        .json({ error: false, message: utility.responseMessages.notExist });
    }
  } catch (error) {
    return res.status(400).json({ error: false, message: error.message });
  }
});

app.get("/getprofile", async (req, res) => {
  try {
    const token = req.header("authorization");
    if (!token)
      return res
        .status(401)
        .json({ message: utility.responseMessages.authTokenIsnotpresent });
    const decode = jwt.verify(token, "secretKey101");
    //console.log(decode); --> payload data
    const user = decode.user;
    // console.log("user id", user.id); user.id==userProfile.id
    const userProfile = await User.findById(user.id);
    return res.status(200).json({
      message: utility.responseMessages.userProfileData,
      user: userProfile,
    });
  } catch (error) {
    return res.status(400).json({ error: false, message: error.message });
  }
});

app.post("/addRestaurant", async (req, res) => {
  try {
    const token = req.header("authorization");
    if (!token) {
      return res.status(400).json({
        error: false,
        message: utility.responseMessages.authTokenIsnotpresent,
      });
    }
    const decode = jwt.verify(token, "secretKey101");
    const user = decode.user;
    const userProfile = await User.findById(user.id);
    if (userProfile.id == user.id) {
      const restaurantName = req.body.restaurantName;
      const restaurantEmail = req.body.restaurantEmail;
      const address = req.body.address;
      const restaurantPhone = req.body.restaurantPhone;
      const GSTnumber = req.body.GSTnumber;
      const restaurantPhoto = req.body.restaurantPhoto;
      const restaurantData = {
        restaurantName,
        restaurantPhoto,
        restaurantEmail,
        address,
        restaurantPhone,
        GSTnumber,
      };
      const isResturantExist = await Restaurant.findOne({
        restaurantEmail: restaurantEmail,
      });
      if (!isResturantExist) {
        const restaurant = new Restaurant(restaurantData);
        await restaurant.save();
        return res.status(200).json({
          message: utility.responseMessages.restaurantAdded,
        });
      } else {
        res.status(406).json({
          message: utility.responseMessages.emailAlreadyExist,
        });
      }
    } else {
      res.status(401).json({
        message: utility.responseMessages.authTokenIsnotpresent,
      });
    }
  } catch (error) {
    res.status(403).json({
      message: error.message,
    });
  }
});

app.get("/getAllRestaurant", async (req, res) => {
  try {
    const token = req.header("authorization");
    if (!token) {
      return res.status(400).json({
        error: false,
        message: utility.responseMessages.authTokenIsnotpresent,
      });
    } else {
      const allResturant = await Restaurant.find();
      res.status(200).json({
        message: "all Resturant",
        allResturant,
      });
    }
  } catch (error) {
    res.status(403).json({
      message: error.message,
    });
  }
});

app.get("/getRestaurantById", async (req, res) => {
  try {
    const token = req.header("authorization");
    if (!token) {
      return res.status(400).json({
        error: false,
        message: utility.responseMessages.authTokenIsnotpresent,
      });
    } else {
      const resturantData = await Restaurant.findOne({ id: req.body.id });
      res.status(200).json({
        message: "Resturant",
        resturantData,
      });
    }
  } catch (error) {
    res.status(403).json({
      message: error.message,
    });
  }
});

app.listen(port, () => console.log(utility.responseMessages.runAt, port));
