const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); 
const path = require('path');
const userRoute = require("./routes/user");
const postRoute = require('./routes/posts');
const msgRoute = require('./routes/sendMessage');
const friendRoute = require('./routes/friend');
const Login  = require('./routes/login');
const register = require('./routes/register');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');
// const { MONGODB_URI } = process.env;
require('dotenv/config');

// connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true });

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error.');
  console.error(err);
  process.exit();
});

mongoose.connection.once('open', () => {
  console.log(`Connected to MongoDB:`);
});

app.use( express.static('uploads'))
app.use(cors());
app.use(express.json());
// Route Middlewares

app.use('/register', register);
app.use('/login', Login);
app.use('/user', userRoute);
app.use('/post', postRoute);
app.use('/message', msgRoute);
app.use('/friend', friendRoute);

app.get('/',(req,res)=>{
  res.send('Welcome !!');
})
 
io.on('connection', (socket) =>{
  socket.emit('news', 'hello');
  socket.on('abc', (data) =>{
    console.log(data);
  });
});

app.listen(3000, () => console.log('Server is listening on port 3000' ));
