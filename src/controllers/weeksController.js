import createHttpError from 'http-errors';
import { calculateWeekNumber } from '../utils/calculateWeekNumber.js';
import { BabyState } from '../models/baby_states.js';
import { MomState } from '../models/mom_state.model.js';

import { User } from '../models/user.model.js';

export const getPreviewInfo = async (req, res, next) => {
  try {
    const dataBaby = await BabyState.findOne({ weekNumber: 1 });
    const dataMom = await MomState.findOne({ weekNumber: 2 });
    res
      .status(200)
      .json({ message: 'Info for the first week', dataBaby, dataMom });
  } catch (error) {
    next(error);
  }
};

export const getBabyWeekInfo = async (req, res, next) => {
  try {
    const weekNumber = Number(req.params.week);
    const babyData = await BabyState.find({ weekNumber: weekNumber });
    res
      .status(200)
      .json({ message: `This is info for baby week ${weekNumber}`, babyData });
  } catch (error) {
    next(error);
  }
};

export const getMomWeekInfo = async (req, res, next) => {
  try {
    const weekNumber = Number(req.params.week);
    const momData = await MomState.findOne({ weekNumber: weekNumber });
    res
      .status(200)
      .json({ message: `This is info for mom week ${weekNumber}`, momData });
  } catch (error) {
    next(error);
  }
};

// створити ПРИВАТНИЙ ендпоінт для ОТРИМАННЯ даних з інформацією про номер тижня вагітності,
// к-сть днів до пологів(розраховується від дати пологів або за відсутності, як різницю в днях
// між поточним тижнем та останнім), інформацію про малюка відповідно до дашборду, пораду для мами.

export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const weekNumberDefault = 1;
    const daysToDeliverDefault = (40 - 1) * 7;
    const user = await User.findById(userId);
    if (!user) {
      throw createHttpError(404, 'There is no such user');
    }

    const dueDate = user.dueDate;
    if (!dueDate) {
      const [babyState, momState] = await Promise.all([
        BabyState.findOne({ weekNumber: weekNumberDefault }),
        MomState.findOne({ weekNumber: weekNumberDefault }),
      ]);
      return res.status(200).json({
        message:
          "You didn't fill the day of deliver in the form. Your data is calculated based on assumption you are in a very beginng of the journey",
        babyState,
        momState,
        daysToDeliver: daysToDeliverDefault,
        currWeekNumber: weekNumberDefault,
      });
    }

    const { weekNumber, diffDays } = calculateWeekNumber(dueDate);
    const [babyState, momState] = await Promise.all([
      BabyState.findOne({ weekNumber: weekNumber }),
      MomState.findOne({ weekNumber: weekNumber }),
    ]);

    res.status(200).json({
      message: "Info for User's dashboard",
      babyState,
      momState,
      daysToDeliver: diffDays,
      currWeekNumber: weekNumber,
    });
  } catch (error) {
    next(error);
  }
};
