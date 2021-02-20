const mongoose = require('mongoose');

mongoose.connect(process.env.DB,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useUnifiedTopology:true
},(err) => {
  if (err) {
    console.log('Database Connection Error',err);
  }
  else {
    console.log('Connected to Database');
  }
})