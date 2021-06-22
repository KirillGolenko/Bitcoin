import { Router } from 'express';
import {
  registration,
  userInfo,
  userUpdateInfo,
  userUpdateUsd,
  userUpdateBitcoin,
  userBalance,
} from '../service/user.service';
import { updateBitcoin, bitcoinInfo } from '../service/bitcoin.service';
import {
  userValidationRules,
  bitcoinValidationRules,
  updateValidationRules,
  userUpdateValidationRules,
  validator,
} from './validator';

const router = Router();

router.post('/users', userValidationRules(), validator, registration);

router.get('/users/:id', userInfo);

router.put(
  '/users/:id',
  userUpdateValidationRules(),
  validator,
  userUpdateInfo,
);

router.post(
  '/users/:userId/usd',
  updateValidationRules(),
  validator,
  userUpdateUsd,
);

router.post(
  '/users/:userId/bitcoins',
  updateValidationRules(),
  validator,
  userUpdateBitcoin,
);

router.get('/users/:userId/balance', userBalance);

router.get('/bitcoin', bitcoinInfo);
router.put('/bitcoin', bitcoinValidationRules(), validator, updateBitcoin);

export default router;
