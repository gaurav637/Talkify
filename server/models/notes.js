const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"]
    },
    content: {
        type: String,
        required: [true, "Please provide content"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attachments: [{
        type: String // URLs for any attached files
    }],
    tags: [{
        type: String
    }],
    isArchived: {
        type: Boolean,
        default: false
    },
    isPinned: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const NoteModel = mongoose.model('Note', noteSchema)

module.exports = NoteModel
