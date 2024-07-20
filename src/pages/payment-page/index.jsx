import React from 'react'
import CreaditCardForm from '../../components/forms/PaymentForms/creaditCard'
import { useLocation } from 'react-router';

function PaymentPage({ setShowSidebar })
{
	const location = useLocation();
	console.log(location);

	return (
		<>
			<CreaditCardForm 
				classId = {location?.state?.classId} 
			/>
		</>
	)
}

export default PaymentPage