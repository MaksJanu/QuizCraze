import React, { useState, useEffect } from 'react';

export default function EditNoteForm ({ noteId, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        tacticName: '',
        strategy: '',
        effectiveness: 1,
        conditions: '',
        trainingDate: '',
        opponents: []
    });
    const [errors, setErrors] = useState({});

    const [touched, setTouched] = useState({
        tacticName: false,
        strategy: false,
        effectiveness: false,
        conditions: false,
        trainingDate: false,
        opponents: false
    });

    // Load existing note data
    useEffect(() => {
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        const noteToEdit = notes.find(note => note.id === noteId);
        if (noteToEdit) {
            setFormData(noteToEdit);
        }
    }, [noteId]);

    // Validation function
    const validate = values => {
        const errors = {};
    
        if (!values.tacticName) {
            errors.tacticName = 'Required';
        } else if (values.tacticName.length < 5) {
            errors.tacticName = 'Must be at least 5 characters';
        } else if (values.tacticName.length > 50) {
            errors.tacticName = 'Must be 50 characters or less';
        }
    
        if (!values.strategy) {
            errors.strategy = 'Required';
        } else if (values.strategy.length < 10) {
            errors.strategy = 'Must be at least 10 characters';
        }
    
        if (!values.conditions) {
            errors.conditions = 'Required';
        } else if (values.conditions.length < 10) {
            errors.conditions = 'Must be at least 10 characters';
        }
    
        if (!values.trainingDate) {
            errors.trainingDate = 'Required';
        }
    
        if (!values.opponents || values.opponents.length === 0) {
            errors.opponents = 'Select at least one opponent';
        }
    
        return errors;
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'select-multiple') {
            const options = e.target.options;
            const selectedValues = [];
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    selectedValues.push(options[i].value);
                }
            }
            setFormData(prev => ({
                ...prev,
                [name]: selectedValues
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate(formData);
        
        if (Object.keys(newErrors).length === 0) {
            // Get existing notes
            const notes = JSON.parse(localStorage.getItem('notes') || '[]');
            // Update the note
            const updatedNotes = notes.map(note => 
                note.id === noteId 
                    ? { ...formData, updatedAt: new Date().toISOString() }
                    : note
            );
            // Save back to localStorage
            localStorage.setItem('notes', JSON.stringify(updatedNotes));
            onSave(updatedNotes.find(note => note.id === noteId));
        } else {
            setErrors(newErrors);
        }
    };

    // Handle cancel button click
    const handleCancel = () => {
        onCancel();
    };


    const pokemonTypes = [
        'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 
        'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 
        'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
    ];


    // Form return statement:
    return (
        <form onSubmit={handleSubmit} className='edit-note-form'>
            <div>
                <label htmlFor="tacticName">Tactic Name:</label>
                <input
                    type="text"
                    id="tacticName"
                    name="tacticName"
                    value={formData.tacticName}
                    onChange={handleChange}
                    onBlur={() => setTouched(prev => ({ ...prev, tacticName: true }))}
                />
                {touched.tacticName && errors.tacticName && (
                    <div className="error">{errors.tacticName}</div>
                )}
            </div>

            <div>
                <label htmlFor="strategy">Strategy:</label>
                <textarea
                    id="strategy"
                    name="strategy"
                    value={formData.strategy}
                    onChange={handleChange}
                    onBlur={() => setTouched(prev => ({ ...prev, strategy: true }))}
                />
                {touched.strategy && errors.strategy && (
                    <div className="error">{errors.strategy}</div>
                )}
            </div>

            <div>
                <label htmlFor="effectiveness">Effectiveness:</label>
                <select
                    id="effectiveness"
                    name="effectiveness"
                    value={formData.effectiveness}
                    onChange={handleChange}
                    onBlur={() => setTouched(prev => ({ ...prev, effectiveness: true }))}
                >
                    <option value="1">1 - Not Effective</option>
                    <option value="2">2 - Slightly Effective</option>
                    <option value="3">3 - Moderately Effective</option>
                    <option value="4">4 - Very Effective</option>
                    <option value="5">5 - Extremely Effective</option>
                </select>
                {touched.effectiveness && errors.effectiveness && (
                    <div className="error">{errors.effectiveness}</div>
                )}
            </div>

            <div>
                <label htmlFor="conditions">Conditions:</label>
                <textarea
                    id="conditions"
                    name="conditions"
                    value={formData.conditions}
                    onChange={handleChange}
                    onBlur={() => setTouched(prev => ({ ...prev, conditions: true }))}
                />
                {touched.conditions && errors.conditions && (
                    <div className="error">{errors.conditions}</div>
                )}
            </div>

            <div>
                <label htmlFor="trainingDate">Training Date:</label>
                <input
                    type="date"
                    id="trainingDate"
                    name="trainingDate"
                    value={formData.trainingDate}
                    onChange={handleChange}
                    onBlur={() => setTouched(prev => ({ ...prev, trainingDate: true }))}
                />
                {touched.trainingDate && errors.trainingDate && (
                    <div className="error">{errors.trainingDate}</div>
                )}
            </div>

            <div>
                <label htmlFor="opponents">Opponents:</label>
                <select
                    id="opponents"
                    name="opponents"
                    multiple
                    value={formData.opponents}
                    onChange={handleChange}
                    onBlur={() => setTouched(prev => ({ ...prev, opponents: true }))}
                >
                    {pokemonTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                {touched.opponents && errors.opponents && (
                    <div className="error">{errors.opponents}</div>
                )}
            </div>
            <div className='buttons'>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </div>
        </form>
    );
};