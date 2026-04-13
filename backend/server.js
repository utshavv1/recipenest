const app = require('./src/app');
const { PORT, NODE_ENV } = require('./src/config/config');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`API: http://localhost:${PORT}`);
});