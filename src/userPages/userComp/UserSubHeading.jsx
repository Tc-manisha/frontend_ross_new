import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { CallGETAPI } from "../../helper/API";
import { useParams } from "react-router";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import Dropdown from "react-bootstrap/Dropdown";
import { useSelector } from "react-redux";
import Loading from "../../pages/accounts/Loading";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 386,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

export default function UserSubHeading({
	setShowSidebar,
	title,
	subTitle = "",
	showEditDelete = false,
	HandleEditDelete,
	handleDrawerOpen,
	hideNew,
	hideHierarchy,
	newUrl,
	backTab = "",
	subHeading,
	hideInstructor,
	bottomLinks,
	account = "",
	assign_equipment = 0,
	is_user,
	privileges
}) {
	const [open, setOpen] = React.useState(false);
	const [openModel, setOpenModel] = React.useState(false);
	const [newTab, setNewTab] = React.useState(false);

	const { accountId } = useParams();
	const { contactId } = useParams();
	const prev_selected_tb = useSelector((state) => state?.TAB_manager?.selectedTab)
	const [loading, setLoading] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => setOpen(false);

	const deleteaccount = async () => {
		CallGETAPI("account/delete-account/" + accountId);
		setOpenModel(true);

		navigate("/accounts-listing", {
			state: {
				showDelete: true,
			},
		});
	};

	const handleCloseModel = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenModel(false);
	};

	const location = useLocation();
	const navigate = useNavigate();

	title = location?.state?.siteTitle ?? title;
	const editUrl = location?.state?.editUrl || "";
	const deleteUrl = location?.state?.deleteUrl || "";

	const HandleEditClick = (url) => {
		navigate(url, { state: { siteTitle: "Edit : " + title } });
	};

	const HandleClick = (url) => {
		navigate(url);
	};

	const handleBackButton = () => {
		setLoading(true);
		setTimeout(() => {
			const path = location.pathname;
			const intructorNew = path.includes("/account/instructor/new/");

			if (intructorNew) {
				navigate(-1, {
					state: {
						refresh: true,
					},
				});
			}
			else if (prev_selected_tb) {
				navigate(-1, {
					state: {
						tab: prev_selected_tb,
					},
				});
			}
			else {
				navigate(-1);
			}
			setLoading(false)
		}, 0)
	};

	return (
		<>
			{/* {loading && (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      )} */}
			<Container fluid id="sub-header" className="">
				{/* <div style={ { width: '87%', margin: 'auto', padding: '6px 0'} }> */}
				{subHeading && (
					<div
						className=""
						style={{ width: "100%", margin: "auto", padding: "6px 0" }}
					>
						{/* { ToogleIcon() } */}
						<button
							className="btn text-primary"
							type="button"
							onClick={() => {
								handleBackButton();
							}}
						>
							<img src="/back.svg" alt="svg" style={{ marginRight: "5px" }} />
							<span className="ms-2">Back</span>
						</button>
						<div className="d-flex" style={{ paddingLeft: "0px" }}>
							{subTitle ? (
								<div className="site-header">
									{/* { ToogleIcon() } */}
									<div className="" style={{ display: "flex", flexDirection: "row" }}>
										<div className="title">{title}:</div>
										<div className="sub-title" style={{ marginLeft: "4px", color: "rgba(12, 113, 195, 1)" }}>{subTitle}</div>
									</div>
								</div>
							) : (
								<h1 className={"newAccountH1"}>
									{/* { ToogleIcon() } */}
									<span className="account-title">{title}</span>
								</h1>
							)}
						</div>

						{bottomLinks && (
							<div
								className="d-flex"
								style={{ justifyContent: "space-between" }}
							>
								<div className="d-flex" style={{ gap: "10px" }}>
									{
										is_user === 1 ?
											<>
												{privileges.includes('contact-details-edit') && (
													editUrl && (
														<button
															className="btn text-primary"
															type="button"
															onClick={() => HandleEditClick(editUrl)}
														>
															<img
																src="/edit.svg"
																alt="Edit"
																style={{ marginRight: "5px" }}
															/>
															<span className="ms-1">Edit</span>
														</button>
													)
												)}
											</>
											:
											<>
												{editUrl && (
													<button
														className="btn text-primary"
														type="button"
														onClick={() => HandleEditClick(editUrl)}
													>
														<img
															src="/edit.svg"
															alt="Edit"
															style={{ marginRight: "5px" }}
														/>
														<span className="ms-1">Edit</span>
													</button>
												)}
											</>
									}
									{!hideNew && (
										<button
											className="btn text-primary ms-2"
											type="button"
											onClick={() => HandleEditClick(newUrl)}
										>
											<img
												src="/add.svg"
												alt="svg"
												style={{ marginRight: "5px" }}
											/>
											<span className="ms-1">New</span>
										</button>
									)}

									{
										is_user === 1 ?
											<>
												{privileges.includes('contacts-new') && (
													editUrl && (
														//make a func 
														'mm'
													)
												)}
											</>
											:
											<>
												{hideNew == "tab" && (
													<>
														<Dropdown>
															<Dropdown.Toggle
																className="btn btn-transparent text-primary ms-2 bg-white"
																id="new-tab-btn"
																// style={{ backgroundColor: "transparent !important" }}
																style={{ backgroundColor: "transparent !important", border: "none" }}

															>
																<img
																	src="/add.svg"
																	alt="New"
																	style={{ marginRight: "5px" }}
																/>
																<span className="ms-1">New</span>
															</Dropdown.Toggle>

															<Dropdown.Menu className="bg-primary menu-dropdown">
																<Dropdown.Item
																	onClick={() => {
																		navigate("/account/contacts/new/" + accountId);
																	}}
																>
																	New Contacts
																</Dropdown.Item>
																<Dropdown.Item>New Documents</Dropdown.Item>
																<Dropdown.Item
																	onClick={() => {
																		navigate("/account/inperson/new/" + accountId);
																	}}
																>
																	New Inperson
																</Dropdown.Item>
																<Dropdown.Item
																	onClick={() => {
																		let url = "/account/new-note?account_id=" + accountId
																		if (contactId) {
																			url += "&contact_id=" + contactId;
																		}
																		navigate(url, {
																			state: {
																				type: contactId ? 'contact' : 'account',
																				accountId: accountId,
																				contactId: contactId,
																			}
																		});
																	}}
																>
																	New Note
																</Dropdown.Item>
																<Dropdown.Item>New POP</Dropdown.Item>
																<Dropdown.Item
																	onClick={() => {
																		navigate("/account/rfi/new/" + accountId);
																	}}
																>
																	New RFI
																</Dropdown.Item>
																<Dropdown.Item
																	onClick={() => {
																		navigate("/account/new-support", {
																			state: {
																				type: contactId ? 'contact' : 'account',
																				accountId: accountId,
																				contactId: contactId,
																			}
																		});
																	}}
																>
																	New Support
																</Dropdown.Item>
																<Dropdown.Item>New Training</Dropdown.Item>
																<Dropdown.Item
																	onClick={() => {
																		navigate("/account/new/aed/" + accountId);
																	}}
																>
																	New AED
																</Dropdown.Item>
															</Dropdown.Menu>
														</Dropdown>
													</>
												)}
											</>
									}

									{!hideHierarchy && (
										<button className="btn text-primary ms-2" type="button">
											<img
												src="/hierarchy.svg"
												alt="Hierarchy"
												style={{ marginRight: "5px" }}
											/>
											<span className="ms-1">Hierarchy</span>
										</button>
									)}

									{!hideInstructor && (
										<button
											className="btn text-primary ms-2"
											type="button"
											onClick={() =>
												HandleClick("/account/instructor/new/" + contactId)
											}
										>
											<img
												src="/create-instructor.svg"
												alt="Instructor"
												style={{ marginRight: "5px" }}
											/>
											<span className="ms-1">Instructor</span>
										</button>
									)}
								</div>

								{/* <div className="d-flex site-header-btns">
									{ deleteUrl && (
										<button
											className="d-flex btn text-danger"
											type="button"
											onClick={ () =>
											{
												handleOpen();
											} }
										>
											<img
												src="/delete.svg"
												alt="svg"
												style={ { marginRight: "5px" } }
											/>
											<span className="ms-2">Delete</span>
										</button>
									) }

									<Modal
										open={ open }
										onClose={ handleClose }
										aria-labelledby="modal-modal-title"
										aria-describedby="modal-modal-description"
									>
										<Box sx={ style }>
											<Typography
												id="modal-modal-title"
												variant="h6"
												component="h2"
											>
												<div className="text-danger">
													Are you Sure you Want To Delete!!!
												</div>
											</Typography>
											<div className="w-100 d-flex justify-content-center mt-3">
												<Button
													className="bg-danger text-white"
													style={ { marginRight: "15px" } }
													onClick={ () =>
													{
														handleClose();
													} }
												>
													Cancel
												</Button>
												<Button
													className="bg-success text-white"
													onClick={ () =>
													{
														deleteaccount();
													} }
												>
													Yes
												</Button>
											</div>
										</Box>
									</Modal>
								</div> */}
							</div>
						)}
					</div>
				)}
			</Container>
		</>
	);
}
