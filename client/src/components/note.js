import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import { motion } from 'framer-motion';

const NotesModal = ({ onClose }) => {
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch the existing note
    const fetchNotes = async () => {
        try {
            const response = await fetch('/api/notes');
            if (!response.ok) {
                throw new Error('Failed to fetch note');
            }

            const data = await response.json();
            if (data.success && data.note) {
                setNotes(data.note.content);
            }
        } catch (error) {
            console.error('Error fetching note:', error);
            const savedNotes = localStorage.getItem('userNotes');
            if (savedNotes) setNotes(savedNotes); // Fallback to localStorage
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleSaveNotes = async () => {
        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: 'Quick Note',
                    content: notes,
                    tags: []
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save note');
            }

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('userNotes', notes); // Backup
            }
        } catch (error) {
            console.error('Error saving note:', error);
            localStorage.setItem('userNotes', notes); // Fallback
        }
        onClose();
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-gray-900 rounded-lg p-6 w-full max-w-lg mx-4"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Quick Notes</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-300 hover:text-gray-100 transition-colors"
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write your notes here..."
                    className="w-full h-64 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-800 text-white placeholder-gray-400"
                />

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveNotes}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Save Notes
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default NotesModal;
