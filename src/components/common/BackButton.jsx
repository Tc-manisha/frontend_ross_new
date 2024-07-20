import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";

function BackButton() {
    const navigate = useNavigate();
  return (
    <>
        {/* <Button className="btn btn-transparent" type="button" onClick={()=>navigate(-1)}>         
        Back </Button> */}

        <button class="btn text-primary" type="button" onClick={()=>navigate(-1)} >
          <img src="/back.svg" alt="svg" style={{marginRight:"5px"}}/>
          <span class="ms-2">Back</span>
        </button>

    </>
  )
}

export default BackButton