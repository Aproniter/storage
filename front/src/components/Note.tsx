import { useState } from 'react';
import { INote } from '../models'

interface NoteProps {
    note: INote
}

export function Note({ note }: NoteProps) {
    const [textVisible, setTextVisible] = useState(false);

    return (
        <>
        <div
            className='note flex my-3 border flex-col p-1'
        >
            <div>
                <div className='note-header flex w-full justify-between items-center'>
                    <p>{note.title}</p>
                    <p>{note.author.last_name} {note.author.first_name}</p>
                    <p>{note.note_type}</p>
                    <p>{note.updated_at}</p>
                    <div className="tool p-1 hover:shadow shadow-2xl items-center flex flex-col" data-tooltip='Показать/скрыть'>
                        <span className='text-xs mb-1'>текст</span>
                        <svg 
                            className='w-8 h-8'
                            onClick={() => setTextVisible(prev => !prev)}
                            id="Layer_1" height="512" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m7 12h10v2h-10zm0 6h7v-2h-7zm15-10.414v16.414h-20v-21a3 3 0 0 1 3-3h9.414zm-7-.586h3.586l-3.586-3.586zm5 15v-13h-7v-7h-8a1 1 0 0 0 -1 1v19z"/></svg>
                    </div>
                </div>
            </div>
            {textVisible && <p className='mb-2 bg-white text-start p-1'>{note.text}</p>}
        </div>
        
        </>
    );
}