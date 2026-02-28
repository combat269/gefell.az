// importing routes for auth and products
// const authRoutes = require('./routes/authRoutes'); // using this later for login logic
const productRoutes = require('./routes/productRoutes'); 

// setting up the api endpoints
// app.use('/api/v1/auth', authRoutes); 
app.use('/api/v1/products', productRoutes); // main route for the product catalog