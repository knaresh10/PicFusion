const User = require("../models/user");
const Pin = require("../models/pin");
const Profile = require("../models/profile");
const Board = require("../models/board");
const { default: mongoose, mongo } = require("mongoose");
const s3Upload = require("../services/s3Upload");

const handleGetPinData = async (req, res) => {
  const pinId = req.params.pinId;
  const profile = await Profile.findById(req.profile.id).populate([
    "boards",
    "savedPins.board",
  ]);
  let isPinSaved = false;
  let pinSavedAt = "profile";
  profile.quickSave.forEach((pin) => {
    if (pin._id == pinId) isPinSaved = true;
  });

  profile.savedPins.forEach((obj) => {
    if (obj.pin == pinId) {
      isPinSaved = true;
      pinSavedAt = obj.board.title;
    }
  });

  let isLiked = false;
  profile.likedPins.forEach((pin) => {
    if (pin._id == pinId) isLiked = true;
  });

  const pin = await Pin.findById(pinId);

  return res.json({ isPinSaved, pinSavedAt, isLiked, likeCount: pin.likes });
};

const handleGetCreatePin = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });
  return res.render("pin/createPin", { user: req.user, profile });
};

const handleCreatePin = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Please upload a file" });
  }
  let { title, description, tags } = req.body;
  tags = tags.trim();
  let tagArray;
  if (tags !== "") tagArray = tags.split(" ");

  const url = await s3Upload.s3PinUpload(req.file, "pins");

  let data = {
    title,
    description,
    image: url,
    author: req.profile.id,
  };

  if (tagArray && tagArray.length > 0) data["tags"] = tagArray;

  const profile = await Profile.findById(req.profile.id);

  const pin = await Pin.create(data);

  profile.pins.push(pin._id);

  profile.save();

  return res.redirect("/feed");
};

const handleViewPin = async (req, res) => {
  const pinId = req.params.pinId;
  let profile = await Profile.findById(req.profile.id);
  profile = await profile.populate(["boards", "savedPins.board"]);
  let pin = await Pin.findById(req.params.pinId).populate([
    "author",
    "comments.profileId",
  ]);
  let authorProfile = await Profile.findById(pin.author._id);

  let isPinSaved = false;
  let pinSavedAt = "profile";
  profile.quickSave.forEach((pin) => {
    if (pin._id == pinId) isPinSaved = true;
  });

  profile.savedPins.forEach((obj) => {
    if (obj.pin == pinId) {
      isPinSaved = true;
      pinSavedAt = obj.board.title;
    }
  });
  return res.render("pin/viewPin", {
    user: req.user,
    profile,
    pin,
    author: authorProfile,
    isPinSaved,
    pinSavedAt,
  });
};

const handleSavePin = async (req, res) => {
  const pinId = req.params.pinId;
  const profile = await Profile.findById(req.profile.id);
  profile.quickSave.push(pinId);
  await profile.save();
  return res.json({ message: "pin is saved", pinSavedAt: "profile" });
};

const handleUnsavePin = async (req, res) => {
  const pinId = req.params.pinId;
  const profile = await Profile.findByIdAndUpdate(req.profile.id, {
    $pull: {
      quickSave: pinId,
    },
  });
  return res.json({ message: "pin is unsaved from quick" });
};

const handleUnsavePinToBoard = async (req, res) => {
  const pinId = req.params.pinId;
  const boardName = req.params.boardName;
  // console.log(pinId, boardName);
  const boardData = await Board.findOne({ title: boardName });
  // console.log(boardData);
  const profile = await Profile.findOneAndUpdate(
    {
      user: req.user.id,
    },
    {
      $pull: {
        savedPins: {
          pin: pinId,
          board: boardData._id,
        },
      },
    }
  );

  const board = await Board.findOneAndUpdate(
    { pins: pinId },
    {
      $pull: { pins: pinId },
    }
  );

  return res.json({ message: "pin in unsaved" });
};

const handleLikePin = async (req, res) => {
  const pinId = req.params.pinId;
  const pin = await Pin.findById(pinId);
  pin.likes++;
  await pin.save();
  const profile = await Profile.findById(req.profile.id);
  profile.likedPins.push(pin._id);
  await profile.save();
  return res.json({ likeCount: pin.likes });
};

const handleUnLikePin = async (req, res) => {
  const pinId = req.params.pinId;
  const pin = await Pin.findById(pinId);
  pin.likes--;
  await pin.save();
  await Profile.findByIdAndUpdate(req.profile.id, {
    $pull: {
      likedPins: pinId,
    },
  });

  return res.json({ likeCount: pin.likes });
};

const handleSaveComment = async (req, res) => {
  const pinId = req.params.pinId;
  const { message } = req.body;

  try {
    const pin = await Pin.findById(pinId);
    pin.comments.push({
      profileId: req.profile.id,
      message,
    });
    await pin.save();
    return res.json({ message: "comment has be added" });
  } catch (err) {
    return res.json({ meesage: err.message });
  }
};

const handleDeletePin = async (req, res) => {
  const pinId = req.params.pinId;
  try {
    // delete the pin from all the boards in which it is present
    const boards = await Board.find({ pins: pinId });

    boards.map(async (board) => {
      board.pins.pull(pinId);
      await board.save();
    });

    // delete the pin from the profiles of different users
    const profiles = await Profile.find({
      $or: [
        { pins: pinId },
        { quickSave: pinId },
        { likedPins: pinId },
        { "savedPins.pin": pinId },
      ],
    });

    profiles.map(async (profile) => {
      profile.pins.pull(pinId);
      profile.quickSave.pull(pinId);
      profile.likedPins.pull(pinId);
      profile.savedPins = profile.savedPins.filter(
        (savedPin) => savedPin.pin.toString() !== pinId
      );
      await profile.save();
    });

    // await Promise.all(updateProfiles);

    await Pin.findByIdAndDelete(pinId);

    return res.json({ message: "pin has been successfully deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal error" });
  }
};

module.exports = {
  handleGetPinData,
  handleGetCreatePin,
  handleCreatePin,
  handleViewPin,
  handleSavePin,
  handleUnsavePin,
  handleUnsavePinToBoard,
  handleLikePin,
  handleUnLikePin,
  handleSaveComment,
  handleDeletePin,
};
