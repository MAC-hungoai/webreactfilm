// Check MongoDB movies data
const { MongoClient } = require('mongodb');

const MONGODB_URL = 'mongodb+srv://tranhungoai6_db_user:Huutinh1905A@cluster0.gc8pfyr.mongodb.net/netflix?retryWrites=true&w=majority';

async function checkMovies() {
  const client = new MongoClient(MONGODB_URL);
  
  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');
    
    const db = client.db('netflix');
    const moviesCollection = db.collection('movies');
    
    // Get first 5 movies
    const movies = await moviesCollection.find({ status: 'published' }).limit(5).toArray();
    
    console.log('\n📊 First 5 published movies:');
    movies.forEach((movie, index) => {
      console.log(`\n${index + 1}. ${movie.title}`);
      console.log(`   ID: ${movie._id}`);
      console.log(`   Code: ${movie.code}`);
      console.log(`   trailerUrl: ${movie.trailerUrl || 'MISSING'}`);
      console.log(`   videoUrl: ${movie.videoUrl || 'MISSING'}`);
      console.log(`   imageUrl: ${movie.imageUrl ? 'EXISTS' : 'MISSING'}`);
    });
    
    // Count stats
    const totalMovies = await moviesCollection.countDocuments();
    const publishedMovies = await moviesCollection.countDocuments({ status: 'published' });
    const moviesWithVideo = await moviesCollection.countDocuments({ 
      videoUrl: { $exists: true, $ne: null, $ne: '' } 
    });
    const moviesWithTrailer = await moviesCollection.countDocuments({ 
      trailerUrl: { $exists: true, $ne: null, $ne: '' } 
    });
    
    console.log('\n📈 Stats:');
    console.log(`   Total movies: ${totalMovies}`);
    console.log(`   Published: ${publishedMovies}`);
    console.log(`   With videoUrl: ${moviesWithVideo}`);
    console.log(`   With trailerUrl: ${moviesWithTrailer}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkMovies();
