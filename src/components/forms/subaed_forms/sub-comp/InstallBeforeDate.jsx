import React from 'react';
import CommonDatePicker from '../../../common/date-picker/CommonDatePicker';
const InstallBeforeDateComp = ({is_unknowntrue,crrFormData,handleDateChange}) =>
{
    return (
        <>

            <div className='col form-group' style={{maxWidth:"300px"}}>
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
export default InstallBeforeDateComp;