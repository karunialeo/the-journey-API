const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

const { register, login, checkAuth } = require("../controller/auth");
router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

const { getUser } = require("../controller/user");
router.get("/user/:id", getUser);

const {
  addPost,
  editPost,
  detailPost,
  deletePost,
  getUserPosts,
  getAllPosts,
} = require("../controller/posts");
router.get("/post", getAllPosts);
router.get("/post/user/:id", getUserPosts);
router.get("/post/detail/:id", detailPost);
router.post("/post/add", auth, uploadFile("image"), addPost);
router.patch("/post/edit/:id", auth, editPost);
router.delete("/post/delete/:id", deletePost);

const {
  getBookmarkUser,
  toggleBookmark,
  addBookmark,
  deleteBookmark,
} = require("../controller/bookmark");
router.get("/bookmark/user/:id", getBookmarkUser);
router.post("/bookmark/toggle", auth, toggleBookmark);
router.post("/bookmark/add", auth, addBookmark);
router.delete("/bookmark/delete/:id", deleteBookmark);

module.exports = router;
