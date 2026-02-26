import createHttpError from 'http-errors';
import { DiaryNote } from '../models/diaryNote.js';

export const createDiaryNote = async (req, res) => {
  try {
    const note = req.body;

    const newNote = await DiaryNote.create({ ...note, owner: req.user.id });

    res.status(201).json({ message: 'Note created in your diary', newNote });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const { _id } = req.user;
    console.log(_id);
    const notes = await DiaryNote.find({ owner: _id });
    if (!notes) {
      throw createHttpError(401, 'Your diary is empty');
    }
    res.status(200).json({ message: 'All your notes', notes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { noteId } = req.params;

    const note = await DiaryNote.findOneAndDelete({
      _id: noteId,
      owner: userId,
    });
    res
      .status(200)
      .json({ message: `Note ${noteId} is successfully deleted`, note });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { noteId } = req.params;
    const update = { ...req.body };

    delete update.owner;

    const newNote = await DiaryNote.findOneAndUpdate(
      {
        _id: noteId,
        owner: userId,
      },
      update,
      { new: true, runValidators: true },
    );
    res.status(200).json({ message: 'The note is updated', newNote });
  } catch (error) {
    next(error);
  }
};
