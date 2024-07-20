import { Select } from '@mui/material';
import React from 'react'
import { useState } from 'react';
import { Form } from 'react-bootstrap'

function GeneralInforForm({ratingData}) {

    const [FromData,setFormData] = useState({})

    const handleInputChange = (e) =>
    {
        if (e.target.name == 'account_site_phone' || e.target.name == 'account_billing_info_billing_phone' || e.target.name == 'account_shipping_info_shipping_phone')
        {
            e.target.value = e.target.value.replace(/[^0-9 ]/g, "").trim();
            e.target.value = e.target.value.slice(0, 10)
        }

        if(e.target.type == 'checkbox') {
            setFormData((old) => ({ ...old, [ e.target.name ]: e.target.checked }));
        } else {
            setFormData((old) => ({ ...old, [ e.target.name ]: e.target.value }));
        }
    };
    const handleSubmit = (e)=>{
        e.preventionDefault();
    }

    const handleSelectChange = (data, key) =>
    {
        setFormData((old) => ({ ...old, [ key ]: data.value }));
    };
    
  return (
    <>
        <div className="form my-3 p-2" style={ { background: "#eee" } }>
            <h2 className="heading">General Information</h2>
            <form className='' onSubmit={handleSubmit} >
                <div className="row">
                    <div className="col-md-9">
                        <div className="row">
                            <div className="d-flex justify-content-between">
                                <div className='col-md-6'>
                                    <div className='row' >

                                    
                                <Form.Group className='col-md-6'  >
                                    <Form.Label>Instructor Rating</Form.Label>
                                    <Select
                                        defaultValue={ ratingData[0]}
                                        options={ ratingData }
                                        onChange={ (data) =>  handleSelectChange(data, 'rating')  }
                                    />
                                </Form.Group>

                                {/* className={ "col-md-3" } className={ "col-md-3" } */}

                                <Form.Group className='col-md-6' >
                                    <Form.Label>Status</Form.Label>
                                    <Select
                                        defaultValue={selectStatusData[0]}
                                        options={ selectStatusData }
                                        onChange={ (data) =>  handleSelectChange(data, 'status')  }
                                    />
                                </Form.Group>
                                </div>
                                </div>

                                <div className='col-md-6 d-flex ml-4' style={{alignItems:'center',marginLeft:'3rem'}}>
                                    <Form.Group >
                                        <b className={ "" }>Make User</b>
                                        <br/>
                                        <div className="">
                                            <FormControlLabel
                                                className={ "" }
                                                label=""
                                                control={
                                                    <Switch
                                                        // checked ={ formData?.account_site_main_site === 1 ? true : false }
                                                        color="primary"
                                                        size="medium"
                                                        // value={ true }
                                                        name="is_user"
                                                        // onChange={ handleInputChange }
                                                    />
                                                }
                                            />
                                        </div>
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="row my-3">
                                <Form.Group className={ "col" }>
                                    <Form.Label>Vehicle Year</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="vehicle_year"
                                        // required
                                        onChange={ handleInputChange }
                                    />
                                </Form.Group>
                                <Form.Group className={ "col-md-4" }>
                                    <Form.Label>Model / Brand</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="model_brand"
                                        // required
                                        onChange={ handleInputChange }
                                    />
                                </Form.Group>
                                <Form.Group className={ "col" }>
                                    <Form.Label>Color</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="color"
                                        // required
                                        onChange={ handleInputChange }
                                    />
                                </Form.Group>
                                <Form.Group className={ "col" }>
                                    <Form.Label>Plate Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="plate_number"
                                        // required
                                        onChange={ handleInputChange }
                                    />
                                </Form.Group>
                                <Form.Group className={ "col" }>
                                    <Form.Label>State</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="state"
                                        // required
                                        onChange={ handleInputChange }
                                    />
                                </Form.Group>
                            </div>

                            <Form.Group className={ "col-md-12" }>
                                <Form.Label>Comments</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    name="comment"
                                    onChange={ handleInputChange }
                                />
                            </Form.Group>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="text-center file-input-div">
                            <Form.Control
                                type="file"
                                name="profile_pic"
                                onChange={ handleFileChange }
                                className='hidden-file'
                            />
                            {/* <input type="file" name='profile_pic' className='hidden-file' onChange={ handleFileChange } /> */}
                            <img className='file-image' src={ formData['profile_pic_image_url'] ? formData['profile_pic_image_url'] : "/photo-image.svg"} alt="photo" />
                        </div>
                    </div>


                    <div className='col-md-12'   >
                        <button className='btn btn-success' name="next" >Next</button>
                        <button className='btn btn-primary' name="save" >Save</button>
                    </div>
                </div>
            </form>
        </div>

    </>
  )
}

export default GeneralInforForm;