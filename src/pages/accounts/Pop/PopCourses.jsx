import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { addAccessories } from '../../../redux/slices/AccessoriesSlice'; // Update the path to your equipmentSlice file

import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import Select from 'react-select';
import Locations from "../../../img/Locations.svg";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import CustomToggleButton from '../../../components/common/toggleSwitch/CustomToggleButton';
import { GetAedBrands, GetAedModelsByBrandId, GetCartAgencyCoursesList } from '../../../helper/BasicFn';
import { CallGETAPI, CallPOSTAPI } from '../../../helper/API';
import { prepareOptions } from '../../../helper/Common';
import AddSitesmodal from './AddSitesPage';
import { toast } from 'react-toastify';
import { addCourseData,updateCourseList } from '../../../redux/slices/EquipmentSlice';


const PopCourses = ({ courseModal,setCourseModal,accountId,siteId,cerifyAgencyList,ContractPricingData,setContractPricingData,edit,EditCourseId }) => {
  const handleClose = () => setCourseModal(false);
    const [validated, setValidated] = useState(false);
    const [validatedsites, setvalidatedsites] = useState(false);
    const [selectedSites,setSelectedSites] = useState([]);
   const [addSitesModal, setAddSitesModal] = useState(false);
   const [isFieldEmpty, setIsFieldEmpty] = useState(false);
   const [showError, setShowError] = useState(false);
   const [editData, setEditData] = useState("")
   const dispatch  = useDispatch();
   const POPCourseList = useSelector((state) => state.equipment.POPCourseList)
  


    const [formData, setFormData] = useState({
        CertifyingAgency: '',
        AllowedClass: '',
        ClassPrice: '',
        PricePerStudent: '',
        Minimum: '',
        Maximum: '',
        CLIN: '',
        Sites: '',
        account_id: accountId,
        site_id:siteId
      });
      const [loading,setLoading] = useState(false);
      const callSaveCourseAPI = async () => {
        let siteIds = selectedSites.map((item)=>(item.account_site_info_id))
        if(!siteIds){
          toast.error('Please Select Sites...');
          return "";
        }
        setLoading(true)

        const coursesPayload ={
            "certifying_agency": formData.CertifyingAgency,
                 "allowed_class": formData?.AllowedClass,
                 "class_price": formData?.ClassPrice ?? "",
                 "price_per_student": formData?.PricePerStudent ??  "" ,
                 "min": formData?.Minimum ?? '',
                 "max": formData?.Maximum ?? '',
                 "clin":  formData?.CLIN ?? "",
                 "sites": siteIds.toString() || "",//formData?.Sites,
                 "account_id":accountId,
                 "site_id": siteId
        }
        let arr = [...ContractPricingData];
        let result = await CallPOSTAPI('account/add-course-contract',coursesPayload)
        if(result.data.status){
          const crData  = result.data.data.courseData;
          const obj = {
            ...crData,
            minMaxEnroll : crData.min+'/'+crData.max, 
            certAgencyName: result?.data?.data?.certAgency,
            allowed_className:result?.data?.data?.allowed_class,
            sitesNames: result?.data?.data?.siteName
          }
          arr.push(obj);
          toast.success(result.data.status)
          dispatch(addCourseData(obj))
          setContractPricingData(arr);
        }else{
          toast.error(result.data.status)
        }
        handleClose(); 
        setLoading(false)
      }

console.log(selectedSites)
      const callUpdateCourseAPI = async () => {
        let siteIds = selectedSites.map((item)=>(item.account_site_info_id))
        if(!siteIds){
          toast.error('Please Select Sites...');
          return "";
        }
        setLoading(true)

        const coursesPayload ={
          "course_id": EditCourseId.id,
            "certifying_agency": formData.CertifyingAgency,
                 "allowed_class": formData?.AllowedClass,
                 "class_price": formData?.ClassPrice ?? "",
                 "price_per_student": formData?.PricePerStudent ??  "" ,
                 "min": formData?.Minimum ?? '',
                 "max": formData?.Maximum ?? '',
                 "clin":  formData?.CLIN ?? "",
                 "sites": siteIds.toString() || "",//formData?.Sites,
                 "account_id":accountId,
                 "site_id": siteId
        }
        let arr = [...ContractPricingData];
        let result = await CallPOSTAPI('account/update-course',coursesPayload)
        if(result.data.status){
          const crData  = result.data.data.courseData;
          const obj = {
            ...crData,
            minMaxEnroll : crData.min+'/'+crData.max, 
            certAgencyName: result?.data?.data?.certAgency,
            allowed_className:result?.data?.data?.allowed_class,
            sitesNames: result?.data?.data?.siteName
          }
          const finfIndex = POPCourseList.findIndex(it=>parseInt(it.id)===parseInt(coursesPayload?.course_id ))
          // console.log({finfIndex})
          const arr = [...POPCourseList];
          console.log({finfIndex})
          if(finfIndex !=-1){
            arr[finfIndex] = obj
            console.log({arr})
            console.log("updateCourse")
            dispatch(updateCourseList(arr));              
          }
          // arr.push(obj);
          // toast.success(result.data.status)
          // dispatch(updateCourseList(obj))
          // setContractPricingData(arr);
        }else{
          toast.error(result.data.status)
        }
        handleClose(); 
        setLoading(false)
      }

const [siteListAr,setSiteListAr] = useState([])
      const fetchLoad = async () =>{
        if(!edit){
        let res = await CallGETAPI('account/get-course-contract-by-id/' + accountId);
        // console.log(res);
        }
        if(edit){
          let res = await CallGETAPI('account/get-course-contract-by-id/' + EditCourseId.id );
          // console.log(res);
          const editDataresponse = res?.data.data.courseData;
          setEditData(editDataresponse);

          if(edit){

            const response = await CallGETAPI('account/account-site-list/'+accountId);
            const sitesdetails = response?.data?.data?.site_details || [];
            // setSitesList(sitesdetails);
            console.log({sitesdetails});
            setSiteListAr(sitesdetails);
      const lt = EditCourseId.sites.split(",");
const selArr = [];
            for (let index = 0; index < sitesdetails.length; index++) {
              const element = sitesdetails[index];
              if(lt.includes(element.account_site_info_id.toString())){
                // .sites EditCourseId.sites
                selArr.push(element);
              }
              
            }
console.log({selArr})
            setSelectedSites(selArr);

          }
          
          // setBrandEditId(editDataresponse.brand)
          }
      }
        // console.log(editData)
      useEffect(() => {
        fetchLoad();
      },[]);

        // Handle form field changes
  const handleChange = async (e, fieldName) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };
  const [ allCourses, setCourses ] = useState([]);
  const fetchCartCourses = async (cartId) => {
    // console.log(cartId)
        let courses = await GetCartAgencyCoursesList(cartId)

        if (courses.status)
        {
            let courseListData = courses?.data?.courseList
            let allcourseListData = prepareOptions(courseListData, "course_id", "course_name");
            setCourses(allcourseListData)
        }
    }

    const editCartCourses = async (cartId) => {
      // console.log(cartId)
          let courses = await GetCartAgencyCoursesList(cartId)
  
          if (courses.status)
          {
              let courseListData = courses?.data?.courseList
              let allcourseListData = prepareOptions(courseListData, "course_id", "course_name");
              setCourses(allcourseListData)
          }
      }

    useEffect(()=>{
      // EditCourseId
      if(EditCourseId && edit){
        console.log({EditCourseId})
        
      const FD  = {...formData};
        FD.CertifyingAgency = EditCourseId?.certifying_agency;
        FD.AllowedClass= EditCourseId?.allowed_class;
        FD.ClassPrice= EditCourseId?.class_price;
        FD.PricePerStudent= EditCourseId?.price_per_student;
        FD.Minimum= EditCourseId?.min;
        FD.Maximum= EditCourseId?.max;
        FD.CLIN= EditCourseId?.clin;
        FD.Sites= EditCourseId?.sites;
        // setSelectedBrandId(EditAccessoriesId?.brand);
        setSelectedSites([EditCourseId?.sites]);
        editCartCourses(EditCourseId?.certifying_agency);
        setFormData(FD);
      }

    },[edit,EditCourseId])

  
    const handleCoursesSubmit = async (event) => {
        event.preventDefault();

        if(selectedSites.length === 0){
          setShowError(true)
        }else{
          setShowError(false);
        }

        if(selectedSites.length =='0'){       
           setvalidatedsites(true);
    }else{
      setvalidatedsites(false);
    }

        if (
          !formData.CertifyingAgency ||
          !formData.AllowedClass ||
          selectedSites.length === 0
        ) {
          setValidated(true);
          return;
        }
        console.log('Form data submitted:', formData);
        if(edit == ""){
         await callSaveCourseAPI();
        }
        if(edit){
          await callUpdateCourseAPI();
          }

        
      };
