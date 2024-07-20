import React from 'react'
import { Button } from 'react-bootstrap'
import AvailableClass from './AvailableClass'
import ComplatedClass from './ComplatedClass'
import UncomplatedClass from './UncomplatedClass'
import Container from "react-bootstrap/Container";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/material";
import Header from './Header'
import SubHeading from '../../components/header/SubHeading'

const TraningTable = ({ setShowSidebar }) => {
  return (
    <>
      <div className='mt-4' style={{paddingInline:"45px"}}>

        <SubHeading />
     
    <div className='main-style'>
        {/* <Container
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
      </Container> */}
        <div className='header-btn'>
                <Button className='bg-primary text-white btn-new'>Site View</Button>
                <div>
                    <Button className='bg-primary text-white' style={{marginRight:"2px"}}>Traning</Button>
                    <Button className='bg-primary text-white'>Inperson</Button>
                </div>
        </div>
        <Header />
        <div>
            <AvailableClass />
        </div>
        <div>
            <UncomplatedClass />
        </div>
        <div>
            <ComplatedClass />
        </div>
    </div>
    </div>
    </>
  )
}

export default TraningTable