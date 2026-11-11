// نحملو متغيرات ملف .env
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// الأول نتصلو بقاعدة البيانات، وبعد نشغلو السيرفر
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log( `Serveur lancé sur le port ${PORT}` );
  });
});
