// Root server entry point proxying to backend/server.js
const app = require('./backend/server');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 ViVA E-Commerce Storefront running at: http://localhost:${PORT}`);
});
