import { Request, Response, NextFunction } from 'express';
import { Users } from '../mongobd/user';
import { Bitcoin } from '../mongobd/bitcoin';
import { Action } from '../enums';
import { IUser, IBitcoin, IObjectKeys } from '../interface/interface';
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
    user.save().then((result: IUser) => res.json({ data: result }));
  }
};

export const userInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let { id } = req.params;

  Users.findOne({ _id: id })
    .then((result: IUser) => {
      res.json({ data: result });
    })
    .catch((err: any) => {
      Logger.error(err, __filename, 'userInfo');
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
    const { email, username } = req.body;
    let data: IObjectKeys = {};
    if (email) data.email = email;
    if (username) data.username = username;
    Users.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true },
      (err, result: IUser) => {
        res.json({ data: result });
      },
    );
  } catch (error) {
    Logger.error(error, __filename, 'userUpdateInfo');
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
  let usdBalance;
  let balance = 0;

  try {
    const userResult: IUser = await Users.findOne({ _id: userId });
    usdBalance = userResult.usdBalance;
  } catch (error) {
    Logger.error(error, __filename, 'userUpdateUsd');
    return res.status(404).json({ errors: 'User not found' });
  }

  switch (action) {
    case Action.action_withdraw:
      balance = usdBalance - amount;
      if (balance < 0) return res.json({ data: 'You are missing usd' });
      break;

    case Action.action_deposit:
      balance = usdBalance + amount;
      break;

    default:
      return res.json({ data: 'Not found action' });
  }

  Users.findOneAndUpdate(
    { _id: userId },
    { $set: { usdBalance: balance } },
    { new: true },
    (err, result: IUser) => {
      if (err) {
        Logger.error(err, __filename, 'userUpdateUsd');
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
  let balanceUsd = 0;
  let balanceBit = 0;
  let user: IUser;
  let bitcoin: IBitcoin;

  try {
    const [userResult, bitcoinResult] = await Promise.all([
      Users.findOne({ _id: userId }),
      Bitcoin.findOne({ _id: process.env.BITCOIN_ID }),
    ]);
    user = userResult;
    bitcoin = bitcoinResult;
  } catch (error) {
    Logger.error(error, __filename, 'userUpdateBitcoin');
    return res.status(404).json({ errors: 'User not found' });
  }

  const { usdBalance, bitcoinAmount } = user;
  const { price } = bitcoin;

  switch (action) {
    case Action.action_buy:
      balanceUsd = usdBalance - price * amount;
      balanceBit = bitcoinAmount + amount;
      if (balanceUsd < 0) return res.json({ data: 'Insufficient funds' });
      Logger.info('Successfully bought', __filename, 'userUpdateBitcoin');
      break;

    case Action.action_sell:
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
    (err, result: IUser) => {
      if (err) {
        Logger.error(err, __filename, 'userUpdateInfo');
      }
      res.json({ data: result });
    },
  );
};
