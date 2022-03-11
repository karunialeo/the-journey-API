const { tb_user } = require("../../models");

const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  // Joi scheme
  const scheme = joi.object({
    fullname: joi.string().min(3).required(),
    email: joi.string().email().min(6).required(),
    password: joi.string().min(4).required(),
    phone: joi.number().required(),
  });

  const { error } = scheme.validate(req.body);
  if (error) {
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  }

  try {
    const userExist = await tb_user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (userExist) {
      return res.status(400).send({
        status: "Failed",
        message: "Email already registered.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await tb_user.create({
      fullname: req.body.fullname,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      image: "default-user.png",
    });

    const token = jwt.sign(
      {
        id: tb_user.id,
        fullname: newUser.fullname,
        email: newUser.email,
        password: newUser.password,
        image: newUser.image,
      },
      process.env.JWT_KEY
    );

    res.send({
      status: "Success",
      message: "Register Successful",
      data: {
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  const scheme = joi.object({
    email: joi.string().email().min(6).required(),
    password: joi.string().min(4).required(),
  });

  const { error } = scheme.validate(req.body);
  if (error) {
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  }

  try {
    const userExist = await tb_user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!userExist) {
      return res.status(404).send({
        status: "Failed",
        message: "User not Found",
      });
    }

    const isValid = await bcrypt.compare(req.body.password, userExist.password);
    if (!isValid) {
      return res.status(403).send({
        status: "Forbidden",
        message: "Password Mismatch",
      });
    }

    const token = jwt.sign({ id: userExist.id }, process.env.JWT_KEY);
    const user = {
      id: userExist.id,
      fullname: userExist.fullname,
      email: userExist.email,
      image: userExist.image,
      token,
    };

    res.send({
      status: "Success",
      message: "Login Successful",
      data: { user },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const id = req.tb_user.id;

    const dataUser = await tb_user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "Failed",
        message: "User not Found",
      });
    }

    res.send({
      status: "Success",
      data: {
        user: {
          id: dataUser.id,
          fullname: dataUser.fullname,
          email: dataUser.email,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};
