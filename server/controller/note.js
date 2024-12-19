const NoteModel = require('../models/notes')

// Create a new note
const createNote = async (req, res) => {
    try {
        console.log("notes-> ",req.body)
        const { title, content, tags } = req.body
        const userId = req.user._id

        const note = await NoteModel.create({
            title,
            content,
            user: userId,
            tags: tags || [],
        })

        res.status(201).json({
            success: true,
            note
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get all notes for a user
const getNotes = async (req, res) => {
    try {
        const userId = req.user._id
        const notes = await NoteModel.find({ user: userId, isArchived: false })
            .sort({ isPinned: -1, updatedAt: -1 })

        res.status(200).json({
            success: true,
            notes
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get archived notes
const getArchivedNotes = async (req, res) => {
    try {
        const userId = req.user._id
        const notes = await NoteModel.find({ user: userId, isArchived: true })
            .sort({ updatedAt: -1 })

        res.status(200).json({
            success: true,
            notes
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Update a note
const updateNote = async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body
        
        const note = await NoteModel.findOneAndUpdate(
            { _id: id, user: req.user._id },
            updates,
            { new: true }
        )

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            })
        }

        res.status(200).json({
            success: true,
            note
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Delete a note
const deleteNote = async (req, res) => {
    try {
        const { id } = req.params
        const note = await NoteModel.findOneAndDelete({ _id: id, user: req.user._id })

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    createNote,
    getNotes,
    getArchivedNotes,
    updateNote,
    deleteNote
}
