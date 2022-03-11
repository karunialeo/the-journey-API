const { tb_bookmark, tb_post, tb_user } = require("../../models");

exports.toggleBookmark = async (req, res) => {
  try {
    const validation = {
      idUser: req.tb_user.id,
      idPost: req.body.idPost,
    };

    let bookmarkExist = await tb_bookmark.findOne({
      where: validation,
    });

    if (!bookmarkExist) {
      let addBookmark = await tb_bookmark.create({
        idUser: req.tb_user.id,
        idPost: req.body.idPost,
      });

      res.send({
        status: "Success",
        message: "Add Bookmark Successful",
        data: {
          addBookmark,
        },
      });
    } else {
      await tb_bookmark.destroy({
        where: validation,
      });

      res.send({
        status: "Success",
        message: "Delete Bookmark Successful",
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

exports.addBookmark = async (req, res) => {
  try {
    let addBookmark = await tb_bookmark.create({
      idUser: req.tb_user.id,
      idPost: req.body.idPost,
    });

    res.send({
      status: "Success",
      message: "Add Bookmark Successful",
      data: {
        addBookmark,
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

exports.deleteBookmark = async (req, res) => {
  try {
    const id = req.params;
    await tb_bookmark.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "Success",
      message: "Delete Bookmark Successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.getBookmarkUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    const data = await tb_bookmark.findAll({
      where: {
        idUser,
      },
    });

    res.send({
      status: "Success",
      message: "Get User Bookmark Successful",
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
