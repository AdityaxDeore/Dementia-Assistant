console.log('Starting diagnosis...');

// Check if required environment variables are set
console.log('Environment variables check:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('- PORT:', process.env.PORT || 'Not set (will default to 5000)');

// Check if required modules can be imported
try {
  console.log('\nModule import check:');
  import('express').then(() => console.log('- Express: OK')).catch(err => console.error('- Express:', err.message));
  import('mongoose').then(() => console.log('- Mongoose: OK')).catch(err => console.error('- Mongoose:', err.message));
  import('bcryptjs').then(() => console.log('- Bcrypt: OK')).catch(err => console.error('- Bcrypt:', err.message));
  import('jsonwebtoken').then(() => console.log('- JWT: OK')).catch(err => console.error('- JWT:', err.message));
  
  console.log('\nDiagnostic script completed!');
  console.log('If the main server is not starting, check the server logs for MongoDB connection issues.');
  
} catch (error) {
  console.error('Error during diagnosis:', error.message);
}