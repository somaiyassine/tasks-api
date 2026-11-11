const mongoose = require('mongoose');

// هذي الدالة تعمل الاتصال بقاعدة البيانات MongoDB
const connectDB = async () => {
  try {
    // نستعملو الرابط اللي موجود في ملف .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté ✅');
  } catch (error) {
    // كان صار مشكل في الاتصال نطلعو الغلطة ونوقفو البرنامج
    console.error('Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;