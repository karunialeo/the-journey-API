const { tb_post, tb_user } = require("../../models");

exports.getAllPost = async (request, response) => {
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
        thumbnail: process.env.FILE_PATH + item.thumbnail,
      };
    });

    response.send({
      status: "success",
      data: {
        posts: data,
      },
    });
  } catch (error) {
    console.log(error);
    response.send({
      status: "server error",
    });
  }
};

exports.addPost = async (request, response) => {
  try {
    let newPost = await tb_post.create({
      title: request.body.title,
      description: request.body.description,
      thumbnail: request.file.filename,
      idUser: request.tb_user.id,
    });

    newPost = JSON.parse(JSON.stringify(newPost));
    newPost = {
      ...newPost,
      thumbnail: process.env.FILE_PATH + newPost.thumbnail,
    };

    response.send({
      status: "Success",
      newPost,
    });
  } catch (error) {
    console.log(error);
    response.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.editPost = async (request, response) => {
  try {
    const { id } = request.params;
    const newData = request.body;
    await tb_post.update(newData, {
      where: {
        id,
      },
    });
    response.send({
      status: "success",
      message: "update post succes",
    });
  } catch (error) {
    console.log(error);
    response.send({
      status: "server error",
    });
  }
};

exports.detailPost = async (request, response) => {
  try {
    const { id } = request.params;
    const detail = await tb_post.findOne({
      where: {
        id,
      },
    });
    response.send({
      status: "success",
      message: "success get detail",
      detail,
    });
  } catch (error) {
    console.log(error);
    response.send({
      status: "server error",
    });
  }
};

exports.deletePost = async (request, response) => {
  try {
    const { id } = request.params;
    const post = await tb_post.findOne({
      where: {
        id,
      },
    });

    await tb_post.destroy({
      where: {
        id,
      },
    });
    response.send({
      status: "succees",
    });
  } catch (error) {
    console.log(error);
    response.send({
      status: "failed",
    });
  }
};

exports.getPostUser = async (request, response) => {
  try {
    const { id } = request.params;
    let data = await tb_post.findAll({
      where: {
        idUser: id,
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
        thumbnail: process.env.FILE_PATH + item.thumbnail,
      };
    });

    response.send({
      status: "success",
      data: {
        posts: data,
      },
    });
  } catch (error) {
    response.send({
      status: "server error",
    });
    console.log(error);
  }
};
