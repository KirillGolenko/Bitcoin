export interface IUser {
  name: string;
  username: string;
  email: string;
  bitcoinAmount: number;
  usdBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface IBitcoin {
  price: number;
  updatedAt: string;
}
