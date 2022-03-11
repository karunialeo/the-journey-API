const { tb_user } = require("../../models");

const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (request, response) => {
  // Joi scheme
  const scheme = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().required(),
    password: joi.string().min(3).required(),
    phone: joi.number().required(),
  });

  const { error } = scheme.validate(request.body);
  if (error) {
    return response.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  }

  try {
    const existUser = await tb_user.findOne({
      where: {
        email: request.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (existUser) {
      return response.status(500).send({
        status: "failed",
        message: "user exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(request.body.password, salt);

    const newUser = await tb_user.create({
      name: request.body.name,
      email: request.body.email,
      password: hashedPassword,
      phone: request.body.phone,
    });

    const token = jwt.sign(
      {
        id: tb_user.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      },
      process.env.JWT_KEY
    );

    response.send({
      status: "success",
      message: "register success",
      data: {
        token,
      },
    });
  } catch (error) {
    console.log(error);
    response.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.login = async (request, response) => {
  const scheme = joi.object({
    email: joi.string().required(),
    password: joi.string().min(4).required(),
  });

  const { error } = scheme.validate(request.body);
  if (error) {
    return response.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  }

  try {
    const existUser = await tb_user.findOne({
      where: {
        email: request.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!existUser) {
      return response.status(400).send({
        status: "failed",
        message: "register first",
      });
    }

    const isValid = await bcrypt.compare(
      request.body.password,
      existUser.password
    );
    if (!isValid) {
      return response.status(400).send({
        status: "failed",
        message: "password salah",
      });
    }

    const token = jwt.sign({ id: existUser.id }, process.env.JWT_KEY);
    const user = {
      id: existUser.id,
      name: existUser.name,
      email: existUser.email,
      image: existUser.image,
      token,
    };

    response.send({
      status: "succes",
      message: "success",
      data: { user },
    });
  } catch (error) {
    console.log(error);
    response.send({
      status: "failed",
      message: "server error",
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
      });
    }

    res.send({
      status: "Success",
      data: {
        user: {
          id: dataUser.id,
          name: dataUser.fullname,
          email: dataUser.email,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "Failed",
      message: "Server Error",
    });
  }
};
