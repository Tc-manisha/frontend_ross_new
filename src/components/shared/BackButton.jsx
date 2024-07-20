import React from 'react'
import { useNavigate } from 'react-router-dom'

function BackButton() {
    const navigate = useNavigate();
    const HandleBackClick = ()=>{
        navigate(-1);
    }   
  return (
    <>
            <button
        className="btn text-primary"
        type="button"
        onClick={HandleBackClick}
    >
        <img src="/back.svg" alt="svg" style={ { marginRight: "5px" } } />
        <span className="ms-2">Back</span>
    </button>
    </>
  )
}

export default BackButton