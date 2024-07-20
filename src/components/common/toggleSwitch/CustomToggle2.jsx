import * as React from 'react';
import './toggleSwitch2.scss';
import { useState } from 'react';
import { useEffect } from 'react';

export default function CustomToggleButton2({
    ToggleName,
    ToggleValue,
    changeHandler,
	is_read_only=0
}) {
	return (
		<div className={`toggle-button-cover`}>
			<div className="button-cover">
			<div className={`button r ${is_read_only ? 'disabled' : ''}`} id="button-1">
                   <input type="checkbox" className="checkbox" name={ToggleName} checked={ToggleValue || ToggleValue == 1} onChange={changeHandler}  value={1}  disabled={is_read_only} />
					<div className={`knobs ${is_read_only ? 'disabled': ''}`}></div>
					<div className="layer"></div>
				</div>
			</div>
		</div>
	);
}