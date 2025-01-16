import React, { useState } from 'react';

export default function NoteList({ notes, onNoteSelect, onNoteEdit, onNoteDelete }) {
    const [sortOrder, setSortOrder] = useState('newest');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const filteredNotes = notes
        .filter(note => {
            const noteDate = new Date(note.trainingDate);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            return (!start || noteDate >= start) && (!end || noteDate <= end);
        })
        .sort((a, b) => {
            if (sortOrder === 'newest') {
                return new Date(b.trainingDate) - new Date(a.trainingDate);
            } else {
                return new Date(a.trainingDate) - new Date(b.trainingDate);
            }
        });

    return (
        <div className="note-list">
            <h3>Notes</h3>
            <div className="filters">
                <select value={sortOrder} onChange={handleSortChange}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
                <input type="date" value={startDate} onChange={handleStartDateChange} />
                <input type="date" value={endDate} onChange={handleEndDateChange} />
            </div>
            {filteredNotes.length === 0 ? (
                <p>No notes available</p>
            ) : (
                <ul>
                    {filteredNotes.map(note => (
                        <li key={note.id}>
                            <h4>{note.tacticName}</h4>
                            <p>{note.strategy}</p>
                            <p>Effectiveness: {note.effectiveness}</p>
                            <p>Conditions: {note.conditions}</p>
                            <p>Training Date: {note.trainingDate}</p>
                            <p>Opponents: {note.opponents.join(', ')}</p>
                            <div className='buttons'>
                                <button onClick={() => onNoteEdit(note)}>Edit</button>
                                <button onClick={() => onNoteDelete(note.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}