const { tb_bookmark, tb_post, tb_user } = require("../../models");

exports.addBookmark = async (request, response) => {
  try {
    let addBookmark = await tb_bookmark.create({
      idUser: request.tb_user.id,
      idPost: request.body.idPost,
    });

    response.send({
      status: "success",
      message: {
        addBookmark,
      },
    });
  } catch (error) {
    console.log(error);
    response.send({
      status: "server error",
    });
  }
};

exports.deleteBookmark = async (request, response) => {
  try {
    const id = request.params;
    await tb_bookmark.destroy({
      where: {
        id,
      },
    });

    response.send({
      status: "success",
      message: "delete bookmark success",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getBookmarkuser = async (request, response) => {
  try {
    const { id } = request.params;
    const data = await tb_bookmark.findAll({
      where: {
        idUser: id,
      },
    });

    response.send({
      status: "success",
      message: {
        data,
      },
    });
  } catch (error) {
    console.log(error);
    response.send({
      message: "server error",
    });
  }
};
