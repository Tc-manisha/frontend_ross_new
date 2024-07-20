import React, { useState } from 'react';
import './styles.module.scss';
import { useNavigate } from 'react-router-dom';

function EventComp({ event, type })
{
	const navigate = useNavigate();
	return (
		<>
			<div className='event-content' style={ { backgroundColor: event.backgroundColor || '#fff', border: '1px solid' + event.borderColor || '#000' } } onClick={ () => { navigate(type == 'admin' || type == 'instructor' ? '/account/inperson/details/' + event?.class_id : '/user-class-selection/' + event?.class_id) } }>
				<p className={ '' } style={ { color: event.textColor || '#000' } }>
					<b>{ event.title }</b>
				</p>

				{/* show dropwon */ }
				{type == 'admin' || type == 'instructor' ? 
					<div className='event-menu'>
						<ul style={ { paddingLeft: '10px', color: event.textColor || '#000' } }>
							{event?.type != 'broadcast' ? <>
								<li title={ event?.account_name }>Account: { event?.account_name }</li>
								<li title={ event?.site_name }>Site: { event?.site_name }</li>
								<li title={ event?.start_time }>Start Time: { event?.start_time }</li>
								<li title={ parseInt(event?.registered) }>Registered: { parseInt(event?.registered) }</li>
								{/* <li title={ event?.price }>Cost: ${ event?.price }</li> */}
								{event?.mainInstructor && (
									<li title={ event?.mainInstructor }>Main Instructor: { event?.mainInstructor }</li>
								)}
								{event?.assistInstructors && (
									<li title={ event?.assistInstructors }>Asst Instructor: { event?.assistInstructors }</li>
								)}
							</> : <>
								{event?.city && (
									<li title={ event?.city }>City: { event?.city }</li>
								)}
								{event?.state && (
									<li title={ event?.state }>state: { event?.state }</li>
								)}
								<li title={ event?.start_time }>Start Time: { event?.start_time }</li>
							</>}
						</ul>
					</div> : 
					<div className='event-menu'>
						<ul style={ { paddingLeft: '10px', color: event.textColor || '#000' } }>
							<li title={ event?.address }>Address: { event?.address }</li>
							<li title={ event?.account_name }>Account: { event?.account_name }</li>
							<li title={ event?.start_time }>Start Time: { event?.start_time }</li>
							{event?.positionInstructors && (
								<li title={ event?.positionInstructors }>Position: { event?.positionInstructors }</li>
							)}
						</ul>
					</div>
				}
				
			</div>
		</>
	)
}

export default EventComp