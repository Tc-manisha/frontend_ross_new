import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom';

function ErrorPage() {
    document.title='404 Page Not Found';
    return (
        <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
            <div className='text-center'>
                <h1>404 Page Not Found</h1>
                <p>Please Go Back to <Link to={'/'} >Login Page</Link></p>
            </div>
        </div>
    )
}

export default ErrorPage