const [editIdList,setEditIdList] = useState([]);
 // Monitor changes in selectedSites length and update showError state
  useEffect(() => {
    if (selectedSites.length > 0) {
      // setShowError(true);
      setShowError(false);
    } else {

    }

    if(edit){
      // CourseId.site
      const lt = EditCourseId.sites.split(",");

      console.log({lt });
      setEditIdList(lt);
      
    }
  }, [selectedSites]);


    return(
      <> 
      <Modal show={ courseModal } onHide={ handleClose }
      dialogClassName="training-modal"
      aria-labelledby=""
      size="lg"
      id="address-modal"
  >
        <div className="mt-4" style={ { width: "100%", paddingInline: "2%" } }>

        {/* <SubHeadingOther title="Account: Meep Fitness" hideNew={true} hideHierarchy={true} hideInstructor={true} subHeading={true} bottomLinks={false}/> */}

        <Modal.Body>
        <Form
     className=""
     onSubmit={handleCoursesSubmit}
     noValidate
     validated={validated}
     id="create-new-courses-form"
   >
     <div
       className="container-fluid mt-4 bottom-border-blue pt-2"
       style={{
         borderBottom: "4px solid rgb(13, 110, 253)",
         background: "#eee",
         width:"100%"
       }}
     >
       <h2 className="heading">Course Contract Pricing Information</h2>

       <div className="row my-3">
         <div className="row my-3 display-flex align-items-center">
         <Form.Group className={"col"} style={{ display: "inline-block", minWidth:"17%" }}>
             <Form.Label >Certifying Agency*</Form.Label>
             <select  className="form-control"
               type="text"
               name="CertifyingAgency"
               value={formData.CertifyingAgency}
               onChange={(e) => {
                handleChange(e, 'CertifyingAgency')
                fetchCartCourses(e.target.value)
              }}
               required
               placeholder='- Select-One -'
               >
                 <option value="">- Select one -</option>
                {cerifyAgencyList.map((item)=>(
                  <option value={item.value}>{item.label}</option>
                 ))}
               </select>
               <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback>
           </Form.Group>

           <Form.Group className={"col"}>
           <Form.Label>Allowed Class*</Form.Label>
           <select
              className="form-control"
              name="AllowedClass"
              value={formData.AllowedClass}
              onChange={(e) => handleChange(e, 'AllowedClass')}
              placeholder='- Select-One -'
              required
            >
                  <option value="">- Select one -</option>
                  {allCourses.map((item)=>(
                    <option value={item.value}>{item.label}</option>
                   ))}
                </select>
           <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback>
         </Form.Group>

         <Form.Group className={"col dollar-sign"}>
             <Form.Label>Class price</Form.Label>
             <Form.Control
               type="number"
               name="ClassPrice"
               value={formData.ClassPrice}
               onChange={(e) => handleChange(e, 'ClassPrice')}
            />
           </Form.Group>

            <Form.Group className={"col dollar-sign"}>
             <Form.Label style={{fontSize: '15px'}}>Price Per Student</Form.Label>
             <Form.Control
               type="number"
               name="PricePerStudent"
               value={formData.PricePerStudent}
            onChange={(e)=> handleChange(e, 'PricePerStudent')}
             />
            </Form.Group>

            <Form.Group className={"col "}>
             <Form.Label>Minimum</Form.Label>
             <Form.Control
               type="number"
               name="Minimum"
               value={formData.Minimum}
            onChange={(e)=> handleChange(e, 'Minimum')}
             />
            </Form.Group>

            <Form.Group className={"col "}>
             <Form.Label>Maximum</Form.Label>
             <Form.Control
               type="number"
               name="Maximum"
               value={formData.Maximum}
            onChange={((e)=> handleChange(e, 'Maximum'))}
             />
            </Form.Group>

            <Form.Group className={"col"}>
             <Form.Label>CLIN</Form.Label>
             <Form.Control
               type="number"
               name="CLIN"
               value={formData.CLIN}
            onChange={(e)=> handleChange(e, 'CLIN')}
           />
            </Form.Group>

            <Form.Group className={"row my-3"} style={{ width: "100%", paddingLeft: "2%" }} >
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <Form.Label>Sites*</Form.Label>
    <button type="button" onClick={() => setAddSitesModal(true)} className='btn'>
      <img src={Locations} alt="" />
      <Form.Label style={{ color: "rgb(12, 113, 195", fontFamily: "Calibri", fontStyle: "normal", marginLeft: "2px", marginRight: "3px" }}>Sites</Form.Label>
    </button>
  </div>

  {addSitesModal && (
    <AddSitesmodal
      addSitesModal={addSitesModal}
      setAddSitesModal={setAddSitesModal}
      selectedSites={selectedSites}
      setSelectedSites={setSelectedSites}
      accountId={accountId}
    />
  )}

  <div className= 'bg-white'>
    <ul className='mt-2' style={{ height: '150px', overflow: 'auto', listStyle: 'none', paddingLeft: '10px' }} 
     onChange={(e)=> handleChange(e, 'account_site_name')}>


  <div className="bg-white">
    <ul className='mt-2' style={{ height: '150px', overflow: 'auto', listStyle: 'none', paddingLeft: '10px' }}>
      {selectedSites.map((site) => (
        <li key={site?.id} className='list-item mt-2 pl-1'>
          <span>{site?.account_site_name}</span>
        </li>
      ))}
      {/* {edit && (
      <li className='list-item mt-2 pl-1'>
        <span>
          
          {EditCourseId.sites
            .split(',')
            .map(id => selectedSites.find(site => site.id === parseInt(id))?.account_site_name)
            .join(', ')}
        </span>
      </li>
    )} */}
    </ul>
  </div>

</ul>
</div>
{showError && (
    <div className="invalid mt-2">
      This field is required.
    </div>
)}


</Form.Group>



           </div>
            </div>
            </div>
          

             {/* bottom buttons */}
        <div className="row pb-3 py-5" >
          <div className="col-12 content-flex-right" >
           <button className="btn btn-danger text-uppercase" type="button" onClick={handleClose }>Cancel</button>
           {edit ? (
              <button className="btn btn-success text-uppercase ms-2" type="update" disabled={loading} >{loading?'Loading...':'Update'}</button>) : (
              <button className="btn btn-success text-uppercase ms-2" type="submit" disabled={loading} >{loading?'Loading...':'Submit'}</button>
              )} </div>
       </div> 
       </Form> 
       </Modal.Body>                                                                      
 
</div>
</Modal>
</>
    )
}

export default PopCourses;