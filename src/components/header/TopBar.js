import React from 'react'

export default function TopBar() {
  return (
    <>
        <div className='' id="top-bar">
            <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
            <div className="navbar-collapse">
                <ul className='navbar-nav ml-auto'>
                    <li className='nav-item'>
                        Call Us today :
                        <a href='tel:+3017403390' >
                            (301) 740 3390
                        </a>
                    </li>
                    <li className='nav-item'> &nbsp; | &nbsp; </li>
                    <li className='nav-item'>
                        Email Us: <a href="mailto:info@rescue-one.com" >info@rescue-one.com</a>
                    </li>
                </ul>
            </div>
            </nav>
        </div>
    </>
  )
}
