import React from "react";
import CommonDatePicker from "../../common/date-picker/CommonDatePicker";
import BatteryComp from "./sub-comp/BatteryComp";
import moment from "moment";
import { FormatDate } from "../../../helper/Common";
import { HandleUnknow } from "../../../helper/BasicFn";
import InstallBeforeDateComp from "./sub-comp/InstallBeforeDate";
import StdlnBatteryComp from "./sub-comp/StdlnBatteryComp";
import StdlnInstallBeforeDateComp from "./sub-comp/StdlnInstallBeforedate";

/*
const InstallBeforeDateComp = () =>
{
    return (
        <>

            <div className='col-3 form-group' >
                <label htmlFor="">Install Before Date</label>
                <CommonDatePicker
                    is_readonly={is_unknowntrue}
                    disabled={is_unknowntrue}
                    calName={ 'install_before_date' }
                    CalVal={ crrFormData?.install_before_date }
                    HandleChange={ handleDateChange }
                />
            </div>
        </>
    )
}
*/

const InstalledDate = ({ is_unknowntrue, crrFormData, handleDateChange }) => {
  return (
    <>
      <div className="col form-group" style={{maxWidth:"300px"}}>
        <label htmlFor="">Installed Date</label>
        <CommonDatePicker
          is_readonly={is_unknowntrue}
          disabled={is_unknowntrue}
          calName={"date_installed"}
          CalVal={crrFormData?.install_date}
          HandleChange={handleDateChange}
        />
      </div>
    </>
  );
};

const MenufectureDate = ({ is_unknowntrue, crrFormData, handleDateChange }) => {
  return (
    <>
      <div className="col form-group">
        <label htmlFor="">Manufactured Date</label>
        <CommonDatePicker
          is_readonly={is_unknowntrue}
          disabled={is_unknowntrue}
          calName={"manufactured_date"}
          CalVal={crrFormData?.manufactured_date}
          HandleChange={handleDateChange}
        />
      </div>
    </>
  );
};

const BatteryExpiery = ({ is_unknowntrue, crrFormData, handleDateChange }) => {
  return (
    <>
      <div className="col form-group">
        <label htmlFor="">Battery Expiration</label>

        <CommonDatePicker
          is_readonly={is_unknowntrue}
          disabled={is_unknowntrue}
          calName={"battery_expiration"}
          CalVal={crrFormData?.battery_expiration}
          HandleChange={handleDateChange}
        />
      </div>
    </>
  );
};

