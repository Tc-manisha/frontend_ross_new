import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Lindbergh from './Lindbearth'
import MeepFitness from './MeepFitness'
import Rickenbacker from './Rickenbacker'
import Woodfield from './Woodfield'
import Container from "react-bootstrap/Container";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/material";
import Header from './Header'
import SubHeading from '../../components/header/SubHeading'



const FitnessTable = ({ setShowSidebar }) => {

    const navigate = useNavigate()
  return (
    <>
      <div className='mt-4' style={{paddingInline:"45px"}}>

        <SubHeading />

    <div className='main-style'>
        {/* <div>
        <Container
        fluid
        style={{
          borderBottom: "4px solid #0d6efd",
          padding: "20px 20px",
        }}
        className="d-flex align-items-center justify-content-between"
      >
        <div className={"head-heading1"}>
          <h1 className="d-flex gap-1">
            <MenuIcon
              onClick={() => setShowSidebar((prev) => !prev)}
              role={"button"}
            />
            <span style={{ fontSize: "22px", fontWeight: "bold" }}>
              New Account
            </span>
          </h1>
        </div>
        <Box>
          <Button
            title={"New"}
            onClick={() => {
              navigate("/new-account");
            }}
          />
        </Box>
        </Container>
        </div> */}
        <div className='header-btn'>
                <Button className='bg-primary text-white btn-new' onClick={()=>{navigate('/traning-table')}}>Site View</Button>
                <Button className='bg-primary text-white' onClick={()=>{navigate('/info-table')}}>Inperson</Button>
        </div>
        <Header />
        <div>
            <MeepFitness />
        </div>
        <div>
            <Rickenbacker />
        </div>
        <div>
            <Lindbergh />
        </div>
        <div>
            <Woodfield />
        </div>
    </div>
    </div>
    </>
  )
}

export default FitnessTable