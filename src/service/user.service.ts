import { Request, Response, NextFunction } from 'express';
import { Users } from '../mongobd/user';
import { Bitcoin } from '../mongobd/bitcoin';
import { Action } from '../enums';
import { IUser } from '../dto/dto';
import Logger from '../logger';

export const userBalance = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  try {
    const [userResult, bitcoinResult] = await Promise.all([
      Users.findOne({ _id: userId }),
      Bitcoin.findOne({ _id: process.env.BITCOIN_ID }),
    ]);
    const { usdBalance, bitcoinAmount } = userResult;
    const { price } = bitcoinResult;

    const balance = usdBalance + bitcoinAmount * price;
    res.json({ data: balance });
  } catch (error) {
    res.status(404).json({ errors: 'User not found' });
  }
};

export const registration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, username, email } = req.body;
  const dublicate: IUser = await Users.findOne({ email });

  if (dublicate) {
    res.status(401).json({ error: 'Email already use' });
  } else {
    const user = new Users({
      name,
      username,
      email,
    });
    user.save().then((result: any) => res.json({ data: result }));
  }
};

export const userInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let { id } = req.params;

  Users.findOne({ _id: id })
    .then((result: any) => {
      res.json({ data: result });
    })
    .catch(() => {
      Logger.error('User not found', __filename, 'userInfo');
      res.status(404).json({ errors: 'User not found' });
    });
};

export const userUpdateInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    Users.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true },
      (err, data) => {
        res.json({ data: data });
      },
    );
  } catch (error) {
    Logger.error('User not found', __filename, 'userUpdateInfo');
    return res.status(404).json({ errors: 'User not found' });
  }
};

export const userUpdateUsd = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  const { action, amount } = req.body;

  const { usdBalance } = await Users.findOne({ _id: userId });
  let balance = 0;

  switch (action) {
    case Action.ACTION_WITHDRAW:
      balance = usdBalance - amount;
      if (balance < 0) return res.json({ data: 'You are missing usd' });
      break;

    case Action.ACTION_DEPOSIT:
      balance = usdBalance + amount;
      break;

    default:
      return res.json({ data: 'Not found action' });
  }

  Users.findOneAndUpdate(
    { _id: userId },
    { $set: { usdBalance: balance } },
    { new: true },
    (err, result) => {
      if (err) {
        Logger.error('User not found', __filename, 'userUpdateInfo');
        return res.status(404).json({ errors: 'User not found' });
      }
      res.json({ data: result });
    },
  );
};

export const userUpdateBitcoin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  const { action, amount } = req.body;

  const [userResult, bitcoinResult] = await Promise.all([
    Users.findOne({ _id: userId }),
    Bitcoin.findOne({ _id: process.env.BITCOIN_ID }),
  ]);

  const { usdBalance, bitcoinAmount } = userResult;
  const { price } = bitcoinResult;
  let balanceUsd = 0;
  let balanceBit = 0;

  switch (action) {
    case Action.ACTION_BUY:
      balanceUsd = usdBalance - price * amount;
      balanceBit = bitcoinAmount + amount;
      if (balanceUsd < 0) return res.json({ data: 'Insufficient funds' });
      Logger.info('Successfully bought', __filename, 'userUpdateBitcoin');
      break;

    case Action.ACTION_SELL:
      balanceUsd = usdBalance + price * amount;
      balanceBit = bitcoinAmount - amount;
      if (balanceBit < 0) return res.json({ data: 'Insufficient funds' });
      Logger.info('Successfully sold', __filename, 'userUpdateBitcoin');
      break;

    default:
      return res.json({ data: 'Not found action' });
  }

  Users.findOneAndUpdate(
    { _id: userId },
    { $set: { usdBalance: balanceUsd, bitcoinAmount: balanceBit } },
    { new: true },
    (err, result) => {
      if (err) {
        Logger.error('User not found', __filename, 'userUpdateInfo');
        return res.status(404).json({ errors: 'User not found' });
      }
      res.json({ data: result });
    },
  );
};
