const { tb_bookmark, tb_post, tb_user } = require("../../models");

exports.toggleAddBookmark = async (req, res) => {
  try {
    const bookmarkExist = await tb_bookmark.findOne({
      where: {
        idUser: req.tb_user.id,
        idPost: req.body.idPost,
      },
    });
    if (bookmarkExist) {
      await tb_bookmark.destroy({
        where: {
          idUser: req.tb_user.id,
          idPost: req.body.idPost,
        },
      });
      res.status(200).send({
        status: "Success",
        message: "Bookmark Deleted",
      });
    } else {
      await tb_bookmark.create({
        idUser: req.tb_user.id,
        idPost: req.body.idPost,
      });
      res.status(200).send({
        status: "Success",
        message: "Bookmark Added",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.addBookmark = async (req, res) => {
  try {
    const validation = {
      idUser: req.tb_user.id,
      idPost: req.body.idPost,
    };

    let bookmarkExist = await tb_bookmark.findOne({
      where: validation,
    });

    if (bookmarkExist) {
      res.status(400).send({
        status: "Failed",
        message: "Post Already Bookmarked",
      });
    } else {
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
    }
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
    const { idPost } = req.params;
    const validation = {
      idUser: req.tb_user.id,
      idPost,
    };

    let bookmarkExist = await tb_bookmark.findOne({
      where: validation,
    });

    if (!bookmarkExist) {
      res.status(400).send({
        status: "Failed",
        message: "Bookmarked or Post Does not Exist",
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

exports.getBookmarkUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    const data = await tb_bookmark.findAll({
      where: {
        idUser,
      },
      include: [
        {
          model: tb_post,
          as: "post",
          include: [
            {
              model: tb_user,
              as: "user",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            },
          ],
          attributes: {
            exclude: ["idUser"],
          },
        },
      ],
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

exports.getBookmarkPost = async (req, res) => {
  try {
    const { idPost } = req.params;
    const data = await tb_bookmark.findAll({
      where: {
        idPost,
      },
      // include: [
      //   {
      //     model: tb_post,
      //     as: "post",
      //     include: [
      //       {
      //         model: tb_user,
      //         as: "user",
      //         attributes: {
      //           exclude: ["createdAt", "updatedAt", "password"],
      //         },
      //       },
      //     ],
      //     attributes: {
      //       exclude: ["idUser"],
      //     },
      //   },
      // ],
    });

    res.send({
      status: "Success",
      message: "Get Bookmarks By Post Successful",
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

exports.checkBookmark = async (req, res) => {
  try {
    const { idPost, idUser } = req.params;

    const data = await tb_bookmark.findOne({
      where: {
        idUser,
        idPost,
      },
    });

    if (data) {
      res.send({
        status: "Bookmarked",
        message: "Post Bookmarked",
        data,
      });
    } else {
      res.send({
        status: "Unbookmarked",
        message: "Post Unbookmarked",
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
