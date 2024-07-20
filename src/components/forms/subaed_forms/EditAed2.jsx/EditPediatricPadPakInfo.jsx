import React from 'react'
import { Form } from 'react-bootstrap';
import PadPartSelect from '../sub-comp/PadPartSelect';
import CommonDatePicker from '../../../common/date-picker/CommonDatePicker';
import { HandleUnknow } from '../../../../helper/BasicFn';
import EditActionsComp from '../sub-comp/EditActionsComp';

function EditPediatricPadPakInfo({
    title,
    crrIndex,
    formData,
    setFormData,
    handleCheckBox,
    handleInput,
    crrFormData,
    addMore,
    removeBtn,
    keyName,
    Permissins,
    padList,
    is_unknowntrue,
    unKnownToggleKey
}){
    
    // const handleChange = (e,index)=>{
    //     let name = e.target.name;
    //     let val  = e.target.value;
    //     const oldData = {...formData};
    //     let objDatalist  =  oldData[keyName];
    //     let newArr = objDatalist.map((item,i)=>{
    //       if(i===index){
    //         return {
    //           ...item,
    //           [name]: val
    //         };
    //       }else{
    //           return item;
    //       }
    //     })
    //     oldData[keyName] = newArr; 
    //     setFormData(oldData);
    //   }

    const handleChange = (e,index)=>{
        let name = e.target.name;
        let val = e.target.value;
          const oldData = {...formData};
          oldData[keyName][crrIndex][name] = val;
          setFormData(oldData);
      }

      const handleDateChange = (name,val)=>{
        const oldData = {...formData};
        oldData[keyName][crrIndex][name] = val;
        setFormData(oldData);;
  }
  

    return (<>
    <div className='row' key={crrIndex} >
        <Form.Group className="col" controlId="formPediatricPadPart">
            <Form.Label>Pediatric Pad Pak Part</Form.Label>
            {/* <Form.Control
            type="text"
            placeholder="Enter Pediatric Pad Part"
            name="pad_part"
            value={crrFormData?.pad_part}
            onChange={handleChange}
            /> */}

        <PadPartSelect
            disabled={is_unknowntrue}
          // name="pad_part"  
          name="pad_type_id"
          crrFormData={crrFormData} 
          padList={padList} 
          handleInputChange={handleChange} 
          crrIndex={crrIndex} 
        />
        </Form.Group>

        <Form.Group className="col" controlId="formPediatricPadExpiration">
            <Form.Label>Pediatric Pad Pak Expiration</Form.Label>
            {/* <Form.Control
            type="text"
            placeholder="Enter Pediatric Pad Expiration"
            name="pad_expiration"
            value={crrFormData?.pad_expiration}
            onChange={handleChange}
            /> */}

            <CommonDatePicker
            disabled={is_unknowntrue} 
              calName={'pad_expiration'}
              CalVal={crrFormData?.pad_expiration}
              HandleChange={handleDateChange}
            />
        </Form.Group>

        <Form.Group className="col" controlId="formPediatricPadLot">
            <Form.Label>Pediatric Pad Pak Lot</Form.Label>
            <Form.Control
            type="text"
            placeholder="Enter Pediatric Pad Lot"
            name="pad_lot"
            value={ HandleUnknow(crrFormData?.pad_lot)}
            onChange={handleChange}
            disabled={is_unknowntrue}
            />
        </Form.Group>

        <Form.Group className="col" controlId="formPediatricPadUDI">
            <Form.Label>Pediatric Pad Pak UDI {is_unknowntrue}</Form.Label>
            <Form.Control
            type="text"
            placeholder="Enter Pediatric Pad UDI"
            name="pad_udi"
            value={HandleUnknow(crrFormData?.pad_udi)}
            onChange={handleChange}
            disabled={is_unknowntrue}
            />
        </Form.Group>

        <EditActionsComp
          index={0}
          crrIndex={crrIndex}
          formData={formData}
          setFormData={setFormData}
          section_name={keyName}
          crrFormData={crrFormData}
          unKnownToggleKey={unKnownToggleKey}
          type={"Pad"}
        />
    </div>
    </>)
};

export default EditPediatricPadPakInfo;