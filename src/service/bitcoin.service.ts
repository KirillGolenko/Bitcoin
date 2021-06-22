import { Bitcoin } from '../mongobd/bitcoin';
import { Request, Response, NextFunction } from 'express';
import dotend from 'dotenv';
import { IUser, IBitcoin } from '../dto/dto';
import Logger from '../logger';
dotend.config();

export const bitcoinInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Bitcoin.findOne({ _id: process.env.BITCOIN_ID }, { _id: 0, __v: 0 }).then(
    (result: IUser) => res.send(result),
  );
};

export const updateBitcoin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { price } = req.body;

  Bitcoin.findOneAndUpdate(
    { _id: process.env.BITCOIN_ID },
    { $set: { price: price } },
    { new: true },
    (err, data: IBitcoin) => {
      if (err) {
        Logger.error('Failed to update', __filename, 'updateBitcoin');
        return res.status(400).json({ errors: 'Failed to update' });
      }
      res.json({ price: data.price, updatedAt: data.updatedAt });
    },
  );
};
