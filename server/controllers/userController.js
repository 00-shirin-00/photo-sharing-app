import User from "../models/userModel.js";
// =================================
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
// =================================
//پروفایل کاربر لاگین کرده>>
const getUserProfile = async (req, res) => {
  //req.user is set in the auth middleware
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json({
      _id: user._id,
      username: user.name,
      email: user.email,
      dispatchEvent: user.dispatchEvent,
      bio: user.bio,
      profilePicture: user.profilePicture,
      savedImages: user.savedImages,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};
// =================================

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
// =================================
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (req.body.displayName !== undefined) {
      user.displayName = req.body.displayName;
    }
    if (req.body.bio !== undefined) {
      user.bio = req.body.bio;
    }

    // Check if the user provided a new profile picture
    if (req.body.profilePicture!== undefined) {
      user.profilePicture = req.body.profilePicture;
    }

    // Check if the user provided a new password
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save(); // Save the updated user to the database

    // Send the updated user data back to the client
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      displayName: updatedUser.displayName,
      email: updatedUser.email,
      bio: updatedUser.bio,
      profilePicture: updatedUser.profilePicture,
      savedImages: updatedUser.savedImages,
      isAdmin: updatedUser.isAdmin,
      token: req.user.token || null, // // توکن قبلیJWT کاربر
      //token: generateToken(updatedUser._id), //هر بار که کاربر پروفایلش رو آپدیت می‌کنه، یک توکن JWT کاملاً جدید برای اون کاربر صادر میشه و به فرانت‌اند ارسال میشه.
    });
    // اومده (یا اگر اونجا ست نشده، از authSlice خوانده میشه)
    // در واقع، بهتره اینجا توکن رو از req.headers.authorization بگیریم اگر لازمه
    // ولی چون authSuccess ما در Redux، آبجکت کامل userInfo (شامل توکن) رو ذخیره می کنه،
    // بعد از آپدیت پروفایل، می تونیم از همون توکن در Redux state استفاده کنیم
    // و فقط فیلدهای displayName و bio رو در Redux state آپدیت کنیم.
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};
// =================================
export { getUserProfile, updateUserProfile };
