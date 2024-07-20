import React from 'react';
import "../../../src/global.css";
const currentYear = new Date().getFullYear();
export default function Footer() {
	return (
		<>
			<div className="container-fluid px-4 py-2 bg-black bottom-footer" >
				<footer className="main-footer">
					<div className="row Footer" >
						<div className="col-3 Footer-logo-div">
							<img className={''} src="/logo-colored.svg" />
						</div>
						<div className="col-6 text-center" >
							<b className="text-white CopyrightDiv">
								Copyright &copy; 2022-{currentYear} Rescue One Training for Life Inc. All Rights Reserved
							</b>
						</div>
						<div className="col-3 text-right footer-links PrivacyPolicyDiv" >
							<ul className="text-white list-wrapper">
								<li className="text-white">
									<a href="#">
										Privacy Policy
									</a>
								</li>
								<li className="text-white"> | </li>
								<li className="text-white">
									<a href="#">
										Terms and Conditions
									</a>
								</li>
							</ul>
						</div>

					</div>
				</footer>
			</div>


		</>
	)
}
