import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom';

function ForbiddenPage() {
    document.title='403 Page Forbidden';
  return (
    <>
        <div className='container text-center' >
            <h1>403 Page Forbidden</h1>
            <p>Page is forbidden for you</p>
        </div>
    </>
  )
}

export default ForbiddenPage