import React, { useEffect, useState } from 'react'
import Details from '../../pages/accounts/inperson/tabs/Details'
import { CallGETAPINEW } from '../../helper/API';
import { useNavigate, useParams } from 'react-router-dom';
import { GetAssignedInstructorsByClass, GetClassContactsByAddressAndCert } from '../../helper/BasicFn';
import BackButton from '../../components/common/BackButton';
import UserInpersonDetails from '../../pages/accounts/inperson/tabs/UserInpersonDetails';

const UserClassDetails = () => {
  const [assignedInstructors, setAssignedInstructors] = React.useState([]);
  const [inpersonClass, setInpersonsClass] = useState({});
  const navigate = useNavigate();
  const {inpersonId} = useParams();
  const [allInstructors, setAllInstructors] = useState([]);




  
    // get instructors
    const fetchOnLoad = async() => {
      if(!inpersonId || inpersonId===undefined) return '';
      const inpersonData = await CallGETAPINEW('account/inperson-class/' + inpersonId)
  
      if(inpersonData?.status) {
          const inperson = inpersonData?.data?.data?.inpersonClass
          inperson.account_name = inpersonData?.data?.data?.account_name
          inperson.cert_name = inpersonData?.data?.data?.certName
          inperson.course_name = inpersonData?.data?.data?.courseName
          inperson.site_name = inpersonData?.data?.data?.site_name

          setInpersonsClass(inperson)

          const instructors = await GetClassContactsByAddressAndCert(inperson?.training_address_id, inperson?.cert_agency)
          if(instructors?.status) {
              setAllInstructors(instructors?.data);
          }
      }

      const result = await GetAssignedInstructorsByClass(inpersonId)

      if(result?.status) {
          let data = result?.classInstructor?.class_instructors;
          data = JSON.parse(data);
          setAssignedInstructors(data)
      }

  }
  useEffect(()=>{
    fetchOnLoad();
  },[])
  return (
    <>  
        <div className="mt-4" style={ { width: "100%", paddingInline: "45px" } }>
          <BackButton/>
          <UserInpersonDetails assignedInstructors={ assignedInstructors } is_user={true} />
        </div>
    </>
  )
}

export default UserClassDetails