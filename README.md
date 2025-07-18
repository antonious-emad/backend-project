# AllYouCanEat

 is your go-to platform for ordering food online from your favorite restaurants, hassle-free.

## Getting Started

These are the instructions to clone and run this project in your local machine for developement and testing purpose

### Prerequisites

- Node
- Git
- MongoDB

### Installation

1. First of all, Clone this repository & navigate to the directory

```
git clone https://github.com/Abanobshafeeq/All-You-Can-Eat
cd All-You-Can-Eat
```

2. Install the Dependencies

```
npm install
```

### Running Locally

- First Create `.env` file in root directory using the following content and make changes if required.

```
PORT=6013
MONGO_URI=mongodb+srv://foodly:7Lgu0PKDCr3yd2Mg@foodly.49ssjmc.mongodb.net/foodly
TOKEN_SECRET=foodlyflutter
```

- Starting the Server

```
npm start
or
npm run dev
```

### Adding Food Items to Database Collection (Menu)

To add food items to database run

```
npm run menu
```

Edit `items.csv` file under `assets/csv` to change food items.

## Built Using

- [NodeJS](https://nodejs.org/en) - Server
- [Express](https://expressjs.com/) - Server Framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - Object Modeling & Schema
- [EJS](https://ejs.co/) - Template Engine
