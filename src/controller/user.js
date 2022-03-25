const { tb_user } = require("../../models");
const fs = require("fs");

exports.checkUser = async (req, res) => {
  try {
    const { email } = req.body;
    const data = await tb_user.findOne({
      where: {
        email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!data) {
      return res.status(404).send({
        status: "Failed",
        message: "User not Found! Please Register.",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Get User Successful",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.updateUserImage = async (req, res) => {
  try {
    const { id } = req.params;
    const oldData = await tb_user.findOne({
      where: {
        id,
      },
    });

    if (oldData.image !== "default-user_mcbekn.png") {
      cloudinary.uploader.destroy(oldData.image, function (result) {
        console.log(result);
      });
    }

    const data = await tb_user.update(
      {
        image: req.file.filename,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).send({
      status: "Success",
      message: `User with ID: ${id} Updated`,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};
