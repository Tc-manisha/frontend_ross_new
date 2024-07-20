import React from 'react';
const StdlnBatteryPakComp = ({ name, title, crrFormData, BatteryList, handleInputChange, crrIndex, toogleKeyName,disabled=false,chargepakRequired }) =>
{ 
	// BatteryList 
	return (
		<>
			<select name={ name } value={ crrFormData?.[ name ] } class="form-control" disabled={ toogleKeyName ? true : disabled }
				onChange={ (e) => handleInputChange(e, crrIndex) }
				required={chargepakRequired}
				// disabled={disabled}
			>
				<option value="" key={ 0 } selected >--Select One--</option>
				{ BatteryList?.map((item, index) => (
					<option value={ item?.battery_type_id} key={ index + 1 } >{ item?.battery_part_number }</option>
				)) }
			</select>
		</>
	)
}

export default StdlnBatteryPakComp;


/*
 */