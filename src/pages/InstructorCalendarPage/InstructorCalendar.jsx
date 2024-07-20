import React, { useEffect, useState } from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventComp from '../../components/calendar/EventComp';
import './styles.scss';
import CustomToolbar from '../../components/calendar/CustomToolbar';
import { useNavigate } from 'react-router-dom';
import { CallGETAPINEW } from '../../helper/API';

moment.locale("en-gb", {
	week: {
		format: "dddd"
	}
});

const formats = {
	weekdayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture),
}

const localizer = momentLocalizer(moment)

function InstructorCalendar()
{
	const now = new Date();
	const [ selectedCourse, setSelectedCourse ] = useState(0);
	const [ currentView, setCurrentView ] = useState(Views.MONTH);
	const [ broadcastClasses, setBroadcastClasses ] = useState([]);
	const [ events, setEvents ] = useState([]);
	const [ courses, setCourses ] = useState([
		{
			course_id: 0,
			course_name: "All",
			certifying_agency_id: 0,
		}
	]);
	
	const navigate = useNavigate();

	// filter brodcast classes
	const filterBroadcast = (array, value) => {
		const broadcast = array.find(broadcast => broadcast.course_id == value)
		return broadcast;
	}

	// pass data to events
	const filtereEvents = (events) =>
	{
		let allClasses = [];

		events.map((item, index) =>
		{
			let data = {};
			data.id = index + 1;
			data.class_id = item.course_id;
			data.account_name = item.account_name;
			data.title = item.course_name;
			data.start = new Date(item.course_date);
			data.end = new Date(item.course_date);
			data.instructors = (item.instructor && item.instructor != null) ? JSON.parse(item.instructor) : [];
			data.site_name = item.site_name;
			data.registered = item.registered;
			data.maximum = item.maximum;
			data.start_time = item.start_time;
			data.price = item.price;
			data.textColor = item?.calendar_group?.text_color;
			data.backgroundColor = item?.calendar_group?.background_color;
			data.borderColor = item?.calendar_group?.border_color;
			
			if(data.instructors?.length > 0) {
				data.mainInstructor = data.instructors[0]?.contact_name;
				let assistInstructors = '';
				data.instructors.map((instructor, index) => {
					if(index == data.instructors?.length - 1) {
						if(instructor?.contact_name) {
							assistInstructors = assistInstructors + instructor.contact_name + ', '
						}
					}
				})
				data.assistInstructors = assistInstructors;
			} 	
			data.type = item?.type ?? '';
			data.city = item?.city ?? '';
			data.state = item?.state ?? '';

			allClasses.push(data);
		});

		return allClasses;

	}

	// get active classes
	const getActiveClass = async () =>
	{
		const result = await CallGETAPINEW('account/instructor-calendar/1')

		if (result?.status)
		{
			const activeClasses = result?.data?.instructorClass
			const broadcastClasses = result?.data?.broadcastClass
			broadcastClasses?.map((data) => {
				data.type = 'broadcast';
			})

			// filter events
			const allClasses = filtereEvents([...activeClasses, ...broadcastClasses])

			setBroadcastClasses(broadcastClasses);
			setEvents(allClasses);
		}
	}

	useEffect(() =>
	{
		getActiveClass();
	}, []);

	// fetch on load data
	const fetchOnLoad = async () =>
	{
		const result = await CallGETAPINEW('account/all-course-list');

		if (result?.status)
		{
			const courseList = result?.data?.courseList;
			setCourses([ ...courses, ...courseList ]);
		}
	}

	useEffect(() =>
	{
		fetchOnLoad();
	}, [])

	// fetch classes by courses
	const fetchCourseEvents = async () =>
	{

		if (selectedCourse != 0)
		{
			const result = await CallGETAPINEW('account/get-active-classes-by-course/' + selectedCourse);

			if (result?.status)
			{
				const activeClasses = result?.data?.classes

				// filter events
				filtereEvents(activeClasses)
			} else
			{
				setEvents([]);
			}
		} else
		{
			getActiveClass();
		}
	}

	useEffect(() =>
	{
		fetchCourseEvents();
	}, [ selectedCourse ])

	const handleViewChange = (view) => {
		setCurrentView(view);
	};

	return (
		<div className='calendar-container'>
			<div className='container-fluid mt-4'  >
				<button className='btn text-primary' type='button' onClick={ () => navigate(-1) } >
					<img src="/back.svg" alt="svg" style={ { marginRight: '5px' } } />
					<span className="ms-2">Back</span>
				</button>

				{/* calendar */ }
				<Calendar
					formats={ formats }
					localizer={ localizer }
					events={ events }
					startAccessor="start"
					endAccessor="end"
					style={ { height: 800, marginBottom: '100px' } }
					views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
					defaultView={Views.MONTH}
					onView={handleViewChange}
					view={currentView}
					components={ {
						event: (props) => (
							<EventComp { ...props } type={ 'admin' } />
						),
						toolbar: (props) => (
							<CustomToolbar { ...props } courseList={ courses } selectedCourse={ selectedCourse } setSelectedCourse={ setSelectedCourse } type={ 'admin' } handleViewChange={handleViewChange} Views={ Views } />
						),
					} }
				/>
			</div>
		</div>
	)
}

export default InstructorCalendar;
