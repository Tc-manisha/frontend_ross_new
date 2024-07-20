import React, { useEffect, useState } from 'react'
import SubHeading from '../../components/header/SubHeading'
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { CallGETAPI, CallPOSTAPI } from '../../helper/API';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import ForwardModal from '../../components/modals/forwardModal/ForwardModal';
import Loading from './Loading';
import Resend from "../../../src/img/resend-icon.svg";
import Forward from "../../../src/img/right-arrow-icon.svg";


export default function EmailDetails() {

    const [ emailDetails, setEmailDetails ] = useState({});
    const [ emailList, setEmailList ] = useState([]);
    const [ forwardMailModal, setForwardMailModal ] = useState(false);
    const [loading, setLoading] = useState(true);
    const { emailId } = useParams();

    // fetch email
	const fetchEmail = async() => {
		const result = await CallGETAPI('account/email-by-id/' + emailId);

		if(result?.status ) {
			const emailDetails = result?.data?.emailDetails;
			setEmailDetails(emailDetails);

            let emailListData = []
            let data = {
                'id': result?.data?.emailDetails?.id,
                'sender': 'System',
                'receiver': result?.data?.emailDetails?.email,
                'email_date': result?.data?.emailDetails?.created_date,
                'resend_forward': result?.data?.emailDetails?.resend + ' / ' + result?.data?.emailDetails?.forword,
            }
            emailListData.push(data);
            setEmailList(emailListData);
            setLoading(false);
		}
	}

	// use effect
	useEffect(() => {
		fetchEmail();
	}, []);

    // resend email
    const resendEmail = async() => {
        const result = await CallPOSTAPI('account/resend-email/'+emailId);

        // check if status is true show the email send successfully
        if(result?.status) {
             Swal.fire({
                text: result?.data?.msg,
                icon: 'success',
            })
        } else if(!result?.status) {
            Swal.fire({
                text: 'Error on resend email',
                icon: 'error',
            })
        }
    }


    return (
        <>
          {loading ? (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      ) : (
            <div className="mt-4" style={ { width: "100%", paddingInline: "45px" } }>

                <SubHeading title={ 'Email: Request for information 02/24/2023' } subHeading={ true } bottomLinks={ false } />

                {/* top links */}
                <div className="d-flex" style={ { justifyContent: "space-between" } } >
                    <div className="d-flex" style={ { gap: "10px" } }>
                        <button className="btn text-primary" type="button" onClick={resendEmail}>
                            <img src={Resend} alt="svg" style={ { marginRight: "5px" } } />
                            <span className="ms-2">Resend</span>
                        </button>
                        <img src={Forward} alt="arrow-right-icon" style={ { marginRight: "5px" } } />
                        <button className="btn text-primary p-0" type="button" onClick={() => setForwardMailModal(true)} >
                            <span className="ms-2">Forward</span>
                        </button>
                    </div>
                </div>

                {/* table */}
                <div className="mt-4">
                    <DataGrid
                        dataSource={ emailList }
                        keyExpr="id"
                        showColumnLines={ true }
                        showRowLines={ true }
                        showBorders={ false }
                        rowAlternationEnabled={ true }>
                        <Column dataField="sender" caption={"Sender"} cssClass="column-header" />
                        <Column dataField="receiver" caption={"Receiver"} cssClass="column-header" />
                        <Column dataField="email_date" caption={"Email Date"} dataType={'date'} cssClass="column-header" />
                        <Column dataField="resend_forward" caption={"Resend/Forward"} cssClass="column-header" />

                    </DataGrid>
                </div>

                {/* email data */}
                <div className="email-data mt-4">
                    <h4 className='heading'>Email</h4>

                    {/* email body */}
                    <div className="body py-5 my-4">
                        <div dangerouslySetInnerHTML={{ __html: emailDetails?.body }} />
                    </div>
                </div>

                {/* show modal */}
                <ForwardModal 
                    forwardMailModal={forwardMailModal} 
                    setForwardMailModal={setForwardMailModal} 
                />

            </div>
      )}
        </>
    )
}
