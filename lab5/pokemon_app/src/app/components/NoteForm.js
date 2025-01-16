import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

export default function NoteForm({ pokemonId, onAddNote }) {
    const formik = useFormik({
        initialValues: {
            tacticName: '',
            strategy: '',
            effectiveness: 1,
            conditions: '',
            trainingDate: new Date().toISOString().split('T')[0],
            opponents: [],
        },
        validationSchema: Yup.object({
            tacticName: Yup.string()
                .required('Required')
                .min(5, 'Must be at least 5 characters')
                .max(50, 'Must be 50 characters or less'),
            strategy: Yup.string()
                .required('Required')
                .min(10, 'Must be at least 10 characters'),
            effectiveness: Yup.number()
                .required('Required')
                .min(1, 'Min value is 1')
                .max(5, 'Max value is 5'),
            conditions: Yup.string()
                .required('Required')
                .min(10, 'Must be at least 10 characters'),
            trainingDate: Yup.date()
                .required('Required'),
            opponents: Yup.array()
                .of(Yup.string())
                .min(1, 'Select at least one opponent type')
                .required('Required'),
        }),
        onSubmit: values => {
            const note = {
                id: uuidv4(),
                pokemonId: pokemonId,
                ...values,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // Get existing notes from localStorage
            const existingNotes = JSON.parse(localStorage.getItem('notes') || '[]');

            // Add new note
            const updatedNotes = [...existingNotes, note];

            // Save to localStorage
            localStorage.setItem('notes', JSON.stringify(updatedNotes));

            // Call the parent component's callback to update the state
            onAddNote(note);

            // Reset form
            formik.resetForm();

            console.log('Note saved:', note);
        },
    });

    const pokemonTypes = [
        'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
        'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic',
        'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
    ];

    return (
        <form onSubmit={formik.handleSubmit} className="note-form">
            <label htmlFor="tacticName">Tactic Name</label>
            <input
                id="tacticName"
                type="text"
                {...formik.getFieldProps('tacticName')}
            />
            {formik.touched.tacticName && formik.errors.tacticName ? (
                <div>{formik.errors.tacticName}</div>
            ) : null}

            <label htmlFor="strategy">Strategy</label>
            <textarea
                id="strategy"
                {...formik.getFieldProps('strategy')}
            />
            {formik.touched.strategy && formik.errors.strategy ? (
                <div>{formik.errors.strategy}</div>
            ) : null}

            <label htmlFor="effectiveness">Effectiveness (1-5)</label>
            <select
                id="effectiveness"
                {...formik.getFieldProps('effectiveness')}
            >
                <option value="1">1 - Not Effective</option>
                <option value="2">2 - Slightly Effective</option>
                <option value="3">3 - Moderately Effective</option>
                <option value="4">4 - Very Effective</option>
                <option value="5">5 - Extremely Effective</option>
            </select>
            {formik.touched.effectiveness && formik.errors.effectiveness ? (
                <div>{formik.errors.effectiveness}</div>
            ) : null}

            <label htmlFor="conditions">Conditions</label>
            <input
                id="conditions"
                {...formik.getFieldProps('conditions')}
            />
            {formik.touched.conditions && formik.errors.conditions ? (
                <div>{formik.errors.conditions}</div>
            ) : null}

            <label htmlFor="trainingDate">Training Date</label>
            <input
                id="trainingDate"
                type="date"
                {...formik.getFieldProps('trainingDate')}
            />
            {formik.touched.trainingDate && formik.errors.trainingDate ? (
                <div>{formik.errors.trainingDate}</div>
            ) : null}

            <label htmlFor="opponents">Opponent Types</label>
            <select
                id="opponents"
                multiple
                {...formik.getFieldProps('opponents')}
            >
                {pokemonTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
            {formik.touched.opponents && formik.errors.opponents ? (
                <div>{formik.errors.opponents}</div>
            ) : null}

            <button type="submit">Submit</button>
        </form>
    );
};