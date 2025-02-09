'use client';

import { useState, useEffect } from "react";
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import EditNoteForm from './EditNoteForm';

const addToFavorites = (pokemon) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(fav => fav.name === pokemon.name)) {
        favorites.push(pokemon);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
};

const removeFromFavorites = (pokemon) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.name !== pokemon.name);
    localStorage.setItem('favorites', JSON.stringify(favorites));
};

const getFavorites = () => {
    return JSON.parse(localStorage.getItem('favorites')) || [];
};

const PokemonDetails = ({ pokemon, onDeselect }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [notes, setNotes] = useState([]);
    const [editingNote, setEditingNote] = useState(null);

    useEffect(() => {
        const favorites = getFavorites();
        setIsFavorite(favorites.some(fav => fav.name === pokemon.name));
    }, [pokemon]);

    useEffect(() => {
        const allNotes = JSON.parse(localStorage.getItem('notes') || '[]');
        const pokemonNotes = allNotes.filter(note => note.pokemonId === pokemon.id);
        setNotes(pokemonNotes);
    }, [pokemon]);

    const handleFavoriteToggle = (e) => {
        e.stopPropagation();
        if (isFavorite) {
            removeFromFavorites(pokemon);
        } else {
            addToFavorites(pokemon);
        }
        setIsFavorite(!isFavorite);
    };

    const handleNoteSelect = (note) => {
        // Handle note selection (e.g., for editing)
        console.log('Selected note:', note);
    };

    const handleEditNote = (note) => {
        setEditingNote(note);
    };

    const handleCancel = () => {
        setEditingNote(null);
    };

    const handleSaveNote = (updatedNote) => {
        const updatedNotes = notes.map(note => note.id === updatedNote.id ? updatedNote : note);
        setNotes(updatedNotes);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
        setEditingNote(null);
    };

    const handleDeleteNote = (noteId) => {
        const updatedNotes = notes.filter(note => note.id !== noteId);
        setNotes(updatedNotes);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
    };

    const handleAddNote = (newNote) => {
        const updatedNotes = [...notes, newNote];
        setNotes(updatedNotes);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
    };

    return (
        <div className="pokemon-details-container">
            <div className="note-form-container">
                <NoteForm pokemonId={pokemon.id} onAddNote={handleAddNote} />
            </div>

            <div id="pokemon-details" onClick={onDeselect}>
                <div className="detail-container">
                    <div className="detail-header">
                        <h2>{pokemon.name}</h2>
                        <img src={pokemon.image2} alt={pokemon.name} />
                    </div>
                    <div className="detail-types">
                        <h3>Types:</h3>
                        <p>{pokemon.types.map(type => type.type.name).join(', ')}</p>
                    </div>
                    <div className="detail-stats">
                        <h3>Statistics:</h3>
                        <ul>
                            {pokemon.stats.map(stat => (
                                <li key={stat.stat}>{stat.stat}: {stat.base_stat} (effort: {stat.effort})</li>
                            ))}
                        </ul>
                    </div>
                    <div className="detail-parameters">
                        <h3>Parameters:</h3>
                        <p>Height: {pokemon.height} m</p>
                        <p>Weight: {pokemon.weight} kg</p>
                    </div>
                    <button onClick={handleFavoriteToggle}>
                        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                </div>
            </div>
            <div className="note-list-container">
                {editingNote ? (
                    <EditNoteForm noteId={editingNote.id} onSave={handleSaveNote} onCancel={handleCancel}/>
                ) : (
                    <NoteList 
                        notes={notes} 
                        onNoteSelect={handleNoteSelect} 
                        onNoteEdit={handleEditNote} 
                        onNoteDelete={handleDeleteNote} 
                    />
                )}
            </div>
        </div>
    );
};

export default PokemonDetails;