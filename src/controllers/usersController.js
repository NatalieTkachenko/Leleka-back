import createHttpError from 'http-errors';
import { User } from '../models/user.model.js';
import { saveFileToCloudinary } from '../utils/saveFilesToCloudinary.js';

export const getCurrentUser = async (req, res, next) => {
  const user = await req.user;
  const userProfileData = await User.findById(user._id);
  res.status(200).json({ userProfileData });
  console.log('Тримай юзера');
};

export const updateUserAvatar = async (req, res, next) => {
  if (!req.file) {
    throw createHttpError(400, 'There is no uploaded file');
  }

  const result = await saveFileToCloudinary(req.file.buffer, req.user._id);
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: result.secure_url },
    { new: true },
  );

  res
    .status(201)
    .json({ url: updatedUser.avatar, message: 'Тримай лінку для аватара' });
};

export const updateUser = async (req, res, next) => {
  const { name, gender, dueDate } = req.body;
  console.log('req.user:', req.user);

  const userToUpdate = await User.findById(req.user._id);
  if (!userToUpdate) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (name !== undefined) {
    userToUpdate.name = name;
  }

  if (gender !== undefined) {
    userToUpdate.theme = gender;
  }

  if (dueDate !== undefined) {
    userToUpdate.dueDate = dueDate;
  }

  await userToUpdate.save();

  res.status(200).json({ message: 'Userdata updated', userToUpdate });
};
