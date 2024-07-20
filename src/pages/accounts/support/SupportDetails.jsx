import { Box } from '@mui/material';
import React from 'react'
import SubHeadingOther from '../../../components/header/SubHeadingOther'
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import Container from "react-bootstrap/Container";
import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CallGETAPI } from '../../../helper/API';
import SubHeading from '../../../components/header/SubHeading';
import Moment from 'react-moment';
import RespondModal from '../../../components/modals/respondModal/RespondModal';
import ConfirmAlert from '../../../components/alerts/ConfirmAlert';
import { toast } from 'react-toastify';
import SupportContactsmodal from './SupportContactsmodal';
import Loading from '../Loading';
import { FormatDateWithTime, GetProfile, getPermission } from '../../../helper/Common';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../../redux/slices/BreadCrumbsSlice';
import { DecryptToken } from '../../../helper/BasicFn';


export default function SupportDetails({handleSetToken}) {
	const [validated, setValidated] = useState(false);
	const [confirmModal, setConfirmModal] = useState(false);
	const [respondModal, setRespondModal] = useState(false);
	const [addContactsModal, setAddContactsModal] = useState(false);
	const [onContactsSubmitted, setOnContactsSubmitted] = useState(() => { });
	const [issueType, setIssueType] = useState("");
	const [btnLoading, setBtnLoading] = useState(true);
	const [formData, setFormData] = useState({
		account_id: "",
		contact_id: "",
		issue_type: "",
		assign_to: "",
		related_to: "",
		relation: "",
		due_date: "",
		issue: "",
		status: 0,
	});
	const [selectedData, setSelectedData] = useState({})
	const [relatedToList, setRelatedToList] = useState([
		{ label: 'Related to 1', value: '1' },
		{ label: 'Related to 2', value: '2' },
		{ label: 'Related to 3', value: '3' },
	]);
	const [issueTypeList, setIssueTypeList] = useState([
		{ label: 'Issue 1', value: '1' },
		{ label: 'Issue 2', value: '2' },
		{ label: 'Issue 3', value: '3' },
	]);
	const [assignedToList, setAssignedToList] = useState([
		{ label: 'Contact 1', value: '1' },
		{ label: 'Contact 2', value: '2' },
		{ label: 'Contact 3', value: '3' },
	]);
	const [relationList, setRelationList] = useState([
		{ label: 'Relation 1', value: '1' },
		{ label: 'Relation 2', value: '2' },
		{ label: 'Relation 3', value: '3' },
	]);
	const [responseData, setResponseData] = useState([]);
	const [actionData, setActionData] = useState([]);

	const { supportId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
    const dispatch = useDispatch();
	const user = DecryptToken();
	const privilege = getPermission();

  useEffect(() => {
	handleSetToken();
    dispatch(addItem({title:'Support', path: location?.pathname, tab:"" }));
  },[])

  const breadcrumbs = useSelector(state => state.BreadCrumbs.items); // Accessing breadcrumbs from Redux store state


	// filter array with array key and value
	const filterArray = (arr, value) => {
		const filteredData = arr.find((item) => {
			return item.value == value
		})
		return filteredData;
	}

	// get support data
	const fetchOnLoad = async () => {
		const result = await CallGETAPI("support/ticket-details/" + supportId);
		if (result?.status) {
			let ticketDetails = result?.data?.ticketDetails;
			setFormData(ticketDetails);
			setResponseData(result?.data?.responseData);
			setActionData(result?.data?.actionData);
			setIssueType(result?.data.ticketDetails?.issue_type);

			if (ticketDetails?.issue_type) {
				let filteredIssueType = filterArray(issueTypeList, ticketDetails?.issue_type);
				setSelectedData((old) => ({ ...old, ['issue_type']: filteredIssueType }));
			}
			if (ticketDetails?.assign_to) {
				let filteredIssueType = filterArray(assignedToList, ticketDetails?.assign_to);
				setSelectedData((old) => ({ ...old, ['assign_to']: filteredIssueType }));
			}
			if (ticketDetails?.related_to) {
				let filteredIssueType = filterArray(relatedToList, ticketDetails?.related_to);
				setSelectedData((old) => ({ ...old, ['related_to']: filteredIssueType }));
			}
			if (ticketDetails?.relation) {
				let filteredIssueType = filterArray(relationList, ticketDetails?.relation);
				setSelectedData((old) => ({ ...old, ['relation']: filteredIssueType }));
			}
		}
		setBtnLoading(false);
	}

	useEffect(() => {
		fetchOnLoad();
	}, [respondModal])


	const handleClose = async () => {
		setBtnLoading(true)
		const result = await CallGETAPI("support/close-ticket/" + supportId);
		if (result?.data?.status) {
			setConfirmModal(false)
			toast.success(result?.data?.msg);
			fetchOnLoad();
		} else {
			setConfirmModal(false)
			toast.error(result?.data?.msg);
		}
		setBtnLoading(false)
	}

	const addContacts = () => {
		setAddContactsModal(true)
	}

	const refreshSupportDetails = async () => {
		setTimeout(fetchOnLoad, 1000);
		console.log("Call Details API");
	};

	let profile = GetProfile(); //JSON.parse(localStorage.getItem("ross-profile"))
	let account_id = profile?.account_id
	let contact_id = profile?.contact_id

	let is_user = false
	let privileges = []
	if (profile.user_type > 1) {
		let permissions =  getPermission() //localStorage.getItem('permissions')
		let permissionsArr = permissions.split(',')
		privileges = permissionsArr
		is_user = true
	}

	return (
		<>
			{btnLoading ? (
				<>
					<div className="showloading">
						<Loading />
					</div>
				</>
			) : (<>
				<div className='mt-4 pb-5' style={{ paddingInline: "45px" }}>
					<SubHeading title={'Support Ticket'} hideNew={true} newUrl={''} subHeading={true} hideHierarchy={true} editUrl={''} backTab={'Sites'} bottomLinks={false} breadcrumbs={breadcrumbs} />

					{/* bottom buttons */}
					<div className="d-flex" style={{ gap: "10px" }}>
						{
							is_user === true ?
								<>
									<div>

										{privileges.includes('support-respond') && (
											<button
												className="btn text-primary"
												type="button"
												onClick={() => setRespondModal(true)}
											>
												<img
													src="/edit.svg"
													alt="Edit"
													style={{ marginRight: "5px" }}
												/>
												<span className="ms-1">Respond</span>
											</button>
										)}

										{privileges.includes('support-close') && (
											parseInt(formData?.status) === 1 ?
												<button
													className="btn text-primary"
													type="button"
													onClick={() => setConfirmModal(true)}
												>
													<img
														src="/close-blue.svg"
														alt="Close"
														style={{ marginRight: "5px" }}
													/>
													<span className="ms-1">Close</span>
												</button>
												: ""
										)}

										{privileges.includes('support-reassign') && (
											<button
												className="btn text-primary"
												type="button"
												onClick={() => addContacts()}
											>
												<img
													src="/reassign.svg"
													alt="Reassign"
													style={{ marginRight: "5px" }}
												/>
												<span className="ms-1">Reassign</span>
											</button>
										)}

									</div>
								</>
								:
								<>
									<div>
										<button
											className="btn text-primary"
											type="button"
											onClick={() => setRespondModal(true)}
										>
											<img
												src="/edit.svg"
												alt="Edit"
												style={{ marginRight: "5px" }}
											/>
											<span className="ms-1">Respond</span>
										</button>
										{parseInt(formData?.status) === 1 ?
											<button
												className="btn text-primary"
												type="button"
												onClick={() => setConfirmModal(true)}
											>
												<img
													src="/close-blue.svg"
													alt="Close"
													style={{ marginRight: "5px" }}
												/>
												<span className="ms-1">Close</span>
											</button>
											: ""}
										<button
											className="btn text-primary"
											type="button"
											onClick={() => addContacts()}
										>
											<img
												src="/reassign.svg"
												alt="Reassign"
												style={{ marginRight: "5px" }}
											/>
											<span className="ms-1">Reassign</span>
										</button>
									</div>
								</>
						}

						{addContactsModal && (
							<SupportContactsmodal
								addContactsModal={addContactsModal}
								setAddContactsModal={setAddContactsModal}
								supportId={supportId}
								issueType={issueType}
								onContactsSubmitted={refreshSupportDetails} // Pass the callback function
							/>
						)}

					</div>

					{/* main */}
					<div className="text-left mt-3">
						<h4 className='heading'>General Information</h4>
					</div>

					{/* table */}
					<table className="w-100 mt-2">
						<thead>
							<tr className="">
								<th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">Issue Type</th>
								<th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">Relation</th>
								<th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">Created By</th>
								<th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">Created Date</th>
								<th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">Assigned to</th>
								<th className="border border-2 py-1 px-2 bg-tbl-border border-t-blue">Support Status</th>
							</tr>
						</thead>
						<tbody>
							<tr className="">
								<td className="border border-2 py-1 px-2 border-r-blue">
									{selectedData?.issue_type?.label}
								</td>
								<td className="border border-2 py-1 px-2 border-r-blue">
									{formData?.relation}
								</td>
								<td className="border border-2 py-1 px-2 border-r-blue">
									{formData?.created_by}

								</td>
								<td className="border border-2 py-1 px-2 border-r-blue">
									<Moment date={formData?.created_date} format={'MM/DD/YYYY h:mm A'} />
								</td>
								<td className="border border-2 py-1 px-2 border-r-blue">
									{formData?.owner_name}
								</td>
								<td className="border border-2 py-1 px-2">
									{formData?.status == 0 ? 'Completed' : 'Active'}
								</td>
							</tr>
						</tbody>
						<tbody>
							<tr className="">
								<th colSpan={6} className="border border-2 py-1 px-2 bg-tbl-border border-t-blue">Issue</th>
							</tr>
							<tr className="">
								<td colSpan={6} className="border border-2 py-1 px-2 border-b-blue" style={{ maxWidth: '500px', overflowWrap: 'break-word' }}>{formData?.issue} </td>
							</tr>
						</tbody>
					</table>

					{actionData?.length > 0 ?
						<>
							<div className="text-left mt-3">
								<h4 className='heading'>Actions</h4>
							</div>

							<table className="w-100 mt-2">
								<thead>
									<tr className="">
										<th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">User Name</th>
										<th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">Action</th>
										<th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">Date</th>
										<th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">Result</th>
									</tr>
								</thead>
								<tbody>
									{actionData.map((t) => (
										<tr className="">
											<td className="border border-2 py-1 px-2 border-r-blue">
												{t?.user_name}
											</td>
											<td className="border border-2 py-1 px-2 border-r-blue">
												{t?.action}
											</td>
											<td className="border border-2 py-1 px-2 border-r-blue">
												<Moment date={t?.created_date} format={'MM/DD/YYYY h:mm A'} />
											</td>
											<td className="border border-2 py-1 px-2 border-r-blue">
												{t?.result}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</>

						: ""}

					{responseData?.length > 0 && (

						<>
							{/* response */}
							<div className="text-left mt-3">
								<h4 className='heading'>Responses</h4>
							</div>

							{/* table */}
							<table className="w-100 mt-2">
								<thead>
									<tr className="">
										<th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">User Name</th>
										<th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">Response Date</th>
										<th className="border border-2 py-1 px-2 bg-tbl-border border-t-blue">Issue</th>
									</tr>
								</thead>
								<tbody>
									{responseData?.map((response, index) => (
										<tr className="" key={index}>
											<td className="border border-2 py-1 px-2 border-r-blue border-b-blue">
												{response?.created_by}
											</td>
											<td className="border border-2 py-1 px-2 border-r-blue border-b-blue">
												<Moment date={response?.created_date} format={'MM/DD/YYYY h:mm A'} />
											</td>
											<td className="border border-2 py-1 px-2 border-b-blue" >
												{response?.information}
											</td>
										</tr>
									))}
								</tbody>

							</table>

						</>
					)}
				</div>

				<div className="pb-5" style={{ marginTop: "96px" }}>
					<div className="d-flex justify-content-evenly ">
						{/* <Moment date={formData?.modified_date} format={'DD-MM-YYYY'} /> */}
						<span>Created Date: {formData?.created_date ? FormatDateWithTime(formData?.created_date) : ''}</span>
						<span>Created By: {formData?.created_by}</span>
						<span>Modified Date: {formData?.modified_date ? FormatDateWithTime(formData?.modified_date) : ''} </span>
						<span>Modified By: {formData?.modifiedBy?.account_name}</span>
						<span>Last Touch Date: </span>
					</div>
				</div>
			</>)}

			{/* respondmodal */}
			<RespondModal
				respondModal={respondModal}
				setRespondModal={setRespondModal}
			/>

			<ConfirmAlert
				show={confirmModal}
				handleClose={() => setConfirmModal(false)}
				msg={"Are you sure? you want to close this issue"}
				handleOk={handleClose}
				loading={btnLoading}
			/>
		</>
	)
}
