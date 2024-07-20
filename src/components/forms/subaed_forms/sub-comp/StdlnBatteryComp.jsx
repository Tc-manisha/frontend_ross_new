import React from 'react';
const StdlnBatteryComp = ({crrFormData,BatteryList,handleInputChange,crrIndex,is_readonly=0})=>{
    // BatteryList
    return (
      <>
          <div className='col form-group' style={{maxWidth:"300px"}}>
            <label htmlFor="">Battery Part #</label>
            <select name="battery_type_id" value={is_readonly ?'' :crrFormData?.battery_type_id} class="form-control"
            onChange={(e)=>handleInputChange(e,crrIndex)}
            disabled={is_readonly}
            >
              <option value="" key={0}  selected >--Select One--</option>
              {BatteryList?.map((item,index)=>(
              <option value={item?.battery_type_id} key={index+1} >{item?.battery_part_number}</option>
              ))}
            </select>
          </div>
      </>
    ) 
  }

  export default StdlnBatteryComp;


  /*
   */