import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { CallGETAPI } from '../../../helper/API';

const AddSitesmodal = ({ accountId,addSitesModal, setAddSitesModal,selectedSites,setSelectedSites,is_edit=false,editSites,setEditSites}) => {
  const handleClose = () => setAddSitesModal(false);
  const [sitesList, setSitesList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [loading,setLoading] = useState(false);
  const [cachedSites,setCachedSites] = useState([]);

  const fetchLoad = async () => {   
    setLoading(true);
    if(is_edit){
      OnEdit();
    }else{
      OnAdd();
    }
    setLoading(false);
  }

  const OnAdd =  async ()=>{
    try {
      const response = await CallGETAPI('account/account-site-list/'+accountId);
      const sitesdetails = response?.data?.data?.site_details || [];
      // setSitesList(sitesdetails);
      setCachedSites(sitesdetails)

      
      // console.log({data: selectedSites.map((item)=>item?.account_site_info_id)})
    const allList       = sitesdetails;
    const allSelected   = selectedList;
    const RemoveListIds = removeCheck; //selectedSites.map((item)=>item?.account_site_info_id)//removeCheck;
    const NewAllList    = [];
    const newSelected   = [];// allSelected.filter(item =>(!RemoveListIds.includes(item.account_site_info_id)));

    for (let i2 = 0; i2 < allSelected.length; i2++) {
      const element = allSelected[i2];
      if(!RemoveListIds.includes(element.account_site_info_id.toString())){
        newSelected.push(element);
      }
    }
    // setSelectedList(newSelected);
    for (let i11 = 0; i11 < allList.length; i11++) {
      const element = allList[i11];
      const checkFindINNewSelected = newSelected.find(item => parseInt(item.account_site_info_id) === parseInt(element.account_site_info_id));  
      if(!checkFindINNewSelected){
        NewAllList.push(element);
      }
    }
    const NewListArr =[];
     NewAllList.map((it)=>{
      const checkFindINNewSelected = selectedSites.find(item => parseInt(item.account_site_info_id) === parseInt(it?.account_site_info_id));  
      if(!checkFindINNewSelected?.account_site_info_id){
        NewListArr.push(it);
      }
    })
    setSitesList(NewListArr);
    
    } catch (error) {
      console.error('Error fetching sites data:', error);
    }
  }

  const OnEdit = async ()=>{
    try {
      const response = await CallGETAPI('account/account-site-list/'+accountId);
      const sitesdetails = response?.data?.data?.site_details || [];
      // setSitesList(sitesdetails);

      // get selected List = 
      const getSelectList = [];
      for (let index = 0; index < sitesdetails.length; index++) {
        const element = sitesdetails[index];
        const checkFindINNewSelected = editSites.find(item => parseInt(item.account_site_info_id) === parseInt(element.account_site_info_id));  
        if(checkFindINNewSelected?.account_site_info_id){
          getSelectList.push(element);
        }
      }
      setCachedSites(sitesdetails)
      // console.log({data: selectedSites.map((item)=>item?.account_site_info_id)})
    const allList       = sitesdetails;
    const allSelected   = [...selectedList,...getSelectList];
    const RemoveListIds = removeCheck; //selectedSites.map((item)=>item?.account_site_info_id)//removeCheck;
    const NewAllList    = [];
    const newSelected   = [];// allSelected.filter(item =>(!RemoveListIds.includes(item.account_site_info_id)));
    for (let i2 = 0; i2 < allSelected.length; i2++) {
      const element = allSelected[i2];
      if(!RemoveListIds.includes(element.account_site_info_id.toString())){
        newSelected.push(element);
      }
    }
    // setSelectedList(newSelected);
    for (let i11 = 0; i11 < allList.length; i11++) {
      const element = allList[i11];
      const checkFindINNewSelected = newSelected.find(item => parseInt(item.account_site_info_id) === parseInt(element.account_site_info_id));  
      if(!checkFindINNewSelected){
        NewAllList.push(element);
      }
    }
    const NewListArr =[];
     NewAllList.map((it)=>{
      const checkFindINNewSelected = selectedSites.find(item => parseInt(item.account_site_info_id) === parseInt(it?.account_site_info_id));  
      if(!checkFindINNewSelected?.account_site_info_id){
        NewListArr.push(it);
      }
    })
    setSitesList(NewListArr);
    setSelectedList(allSelected);
    } catch (error) {
      console.error('Error fetching sites data:', error);
    }
  }

  useEffect(() => {
    fetchLoad();
  }, []);

  const handleCheckClick = (e) => {
    const checkboxVal = e.target.value;
    const isChecked = e.target.checked;
    if (isChecked) {
      setCheckedList((prevCheckedList) => [...prevCheckedList, checkboxVal]);
    } else {
      setCheckedList((prevCheckedList) =>
        prevCheckedList.filter((item) => item !== checkboxVal)
      );
    }
  }

  const [removeCheck,setRemoveCheck] = useState([]);
  const handleRemoveCheckClick = (e) => {
    const checkboxVal = e.target.value;
    const isChecked = e.target.checked;
    if (isChecked) {
      setRemoveCheck((prevCheckedList) => [...prevCheckedList, checkboxVal]);
    } else {
      setRemoveCheck((prevCheckedList) =>
        prevCheckedList.filter((item) => item !== checkboxVal)
      );
    }
  }


  const handleAdd = () => {
    // Move selected items from "Sites" to "Selected Sites"
    // checkedList
    if(checkedList.length===0){
      return "";
    }
    const selectedItems = sitesList.filter(item =>
      checkedList.includes(item.account_site_info_id.toString())
    );

    setSitesList(prevSitesList => prevSitesList.filter(item =>
      !checkedList.includes(item.account_site_info_id.toString())
    ));
    setSelectedList(prevSelectedList => [...prevSelectedList, ...selectedItems]);
    setCheckedList([]); // Clear the checkedList after adding
  }


  const handleRemove = () => {
    // Remove selected items from "Selected Sites"
    // console.log({msg:'Handle Add',checkedList})
    // return "";
    // const removeCheckTMP = removeCheck; 
    if(removeCheck.length===0){
      return "";
    }
    const allList = cachedSites;
    const allSelected = selectedList;
    const RemoveListIds = removeCheck;
    const NewAllList = [];

    const newSelected =[];// allSelected.filter(item =>(!RemoveListIds.includes(item.account_site_info_id)));

    for (let i2 = 0; i2 < allSelected.length; i2++) {
      const element = allSelected[i2];
      if(!RemoveListIds.includes(element.account_site_info_id.toString())){
        newSelected.push(element);
      }
    }
    setSelectedList(newSelected);
    for (let i11 = 0; i11 < allList.length; i11++) {
      const element = allList[i11];
      const checkFindINNewSelected = newSelected.find(item => parseInt(item.account_site_info_id) === parseInt(element.account_site_info_id));  
      if(!checkFindINNewSelected){
        NewAllList.push(element);
      }
    }
    setSitesList(NewAllList);

    

    // const updatedSelectedList = selectedList.filter(item =>
    //   !removeCheck.includes(item.account_site_info_id.toString())
    // );
    // const unselectedItems = selectedList.filter(item =>
    //   !removeCheck.includes(item.account_site_info_id.toString())
    // );
    // setSelectedList(updatedSelectedList);
    // setCheckedList([]); // Clear the checkedList after removing

    // // Restore the unselected items to "Sites" (if needed)
    // // const updatedSitesList = cachedSites.map(item => {
    // //   if (unselectedItems.find(selectedItem => parseInt(selectedItem.account_site_info_id) === parseInt(item.account_site_info_id))) {
    // //     return { ...item, is_selected: false };
    // //   }
    // //   return item;
    // // });
    // const updatedSitesList = [];
    // for (let i1 = 0; i1 < cachedSites.length; i1++) {
    //   const element = cachedSites[i1];
    //   if(removeCheck.includes(element.account_site_info_id.toString())){
    //     updatedSitesList.push(element);
    //   }
    // }

    // setSitesList(updatedSitesList);
    setRemoveCheck([]); // Clear the removeCheck after removing
  }
const handleSubmit = async ()=>{
  // selectedList
  const uniqueArray = selectedList.filter((obj, index, self) =>
  index === self.findIndex((o) => parseInt(o.account_site_info_id) === parseInt(obj.account_site_info_id))
); 
  setSelectedSites(uniqueArray)
  if(is_edit){
    setEditSites(uniqueArray)
  }
  handleClose();
}
useEffect(()=>{
  if(selectedSites){
    setSelectedList(selectedSites)
  }
},[selectedSites])
  return (
    <Modal
      show={addSitesModal}
      onHide={handleClose}
      dialogClassName="modal-120w"
      aria-labelledby="example-custom-modal-styling-title"
      size="lg"
      id="states-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Sites Selection</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-container">
          <div className="my-modal-section">
            {loading ? <div >
            Loading...
            </div> : 
            <div className="upper-div">
              <div className="products" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <ul>
                  <li className="title">Sites</li>
                  {sitesList.map((item) => (
                      <li key={item.account_site_info_id} className="" style={{ backgroundColor: "#D9D9D9" }}>
                        <label htmlFor={item.account_site_info_id}>
                          <input
                            type="checkbox"
                            id={item.account_site_info_id}
                            value={item.account_site_info_id}
                            onChange={(e) => handleCheckClick(e)}
                            checked={checkedList.includes(item.account_site_info_id.toString())}
                          />
                          {item.account_site_name}
                        </label>
                      </li>
                  ))}
                </ul>
              </div>
              <div className="btns">
                <button className="select-btn" onClick={handleAdd}>+</button>
                <button className="elemenate-btn" onClick={handleRemove}>-</button>
              </div>
              <div className="selected-products">
                <ul>
                  <li className='title'>Selected Sites</li>
                  {selectedList.map((item, index) => (
                    <div key={index}>
                       <li key={item.account_site_info_id} className="">
                          <label htmlFor={'set_insert_id_' + item.account_site_info_id}>
                            <input
                              type="checkbox"
                              id={'set_insert_id_' + item.account_site_info_id}
                              value={item.account_site_info_id}
                              checked={removeCheck.includes(item.account_site_info_id.toString())}
                              onChange={(e) => handleRemoveCheckClick(e)}
                            />
                            {item.account_site_name}
                          </label>
                        </li>
                    </div>
                  ))}
                </ul>
              </div>
            </div>}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="Cancel-btn" onClick={handleClose}>
          Cancel
        </button>
        <button className="submit-btn" type="button" onClick={handleSubmit}>
          Submit
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddSitesmodal;
