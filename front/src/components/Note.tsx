import { useState } from 'react';
import { INote, IProject } from '../models'
import { useDeleteNoteMutation } from '../store/server/server.api';

interface NoteProps {
    note: INote
    project: IProject
    updateNotes: any
}

export function Note({ note, project, updateNotes }: NoteProps) {
    const [textVisible, setTextVisible] = useState(false);
    const role = sessionStorage.getItem('role')
    const [deleteNote] = useDeleteNoteMutation()

    function deleteHandler(){
        deleteNote([project.id, note.id])
        updateNotes(true)
    }

    return (
        <>
        <div
            className='note flex my-3 border flex-col p-1'
        >
            <div className='note-inner flex items-center'>
                <div 
                    className='note-content p-2 flex w-full justify-between  cursor-pointer'
                    onClick={() => setTextVisible(prev => !prev)}
                >
                    <p>{note.title}</p>
                    <p>{note.author.last_name} {note.author.first_name}</p>
                    <p>{note.note_type}</p>
                    <p>{note.updated_at}</p>
                </div>
                {role !== 'user' && <span
                    className='delete-note border p-1 cursor-pointer rounded'
                    onClick={() => deleteHandler()}
                >
                    Удалить
                </span>}
            </div>
            {textVisible && <p className='mb-2 bg-white text-start p-1'>{note.text}</p>}
        </div>
        
        </>
    );
}