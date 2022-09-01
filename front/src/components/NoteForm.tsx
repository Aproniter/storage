import { useState } from "react";
import { ISendNote } from "../models";
import { useSendNoteMutation } from "../store/server/server.api";


interface NoteFormProps{
    parent:ISendNote,
    setNoteFormVisible:any,
}


// export function NoteForm(props:{project_id?:number, chapter_id?:number, docfile_id?:number, setNoteFormVisible:any}) {
export function NoteForm(props:NoteFormProps) {
    const [sendNote] = useSendNoteMutation()
    const [form_text_value, setFormTextValue] = useState('')
    const [form_title_value, setFormTitleValue] = useState('')
    const isFormValid = () => form_text_value !== ''

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault()
        if (isFormValid()){
            sendNote({
                'project_id': props.parent.project_id,
                'chapter_id': props.parent.chapter_id,
                'docfile_id': props.parent.docfile_id,
                'title': form_title_value,
                'text': form_text_value,
            })
        } else {
            alert('Заполните данные')
        }
        props.setNoteFormVisible(false)
    }


    return (
        <form className="login_form flex flex-col p-2" onSubmit={submitHandler}>
            <input 
                className="login_email p-1 my-2 outline outline-offset-2 outline-1 rounded-sm" 
                type="text"
                placeholder="Название"
                value={form_title_value}
                onChange={event => setFormTitleValue(event.target.value)}
            ></input>
            <input 
                className="login_email p-1 my-2 outline outline-offset-2 outline-1 rounded-sm" 
                type="text"
                placeholder="Введите текст"
                value={form_text_value}
                onChange={event => setFormTextValue(event.target.value)}
            ></input>
            <button className="login p-1 outline my-2 outline-offset-2 outline-1 rounded-sm" type="submit">Отправить</button>
        </form>
    )
}