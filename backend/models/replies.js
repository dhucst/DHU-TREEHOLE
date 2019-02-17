const mongoose = require('../lib/database').database_conn;
const ReplySchema = require('../lib/database').ReplySchema;
const ReplyModel = mongoose.model('Reply', ReplySchema);


exports.Reply = ReplyModel;
