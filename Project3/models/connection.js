const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const connectionSchema = new Schema({
    title: {type:String, required: [true, 'title is required']},
    category: {type:String, required: [true, 'category is required']},
    content:{type:String, required: [true, 'content is required'],
    minLength: [10, 'the content should have at least 10 characters']},
    details:{type:String, required:[true, 'details are required']},
    author:{type:String, required: [true, 'author is required'], ref:'User'},
    location:{type:String, required:[true, 'location is required']},
    startTime:{type:String, required:[true, 'Start time is required']},
    endTime:{type:String, required:[true, 'End time is required']}
},
);
connectionSchema.set('timestamps', true);
//collection name is connection in the database
module.exports = mongoose.model('Connection', connectionSchema);
 
