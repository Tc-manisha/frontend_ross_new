import React from 'react'
import { Container } from 'react-bootstrap';
import MenuIcon from "@mui/icons-material/Menu";

export default function SectionHeading({setShowSidebar,title,subTitle="",showEditDelete=false,HandleEditDelete}) {
  return (
    <>
        <Container
        fluid
        style={{
          borderBottom: "4px solid #0d6efd",
          padding: "5px 10px",
        }}
      >
        <div className="">
          {subTitle ? <div className='site-header' > 

            <MenuIcon
              onClick={() => {
                setShowSidebar((prev) => !prev);
              }}
              role={"button"}
              />

            <div className='' >
              <div className='title' >
                  {title}
              </div> 
              <div className="sub-title">
                  {subTitle}
              </div>  
            </div>  


            {showEditDelete && 
            <div className='d-flex site-header-btns' >
                <button className='btn btn-primary' type='button' onClick={()=>HandleEditDelete('edit')} >Edit</button>
                <button className='btn btn-primary' type='button' onClick={()=>HandleEditDelete('delete')} >Delete</button>
            </div>
            }
          </div> : 
          <h1 className={'newAccountH1'}>
            <MenuIcon
              onClick={() => {
                setShowSidebar((prev) => !prev);
              }}
              role={"button"}
              />
            {title}
          </h1>
          }
        </div>
      </Container>

    </>
  )
}
