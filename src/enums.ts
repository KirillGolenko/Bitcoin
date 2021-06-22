export class LoggerConstant {
  static readonly LOG_LEVEL_ERROR = 'error';
  static readonly LOG_LEVEL_INFO = 'info';
  static readonly LOG_LEVEL_DEBUG = 'debug';
}

export class Action {
  static readonly ACTION_WITHDRAW = 'withdraw';
  static readonly ACTION_DEPOSIT = 'deposit';
  static readonly ACTION_SELL = 'sell';
  static readonly ACTION_BUY = 'buy';
}

export class Field {
  static readonly ACTION = 'action';
  static readonly AMOUNT = 'amount';
  static readonly PRICE = 'price';
  static readonly NAME = 'name';
  static readonly USERNAME = 'username';
  static readonly EMAIL = 'email';
}