function StdlnBatteryinformation({
  crrIndex,
  formData,
  setFormData,
  keyName,
  Permissins,
  bettery_type,
  crrFormData,
  BatteryList,
  is_unknowntrue,
  is_spare_manu = 0,
}) { console.log(bettery_type)
  const handleInputChange = (e, index) => {
    let name = e.target.name;
    let val = e.target.value;

    const oldData = { ...formData };
    oldData[keyName][index][name] = val;
    setFormData(oldData);
  };
  const handleDateChange = (name, val) => {
    const oldData = { ...formData };
    oldData[keyName][crrIndex][name] = val;
    if (
      name === "date_installed" &&
      (bettery_type !== 1 || bettery_type !== 2)
    ) {
      let add_year = BatteryList.find(
        (item) =>
          parseInt(item.battery_type_id) ===
          parseInt(oldData[keyName][crrIndex]["battery_type_id"])
      );
      // .calendar()
      let battery_expiration = FormatDate(
        moment(val).add(add_year?.lifespan, "years")
      );

      oldData[keyName][crrIndex]["battery_expiration"] = battery_expiration;
    }

    setFormData(oldData);
  };

  if (bettery_type === 5) {
    return (
      <>
        <div className="row" key={crrIndex}>
          <StdlnBatteryComp
            crrFormData={crrFormData}
            BatteryList={BatteryList}
            handleInputChange={handleInputChange}
            crrIndex={crrIndex}
            is_readonly={is_unknowntrue}
          />
          {/* <StdlnInstallBeforeDateComp 
                is_unknowntrue={is_unknowntrue} 
                crrFormData={crrFormData} 
                handleDateChange={handleDateChange} 
                /> */}
                
          <InstalledDate
            is_unknowntrue={is_unknowntrue}
            crrFormData={crrFormData}
            handleDateChange={handleDateChange}
          />
        

        <div className="col-md-2 form-group">
             <label htmlFor="">Qty</label>
             <input
               className="form-control"
               type="text"
               id=""
               value={formData?.[keyName]?.[crrIndex]?.quantity}
               onChange={(e) => handleInputChange(e, crrIndex)}
               disabled={is_unknowntrue}
              name="quantity"
            />
           </div>
           </div>
      </>
    );
  }

  if (bettery_type === 4) {
    return (
      <>
        <div class="row" key={crrIndex}>
          <div class="col-12">
            <hr />
          </div>
          <div className="row"> 
          <BatteryComp
            crrFormData={crrFormData}
            BatteryList={BatteryList}
            handleInputChange={handleInputChange}
            crrIndex={crrIndex}
            is_readonly={is_unknowntrue}
          />

          <MenufectureDate
            is_unknowntrue={is_unknowntrue}
            crrFormData={crrFormData}
            handleDateChange={handleDateChange}
          />

          {/* <InstalledDate
            is_unknowntrue={is_unknowntrue}
            crrFormData={crrFormData}
            handleDateChange={handleDateChange}
          /> */}
          {/* )} */}

          <div className="col-3 form-group">
            <label htmlFor="">Battery lot</label>
            <input
              className="form-control"
              type="text"
              id=""
              value={HandleUnknow(formData?.[keyName]?.[crrIndex]?.battery_lot)}
              onChange={(e) => handleInputChange(e, crrIndex)}
              disabled={is_unknowntrue}
              name="battery_lot"
            />
          </div>

          <div className="col-3 form-group">
            <label htmlFor="">Battery UDI</label>
            {/* <input className='form-control' type="text" id="" value={HandleUnknow( formData?.[ keyName ]?.[ crrIndex ]?.battery_udi) } onChange={ (e) => handleInputChange(e, crrIndex) } disabled={is_unknowntrue} name="battery_udi"  /> */}
            <input
              className="form-control"
              type="text"
              id=""
              value={HandleUnknow(crrFormData?.battery_udi)}
              onChange={(e) => handleInputChange(e, crrIndex)}
              disabled={is_unknowntrue}
              name="battery_udi"
            />
          </div>

          <div className="col-md-2 form-group">
             <label htmlFor="">Qty</label>
             <input
               className="form-control"
               type="text"
               id=""
               value={formData?.[keyName]?.[crrIndex]?.quantity}
               onChange={(e) => handleInputChange(e, crrIndex)}
               disabled={is_unknowntrue}
              name="quantity"
            />
           </div>
        </div>
        </div>
      </>
    );
  }

  if (bettery_type === 3) {
    return (
      <>
        <div className="col" key={crrIndex}>
          <div className="col-12">
            <hr />
          </div>
          
          <div className="row"> 
          <div className="col form-group">
          <BatteryComp
            crrFormData={crrFormData}
            BatteryList={BatteryList}
            handleInputChange={handleInputChange}
            crrIndex={crrIndex}
            is_readonly={is_unknowntrue}
          />
          </div>

           {/* <div className="col form-group">
           <StdlnInstallBeforeDateComp 
                is_unknowntrue={is_unknowntrue} 
                crrFormData={crrFormData} 
                handleDateChange={handleDateChange} 
                />
          </div> */}

          <div className="col form-group">
          <InstalledDate
            is_unknowntrue={is_unknowntrue}
            crrFormData={crrFormData}
            handleDateChange={handleDateChange}
          />
          </div>

          <div className="col form-group">
            <label htmlFor="">Battery lot</label>
            <input
              className="form-control"
              type="text"
              id=""
              value={HandleUnknow(formData?.[keyName]?.[crrIndex]?.battery_lot)}
              onChange={(e) => handleInputChange(e, crrIndex)}
              disabled={is_unknowntrue}
              name="battery_lot"
              
            />
          </div>

          <div className="col form-group">
            <label htmlFor="">Battery UDI</label>
            {/* <input className='form-control' type="text" id="" value={HandleUnknow( formData?.[ keyName ]?.[ crrIndex ]?.battery_udi) } onChange={ (e) => handleInputChange(e, crrIndex) } disabled={is_unknowntrue} name="battery_udi" /> */}
            <input
              className="form-control"
              type="text"
              id=""
              value={HandleUnknow(crrFormData?.battery_udi)}
              onChange={(e) => handleInputChange(e, crrIndex)}
              disabled={is_unknowntrue}
              name="battery_udi"
            />
          </div>

          <div className="col form-group">
            <label htmlFor="">Serial #</label>
            <input
              onChange={(e) => handleInputChange(e, crrIndex)}
              className="form-control"
              type="text"
              id=""
              value={HandleUnknow(crrFormData?.battery_serial)}
              name="battery_serial"
              disabled={is_unknowntrue}
            />
            </div>

            <div className="col-md-2 form-group">
             <label htmlFor="">Qty</label>
             <input
               className="form-control"
               type="text"
               id=""
               value={formData?.[keyName]?.[crrIndex]?.quantity}
               onChange={(e) => handleInputChange(e, crrIndex)}
               disabled={is_unknowntrue}
              name="quantity"
            />
           </div>
          </div>
        </div>
      </>
    );
  }

  if (bettery_type === 2) {
    return (
      <>
        <div className="row" key={crrIndex}>
          <div className="col-12">
            <hr />
          </div>
          <BatteryComp
            crrFormData={crrFormData}
            BatteryList={BatteryList}
            handleInputChange={handleInputChange}
            crrIndex={crrIndex}
            is_readonly={is_unknowntrue}
          />
          {/* <div classNa form-group' >
                <label htmlFor="">Battery Part </label>
                <input className='form-control' type="text"  id="" value={formData?.[keyName]?.[crrIndex]?.battery_type_id} onChange={(e)=>handleInputChange(e,crrIndex)} disabled={is_unknowntrue} name="battery_type_id"  />
              </div> */}

          {/* <div className='col-3 form-group' >
                <label htmlFor="">Battery Expiration</label>
                <input className='form-control' type="text"  id="" value={formData?.[keyName]?.[crrIndex]?.battery_expiration} onChange={(e)=>handleInputChange(e,crrIndex)} disabled={is_unknowntrue} name="battery_expiration"  />
              </div> */}

          <BatteryExpiery
            is_unknowntrue={is_unknowntrue}
            crrFormData={crrFormData}
            handleDateChange={handleDateChange}
          />

          <div className="col form-group">
            <label htmlFor="">Battery lot</label>
            <input
              className="form-control"
              type="text"
              id=""
              value={HandleUnknow(formData?.[keyName]?.[crrIndex]?.battery_lot)}
              onChange={(e) => handleInputChange(e, crrIndex)}
              disabled={is_unknowntrue}
              name="battery_lot"
            />
          </div>

          <div className="col form-group">
            <label htmlFor="">Battery UDI</label>
            {/* <input className='form-control' type="text" id="" value={HandleUnknow( formData?.[ keyName ]?.[ crrIndex ]?.battery_udi) } onChange={ (e) => handleInputChange(e, crrIndex) } disabled={is_unknowntrue} name="battery_udi" /> */}
            <input
              className="form-control"
              type="text"
              id=""
              value={HandleUnknow(crrFormData?.battery_udi)}
              onChange={(e) => handleInputChange(e, crrIndex)}
              disabled={is_unknowntrue}
              name="battery_udi"
            />
          </div>

          <div className="col form-group">
            <label htmlFor="">9v Install Date</label>
            {/* <input className='form-control' type="text"  id="" value={formData?.[keyName]?.[crrIndex]?.v9_install} onChange={(e)=>handleInputChange(e,crrIndex)} disabled={is_unknowntrue} name="v9_install"  /> */}
            <CommonDatePicker
              is_readonly={is_unknowntrue}
              disabled={is_unknowntrue}
              calName={"v9_install"}
              CalVal={crrFormData?.install_9v_date}
              HandleChange={handleDateChange}
            />
          </div>

          <div className="col-md-2 form-group">
             <label htmlFor="">Qty</label>
             <input
               className="form-control"
               type="text"
               id=""
               value={formData?.[keyName]?.[crrIndex]?.quantity}
               onChange={(e) => handleInputChange(e, crrIndex)}
               disabled={is_unknowntrue}
              name="quantity"
            />
           </div>
        </div>
      </>
    );
  }

  if (bettery_type === 1) {
    return (
      <>
        <div className="row" key={crrIndex}>
          <div className="col-12">
            <hr />
          </div>
          <BatteryComp
            crrFormData={crrFormData}
            BatteryList={BatteryList}
            handleInputChange={handleInputChange}
            crrIndex={crrIndex}
            is_readonly={is_unknowntrue}
          />
          {/* <div className='col-3 form-group' >
                <label htmlFor="">Battery Part </label>
                <input className='form-control' type="text"  id="" value={formData?.[keyName]?.[crrIndex]?.battery_type_id} onChange={(e)=>handleInputChange(e,crrIndex)} disabled={is_unknowntrue} name="battery_type_id"  />
              </div> */}

          {/* <div className='col-3 form-group' >
                <label htmlFor="">Battery Expiration</label>
                <input className='form-control' type="text"  id="" value={formData?.[keyName]?.[crrIndex]?.battery_expiration} onChange={(e)=>handleInputChange(e,crrIndex)} disabled={is_unknowntrue} name="battery_expiration"  />
              </div> */}
          <BatteryExpiery
            is_unknowntrue={is_unknowntrue}
            crrFormData={crrFormData}
            handleDateChange={handleDateChange}
          />

          <div className="col-3 form-group">
            <label htmlFor="">Battery lot</label>
            <input
              className="form-control"
              type="text"
              id=""
              value={HandleUnknow(formData?.[keyName]?.[crrIndex]?.battery_lot)}
              onChange={(e) => handleInputChange(e, crrIndex)}
              disabled={is_unknowntrue}
              name="battery_lot"
            />
          </div>

          <div className="col-3 form-group">
            <label htmlFor="">Battery UDI</label>
            {/* <input className='form-control' type="text" id="" value={HandleUnknow( formData?.[ keyName ]?.[ crrIndex ]?.battery_udi) } onChange={ (e) => handleInputChange(e, crrIndex) } disabled={is_unknowntrue} name="battery_udi" /> */}
            <input
              className="form-control"
              type="text"
              id=""
              value={HandleUnknow(crrFormData?.battery_udi)}
              onChange={(e) => handleInputChange(e, crrIndex)}
              disabled={is_unknowntrue}
              name="battery_udi"
            />
          </div>

          <div className="col-md-2 form-group">
             <label htmlFor="">Qty</label>
             <input
               className="form-control"
               type="text"
               id=""
               value={formData?.[keyName]?.[crrIndex]?.quantity}
               onChange={(e) => handleInputChange(e, crrIndex)}
               disabled={is_unknowntrue}
              name="quantity"
            />
           </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* <div className=' bg-gray py-4 px-4 mt-4'> */}
      {/* <h2 className='heading'>{title} <button className='btn' onClick={addMore} >Add More</button></h2> */}

      {/* {formData?.BatteryInfo?.map((item,crrIndex)=>( */}
      <div className="row" key={crrIndex}>
        <div className="col-12">
          <hr />
        </div>
        <BatteryComp
          crrFormData={crrFormData}
          BatteryList={BatteryList}
          handleInputChange={handleInputChange}
          crrIndex={crrIndex}
          is_readonly={is_unknowntrue}
        />
        {/* <div className='col-3 form-group' >
                <label htmlFor="">Battery Part </label>
                <input className='form-control' type="text"  id="" value={formData?.[keyName]?.[crrIndex]?.battery_type_id} onChange={(e)=>handleInputChange(e,crrIndex)} disabled={is_unknowntrue} name="battery_type_id"  />
              </div> */}

        {/* <div className='col-3 form-group' >
                <label htmlFor="">Battery Expiration</label>
                <input className='form-control' type="text"  id="" value={formData?.[keyName]?.[crrIndex]?.battery_expiration} onChange={(e)=>handleInputChange(e,crrIndex)} disabled={is_unknowntrue} name="battery_expiration"  />
              </div> */}
        <BatteryExpiery
          is_unknowntrue={is_unknowntrue}
          crrFormData={crrFormData}
          handleDateChange={handleDateChange}
        />

        <div className="col-3 form-group">
          <label htmlFor="">Battery lot</label>
          <input
            className="form-control"
            type="text"
            id=""
            value={HandleUnknow(formData?.[keyName]?.[crrIndex]?.battery_lot)}
            onChange={(e) => handleInputChange(e, crrIndex)}
            disabled={is_unknowntrue}
            name="battery_lot"
          />
        </div>

        <div className="col-3 form-group">
          <label htmlFor="">Battery UDI</label>
          <input
            className="form-control"
            type="text"
            id=""
            value={HandleUnknow(formData?.[keyName]?.[crrIndex]?.battery_udi)}
            onChange={(e) => handleInputChange(e, crrIndex)}
            disabled={is_unknowntrue}
            name="battery_udi"
          />
        </div>

        {Permissins?.has_9v ? (
          <div className="col-3 form-group mt-3">
            <label htmlFor="">9v Install</label>
            <input
              className="form-control"
              type="text"
              id=""
              value={formData?.[keyName]?.[crrIndex]?.v9_install}
              onChange={(e) => handleInputChange(e, crrIndex)}
              disabled={is_unknowntrue}
              name="v9_install"
            />
          </div>
        ) : (
          ""
        )}

        {/* <InstallBeforeDateComp
          is_unknowntrue={is_unknowntrue}
          crrFormData={crrFormData}
          handleDateChange={handleDateChange}
        /> */}
        {/* <div className='col-3 form-group' >
                <label htmlFor="">Install Before Date</label>
                <input className='form-control' type="text"  id="" value={formData?.[keyName]?.[crrIndex]?.install_before_date} onChange={(e)=>handleInputChange(e,crrIndex)} disabled={is_unknowntrue} name="install_before_date"  />
              </div> */}

        {/* <div className='col-3 form-group' >
                <label htmlFor="">Date Installed</label>
                <input className='form-control' type="text"  id="" value={formData?.[keyName]?.[crrIndex]?.date_installed} onChange={(e)=>handleInputChange(e,crrIndex)} disabled={is_unknowntrue} name="date_installed"  />
              </div> */}

        {/* <div className='col-3 form-group' >
                <label htmlFor="">Manufactured Date</label>
                <input className='form-control' type="text"  id="" value={formData?.[keyName]?.[crrIndex]?.manufactured_date} onChange={(e)=>handleInputChange(e,crrIndex)} disabled={is_unknowntrue} name="manufactured_date"  />
              </div> */}
        <InstalledDate
          is_unknowntrue={is_unknowntrue}
          crrFormData={crrFormData}
          handleDateChange={handleDateChange}
        />
        {Permissins?.has_man ? (
          <MenufectureDate
            is_unknowntrue={is_unknowntrue}
            crrFormData={crrFormData}
            handleDateChange={handleDateChange}
          />
        ) : (
          ""
        )}
      </div>
      {/* ))} */}
      {/* </div>  */}
    </>
  );
}

export default StdlnBatteryinformation;
