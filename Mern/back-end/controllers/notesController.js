const Note = require("../models/Note");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean();

  if (!notes?.length) {
    return res.status(400).json({ message: "No notes found" });
  }
  const notesWithUsers = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...user, username: user.username };
    })
  );
  res.json(notesWithUsers);
});

const createNewNote = asyncHandler(async (req, res) => {
  const { userId, title, text } = req.body;
  if (!userId || !title || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Note.findOne({ title }).lean().exec();
  if (duplicate) {
    return res
      .status(409)
      .json({ message: "A Note with same title already exists" });
  }
  const note = await Note.create({ userId, title, text });
  if (note) {
    return res.status(200).json({ message: "New note created" });
  } else {
    return res.status(400).json({ message: "Invalid note data recieved" });
  }
});

const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;
  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }
  const note = await Node.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  const duplicate = await Note.findOne({ title }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Note exists" });
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updateNote = await note.save();
  res.json(`${updateNote.title} updated`);
});

const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  // Confirm note exists to delete
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  const title = note.title;
  const userId = note._id;
  await note.deleteOne();
  res.json(`${title} with id:${userId} successfully deleted.`);
});

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
