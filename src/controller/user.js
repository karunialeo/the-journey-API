const { tb_user } = require("../../models");

exports.getUser = async (req, res) => {
  try {
    const { email } = req.body;
    const data = await tb_user.findOne({
      where: {
        email,
      },
    });

    if (!data) {
      return res.status(404).send({
        status: "Failed",
        message: "User not Found",
      });
    }

    res.send({
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
    console.log(req.file);

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
