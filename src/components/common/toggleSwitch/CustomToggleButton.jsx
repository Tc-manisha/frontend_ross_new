import * as React from 'react';
import './toogleSwitch.scss';
import { useState } from 'react';
import { useEffect } from 'react';

export default function CustomToggleButton({
    ToggleName,
    ToggleValue,
    changeHandler,
	is_read_only=0
}){
const disabledStyles = {
	opacity: is_read_only ? 0.5 : 1,
};

	return (
		<div  className={`toggle-button-cover ${is_read_only ? 'disabled' : ''}`} style={disabledStyles}>
			<div className="button-cover">
				<div className="button r" id="button-1">
					<input type="checkbox" className="checkbox" name={ToggleName} checked={ToggleValue || ToggleValue == 1} onChange={changeHandler}  value={1}  disabled={is_read_only} />
					<div className={`knobs ${is_read_only ? 'disabled': ''}`}></div>
					<div className="layer"></div>
				</div>
			</div>
		</div>
	);
}



// export default function CustomToggleButton({
//     ToggleName,
//     ToggleValue,
//     changeHandler,
//     is_read_only
// }) {
//     const isDisabled = is_read_only === 1; // Check if is_read_only is truthy

//     return (
//         <div className={`toggle-button-cover`}>
//             <div className="button-cover">
//                 <div className="button r" id="button-1">
//                     <input 
//                         type="checkbox" 
//                         className="checkbox" 
//                         name={ToggleName} 
//                         checked={ToggleValue || ToggleValue == 1} 
//                         onChange={changeHandler}  
//                         value={1}  
//                         disabled={isDisabled} // Set disabled attribute based on is_read_only
//                     />
//                     <div className={`knobs ${isDisabled ? 'disabled': ''}`}></div>
//                     <div className="layer"></div>
//                 </div>
//             </div>
//         </div>
//     );
// }
