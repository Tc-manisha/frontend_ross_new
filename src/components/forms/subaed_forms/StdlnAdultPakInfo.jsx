import React from 'react'
import { Form } from 'react-bootstrap';
import CommonDatePicker from '../../common/date-picker/CommonDatePicker';
import PadPartSelect from './sub-comp/PadPartSelect';
import { HandleUnknow } from '../../../helper/BasicFn';
import StdlnPadPartSelect from './sub-comp/StdlnPadPartSelect';

function StdlnAdultPakInfo({
	is_unknowntrue,
	title,
	toogleKeyName,
	crrIndex,
	formData,
	setFormData,
	handleCheckBox,
	handleInput,
	crrFormData,
	addMore,
	keyName,
	padList
})
{

	const handleChange = (e) =>
	{
		let name = e.target.name;
		let index = crrIndex;
		let val = e.target.value;

		const oldData = { ...formData };
		// let objDatalist  =  oldData[keyName];
		// let newArr = objDatalist.map((item,i)=>{
		//   if(i===index){
		//     return {
		//       ...item,
		//       [name]: val
		//     };
		//   }else{
		//       return item;
		//   }
		// })
		// oldData[keyName] = newArr; 
		oldData[ keyName ][ crrIndex ][ name ] = val;
		setFormData(oldData);
	}


	const handleDateChange = (name, val) =>
	{
		const oldData = { ...formData };
		oldData[ keyName ][ crrIndex ][ name ] = val;
		setFormData(oldData);;
	}


	return (
		<>
			<div className='row my-4' >
				<Form.Group className="col">
					<Form.Label>Adult Pad Part</Form.Label>
					<StdlnPadPartSelect
						disabled={is_unknowntrue}
						name="pad_type_id"
						crrFormData={ crrFormData }
						padList={ padList }
						handleInputChange={ handleChange }
						crrIndex={ crrIndex }
						is_adult={ 1 }
						toogleKeyName={ toogleKeyName }
						CalVal={ crrFormData?.pad_type_id }
					/>
					{/* PadPartSelect */ }
				</Form.Group>
				<Form.Group className="col">
					<Form.Label>Adult Pad Expiration</Form.Label>
					<CommonDatePicker
						calName={ 'pad_expiration' }
						CalVal={ crrFormData?.pad_expiration }
						HandleChange={ handleDateChange }
						disabled={ toogleKeyName ? true : is_unknowntrue }
					/>
				</Form.Group>
				<Form.Group className="col">
					<Form.Label>Adult Pad Lot</Form.Label>
					<Form.Control type="text" name="pad_lot" value={ HandleUnknow(crrFormData?.pad_lot) } onChange={ handleChange } disabled={ toogleKeyName ? true : is_unknowntrue } />
				</Form.Group>
				<Form.Group className="col">
					<Form.Label>Adult Pad UDI</Form.Label>
					<Form.Control type="text" name="pad_udi" value={ HandleUnknow(crrFormData?.pad_udi) } onChange={ handleChange } disabled={ toogleKeyName ? true : is_unknowntrue } />
				</Form.Group>
				<Form.Group className="col">
					<Form.Label>Qty</Form.Label>
					<Form.Control type="text"
					name="quantity"
					  value={crrFormData?.quantity}
					onChange={ handleChange }
					disabled={ toogleKeyName ? true : is_unknowntrue } />
				</Form.Group>
			</div>
		</>
	)
}

export default StdlnAdultPakInfo