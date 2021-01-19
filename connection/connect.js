const mongoose = require('mongoose');
var connect = async function() {
   try {
       
       await mongoose.connect('mongodb://localhost:27017/testdata', {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false}, (error, result) => {
            if (error) {
                console.log(error);
                return reject(error);
            }
            process.conn1 = mongoose.connection;
            console.log('successfully connected!');
            
        });
   } catch (err) {
       return console.log(err)
   }
};
module.exports = connect;