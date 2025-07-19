import React, { useRef } from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import '../components/quill.css'


const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  }

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
]

const TicketCreate = () =>{
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [quilltext, setQuilltext] = useState('');
    
    const handleCreateTicket = (e) =>{
        e.preventDefault();

        console.log(quilltext);

        axios.post("http://localhost:3000/api/ticket-create", {
            title: title,
            description: quilltext
        })
        .then((response) => {
            console.log(response.data);
            navigate(`/ticket/${response.data.id}`);
    
        })
        .catch((error) => {
            console.log(error);
        })

    };


    return(
        <>
            <h2 className='title'>Ticket Creation</h2>

            <form action="" className='forms-html' onSubmit={handleCreateTicket}>
                <div className='form-component'>
                    <label htmlFor="">Title</label>
                    <input type="text" placeholder="Type here" className="input"  onChange={e => setTitle(e.target.value)}/>
                </div>
                
                {/* <div className='form-component'>
                    <label htmlFor="">Description</label>
                    <textarea  className="textarea" placeholder="Bio" onChange={e => setDescription(e.target.value)}>

                    </textarea>
                </div> */}

                <ReactQuill className='quill' theme="snow" value={quilltext} onChange={setQuilltext} modules={modules} formats={formats}/>

                <button className="btn btn-primary">
                    Create Ticket
                </button>

            </form>
        
        </>
    )
}

export default TicketCreate