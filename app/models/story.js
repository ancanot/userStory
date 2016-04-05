var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StorySchema = new Schema({
	//Creator-um drvuma User table-i _id, stegh et kapna cuyc talis
	creator: { type: Schema.Types.ObjectId, ref: 'User' },
	content: String,
	created: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Story', StorySchema);