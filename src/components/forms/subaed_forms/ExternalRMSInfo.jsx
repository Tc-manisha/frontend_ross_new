import React from 'react';

function ExternalRMSInfo({AccountList,
    formData,
    BrandList,
    setFormData,
    RmsDropdown
}) {

    const handleInput = (e)=>{
        let val             = e.target.value;
        let name            = e.target.name;
        setFormData((old) => ({ ...old, [ name ]: val }));
    }
    

  return (
    <>
    <div className=' bg-gray py-4 px-4 my-2'>
        <h2 className='heading'>External RMS Information</h2>
        <div className='col-4 form-group' >
            <label htmlFor='' >RMS Brand</label>
            <select className='form-control' id="" name="rms_brand" value={formData?.rms_brand} onChange={handleInput}   >
                <option value="" key={0}  selected >---Select One---</option>
                {RmsDropdown?.map((item,index)=>(
                <option value={item?.rms_brand_id} key={index+1} >{item?.rms_brand_name}</option>
                ))}
            </select>
        </div>
    </div>
    </>
  )
}

export default ExternalRMSInfo