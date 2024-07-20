import React from 'react'
import {Button, Switch } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import SubHeading from '../../../components/header/SubHeading';
import { useNavigate } from 'react-router-dom';



const FixAlert = () => {
    const navigate = useNavigate();
    function createData(StudentName, Status, OptOut, AssignToClass) {
        return { StudentName, Status, OptOut, AssignToClass };
      }
      
      const rows = [
        createData('Lois meep', "Active", 0, 'SelectAll'),
        createData('Clerk', "Active", 1, 'SelectAll'),
      ];

      const [data, setData] = React.useState('');

    const handleChange = (event) => {
        setData(event.target.value);
    };
  return (
    <>
    
    <div className='mt-4' style={{paddingInline:"45px"}}>
        <SubHeading />
    <div style={{padding:"25px"}}>
        <table  className="border-2-blue" style={{width:"100%"}}>
            <thead>
                <tr className="border-2-blue py-1 px-2">
                    <th className="border-2-blue py-1 px-2 fw-bold bg-secondary">Student</th>
                    <th className="border-2-blue py-1 px-2 fw-bold bg-secondary">Contact Status</th>
                    <th className="border-2-blue py-1 px-2 fw-bold bg-secondary">Training Optout</th>
                    <th className="border-2-blue py-1 px-2 fw-bold bg-secondary">Asign To Class</th>
                </tr>
            </thead>

            <tbody>
                {rows.map((data) => {
                     return (   
                            <tr className="border-2-blue py-1 px-2">
                                <td className="border-2-blue py-1 px-2 fw-bold bg-white" >
                                    <TextField id="standard-basic" label={data?.StudentName} variant="standard" style={{width:"100%"}}/>
                                </td>
                                <td className="border-2-blue py-1 px-2 fw-bold bg-white">
                                <FormControl variant="standard" style={{width:"100%"}}>
                                        <InputLabel id="demo-simple-select-standard-label">{data?.Status}</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value=""
                                        onChange={handleChange}
                                        label="Age"
                                        >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                        </Select>
                                </FormControl>
                                </td>
                                <td className="border-2-blue py-1 px-2 fw-bold bg-white"><Switch color="primary" size="medium" checked={data?.OptOut == 1 ? true : false} /></td>
                                <td className="border-2-blue py-1 px-2 fw-bold bg-white">
                                <FormControl variant="standard" style={{width:"100%"}}>
                                        <InputLabel id="demo-simple-select-standard-label">{data?.AssignToClass}</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value=""
                                        onChange={handleChange}
                                        label="Age"
                                        >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                        </Select>
                                </FormControl>
                                </td>
                            </tr>
                            )
                })}
            </tbody>

        </table>
        <div className='d-flex justify-content-end' style={{marginTop:"25px"}}>
            <Button className='bg-danger' style={{color:"white", marginRight:"15px"}} onClick={()=>{navigate(-1)}}>Cancel</Button>
            <Button className='bg-success' style={{color:"white"}}>Submit</Button>
        </div>
    </div>
    </div>
    </>
  )
}

export default FixAlert