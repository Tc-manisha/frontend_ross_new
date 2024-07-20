import React, { useState, useEffect } from "react";
// import clsx from "clsx";
import moment from "moment";
import "./styles.module.scss";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { CallGETAPINEW } from "../../helper/API";

function CustomToolbar(props)
{
	const { label, date, view, views, onView, onNavigate, type } = props;
	const [ month, setMonth ] = useState("January");
	const mMonth = moment(date).format("MMMM");
	const months = moment.months();

	useEffect(() =>
	{
		setMonth(mMonth);
	}, [ mMonth ]);

	const handleSelectedCourseChange = (e) =>
	{
		props?.setSelectedCourse(e.target.value);
	}

	return (
		<div className="rbc-toolbar mb-4">
			<div className="rbc-btn-group">
				<button className="btn" onClick={ () => {onNavigate('TODAY')} }>Today</button>
				<button className="btn" onClick={ () => {onNavigate('PREV')} }>Back</button>
				<button className="btn" onClick={ () => {onNavigate('NEXT')} }>Next</button>
			</div>

			<div className="rbc-toolbar-label">
				{ label }
			</div>

			<div className="rbc-btn-group d-flex">
				{props?.type == 'admin' || props?.type == 'instructor' ? <>
					<div className="rbc-btn-group">
						<button className="btn" onClick={ () => {props.handleViewChange(props.Views.MONTH)} }>Month</button>
						<button className="btn" onClick={ () => {props.handleViewChange(props.Views.WEEK)} }>Week</button>
						<button className="btn" onClick={ () => {props.handleViewChange(props.Views.DAY)} }>Day</button>
						<button className="btn" onClick={ () => {props.handleViewChange(props.Views.AGENDA)} }>Agenda</button>
					</div>
				</> : <>
					<span >Course:</span>
					<div className="select-box">
						<select className="form-control" value={ props?.selectedCourse } onChange={ (e) => { handleSelectedCourseChange(e) } }>
						<option value="" key={0} selected >---Select One---</option>
							{ props?.courseList?.map((course, index) => (
								<option value={ course?.course_id } key={ index }>{ course?.course_name }</option>
							)) }
						</select>
						<span className="carat">


							<ArrowDropDownIcon sx={ { color: '#000' } } fontSize='large' aria-haspopup="true" />
						</span>
					</div>
				</>}
			</div>
		</div>
	);
}

export default CustomToolbar;