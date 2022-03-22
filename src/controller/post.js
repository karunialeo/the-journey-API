const { tb_post, tb_user } = require("../../models");
const fs = require("fs");

exports.getAllPosts = async (req, res) => {
  try {
    let data = await tb_post.findAll({
      include: [
        {
          model: tb_user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        image: process.env.FILE_PATH + item.image,
      };
    });

    res.send({
      status: "Success",
      message: "Get All Posts Successful",
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

exports.getUserPosts = async (req, res) => {
  try {
    const { idUser } = req.params;
    let data = await tb_post.findAll({
      where: {
        idUser,
      },
      include: [
        {
          model: tb_user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        image: process.env.FILE_PATH + item.image,
      };
    });

    res.send({
      status: "Success",
      message: "Get User Posts Successful",
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

exports.getPostDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await tb_post.findOne({
      where: {
        id,
      },
      include: [
        {
          model: tb_user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "email"],
          },
        },
      ],
    });

    post.image = "http://localhost:5000/uploads/" + post.image;

    if (!post) {
      res.status(404).send({
        status: "Failed",
        message: "Post Not Found",
      });
    } else {
      res.send({
        status: "Success",
        message: "Get Detail Post Successful",
        post,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.addPost = async (req, res) => {
  try {
    let newPost = await tb_post.create({
      title: req.body.title,
      body: req.body.body,
      image: req.file.filename,
      idUser: req.tb_user.id,
    });

    newPost = JSON.parse(JSON.stringify(newPost));
    newPost = {
      ...newPost,
      image: process.env.FILE_PATH + newPost.image,
    };

    res.send({
      status: "Success",
      message: "Add Post Successful",
      newPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    await tb_post.update(newData, {
      where: {
        id,
      },
    });
    res.send({
      status: "Success",
      message: "Post Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await tb_post.findOne({
      where: {
        id,
        idUser: req.tb_user.id,
      },
    });

    if (!post) {
      return res.status(403).send({
        status: "Forbidden",
        message: "Not Authorized",
      });
    }

    let imageFile = "uploads/" + post.image;

    // Delete image file
    if (post.image !== "default-user.png") {
      fs.unlink(imageFile, (err) => {
        if (err) console.log(err);
        else console.log("\nDeleted file: " + imageFile);
      });
    }

    await tb_post.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "Success",
      message: "Delete Post Successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};
