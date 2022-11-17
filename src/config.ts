require('dotenv').config();

const {
  PORT = 3000,
  DATABASE = 'mongodb://localhost:27017/mestodb',
} = process.env;

const JWT_SECRET = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'jwt_secret_key';

const defaultUser = {
  NAME: 'Жак-Ив Кусто',
  ABOUT: 'Исследователь',
  AVATAR: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
};

export {
  PORT, DATABASE, defaultUser, JWT_SECRET,
};
