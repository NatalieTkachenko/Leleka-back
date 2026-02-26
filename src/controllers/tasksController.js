import { Task } from '../models/task.js';
import createHttpError from 'http-errors';

export const createTask = async (req, res) => {
  try {
    const { name, date } = req.body;

    const task = await Task.create({
      name,
      date,
      owner: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const taskStatusUpdate = async (req, res) => {
  const { taskId } = req.params;
  const owner = await req.user._id;
  const { isDone } = req.body;

  const taskToUpdate = await Task.findOneAndUpdate(
    { _id: taskId, owner: owner },
    { isDone },
    { new: true },
  );

  if (!taskToUpdate) {
    throw createHttpError(404, 'Task not found');
  }

  res.status(200).json({ message: 'The task is updated', taskToUpdate });
};
