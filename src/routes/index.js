const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

const {
  register,
  login,
  loginGoogle,
  checkAuth,
} = require("../controller/auth");
router.post("/register", register);
router.post("/login", login);
router.post("/google-login", loginGoogle);
router.get("/check-auth", auth, checkAuth);

const { checkUser, updateUserImage } = require("../controller/user");
router.post("/user", checkUser);
router.patch("/user/edit/image/:id", uploadFile("image"), updateUserImage);

const {
  addPost,
  editPost,
  getPostDetail,
  deletePost,
  getUserPosts,
  getAllPosts,
} = require("../controller/post");
router.get("/posts", getAllPosts);
router.get("/posts/user/:idUser", getUserPosts);
router.get("/post/detail/:id", getPostDetail);
router.post("/post/add", auth, uploadFile("image"), addPost);
router.patch("/post/edit/:id", auth, editPost);
router.delete("/post/delete/:id", auth, deletePost);

const {
  checkBookmark,
  getBookmarkUser,
  getBookmarkPost,
  toggleAddBookmark,
  addBookmark,
  deleteBookmark,
} = require("../controller/bookmark");
router.get("/bookmark/user/:idUser", getBookmarkUser);
router.get("/bookmark/post/:idPost", getBookmarkPost);
router.post("/bookmark/toggle", auth, toggleAddBookmark);
router.get("/bookmark/check/:idUser/:idPost", checkBookmark);
router.post("/bookmark/add", auth, addBookmark);
router.delete("/bookmark/delete/:idPost", auth, deleteBookmark);

module.exports = router;
