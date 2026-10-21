const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../server/.env') });

const Weeb = require('../../server/src/models/Weeb');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const testEmail = 'benchmark_user@sugooianime.test';
  let user = await Weeb.findOne({ email: testEmail });

  if (!user) {
    const hashedPassword = await bcrypt.hash('TestPass123!', 10);
    user = await Weeb.create({
      username: 'benchmark_runner',
      email: testEmail,
      password: hashedPassword,
      watchlist: [
        { mal_id: 1, title: 'Cowboy Bebop', imageUrl: 'https://cdn.myanimelist.net/images/anime/4/19644.jpg' },
        { mal_id: 20, title: 'Naruto', imageUrl: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg' },
        { mal_id: 11061, title: 'Hunter x Hunter (2011)', imageUrl: 'https://cdn.myanimelist.net/images/anime/11/33657.jpg' },
      ],
      history: {
        all: [
          { mal_id: 1, title: 'Cowboy Bebop', imageUrl: 'https://cdn.myanimelist.net/images/anime/4/19644.jpg' },
          { mal_id: 5114, title: 'Fullmetal Alchemist: Brotherhood', imageUrl: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg' },
        ],
        watching: [
          { mal_id: 11061, title: 'Hunter x Hunter (2011)', imageUrl: 'https://cdn.myanimelist.net/images/anime/11/33657.jpg' },
        ],
        completed: [
          { mal_id: 1, title: 'Cowboy Bebop', imageUrl: 'https://cdn.myanimelist.net/images/anime/4/19644.jpg' },
        ],
      },
    });
    console.log('Created benchmark test user');
  } else {
    console.log('Benchmark user already exists');
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log('TOKEN_EXPORT=' + token);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

