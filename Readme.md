# Description

[Express](https://expressjs.com/ru/) framework TypeScript starter repository.

# Installation

```bash
$ npm install
```

# Running the app

```bash
# development
$ npm run start
```

# Endpoints

#### Default domain http://localhost:8000/api/

1. ###### POST - /users - user sign-up. Body will be:

```javascript
{
    "name": "Jon A",
    "username": "jonjon",
    "email": "test1@gmail.com"
}
```

2. ###### PUT - /bitcoin - updates the bitcoin price. Bitcoin will be saved as the following object:

```javascript
{
    "price": 100
}
```

3. ###### GET - /bitcoin - retrieves the current bitcoin objec

4. ###### GET - /users/:id - retrieves a user object (including all the added fields)

5. ###### PUT - /users/:id - allows a user to change the name or the email of a user and updates the updatedAt field. Returns a full user object

6. ###### POST - /users/:userId/usd - Allows a user to deposit or withdraw us dollars. Body will be:

```javascript
{
    "action": "withdraw" or "deposit",
    "amount": 10
}
```

7. ###### POST - /users/:userId/bitcoins - Allows a user to buy or sell bitcoins. Body will be:

```javascript
{
    "action": "buy" or "sell",
    "amount": 0.05
}
```

8. ###### GET - /users/:userId/balance - Retrieves the total balance of the user in usd (amount in usd + amount of bitcoins converted to usd
