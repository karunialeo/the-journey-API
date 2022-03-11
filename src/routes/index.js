const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFiles");

const { register, login, checkAuth } = require("../controller/auth");
router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

const { getUser } = require("../controller/user");
router.get("/getUser/:id", getUser);

const {
  addPost,
  editPost,
  detailPost,
  deletePost,
  getPostUser,
  getAllPost,
} = require("../controller/posts");
router.get("/posts", getAllPost);
router.post("/addPost", auth, uploadFile("thumbnail"), addPost);
router.post("/editPost/:id", auth, editPost);
router.get("/detail/:id", detailPost);
router.post("/delete/:id", deletePost);
router.get("/postUser/:id", getPostUser);

const {
  addBookmark,
  deleteBookmark,
  getBookmarkuser,
} = require("../controller/bookmark");
router.post("/addBookmark", auth, addBookmark);
router.get("/getBookmark/:id", getBookmarkuser);
router.post("/deleteBookmark/:id", deleteBookmark);

module.exports = router;
