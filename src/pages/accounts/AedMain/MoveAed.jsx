import { useState } from "react";
import React, { useEffect } from "react";
import "../../styles/MoveAed.scss";
import { useNavigate, useParams } from "react-router-dom";
import { GetAccountList } from "../../../helper/BasicFn";
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import { toast } from "react-toastify";
import BackButton from "../../../components/shared/BackButton";
import { EditIcon } from "../../../helper/Icons";
import MoveAedTr from "./tabs/MoveAedTr";
function MoveAed() {
  const params = useParams();
  const { accountId, siteId } = params;
  const navigate = useNavigate();

  const [selectedAcc, setSelectedAcc] = useState(accountId);
  const [selectedSite, setSelectedSite] = useState("");

  const [accountList, setAccountList] = useState([]);
  const [AedList, setAedList] = useState([]);
  const [AedSiteList, setAedSiteList] = useState([]);
  const [AedSiteData, setAedSiteData] = useState([]);
  const [siteName, setSiteName] = useState("");
  const [btnLoad, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [AccountName, setAccountName] = useState("");

  const onLoad = async () => {
    setLoading(true);
    const accountDataRes = await GetAccountList();
    const accountData = accountDataRes?.data?.data?.account || [];
    const selectedAcc = accountData.find(
      (item) => item.account_id == accountId
    );
    console.log({ selectedAcc });
    setAccountList(accountData);
    const AedDatares = await CallGETAPI("account/get-aed-by-site/" + siteId);
    const AedData = AedDatares?.data?.data || [];
    setAedList(AedData);

    const AedSiteDataRes = await CallGETAPI(`account/fetchAedBySite/${accountId}/${siteId}`);
    const AedSiteData2 = AedSiteDataRes?.data?.AEDData || [];

    setSiteName(AedSiteDataRes?.data?.siteName || "");
    setAccountName(selectedAcc?.account_name || "");
    // setAccountName

    setAedSiteData(AedSiteData2);
    setLoading(false);
  };

  const onChangeAccount = async (id, onload = false) => {
    const accSiteListres = await CallGETAPI("account/account-site-list/" + id);
    const accSiteList = accSiteListres?.data?.data?.site_details || [];
    setSelectedAcc(id);
    setAedSiteList(accSiteList);
    if (!onload) {
      setSelectedSite("");
    }
  };

  useEffect(() => {
    onLoad();
    onChangeAccount(accountId, true);
  }, []);
  const [selectedIds, setSelectedIds] = useState([]);
  const SelectAll = (e) => {
    const checked = e.target.checked;
    // selectedIds.length === AedSiteData.length
    if (checked) {
      const arr = AedSiteData.map((item) => item.aed_id);
      setSelectedIds(arr);
    } else {
      setSelectedIds([]);
    }
  };
  const handleCheckboxChange = (id) => {
    // Check if the ID is already in the selectedIds array
    const isSelected = selectedIds.includes(id);

    if (isSelected) {
      // If ID is already in the list, remove it
      const updatedIds = selectedIds.filter((selectedId) => selectedId !== id);
      setSelectedIds(updatedIds);
    } else {
      // If ID is not in the list, add it
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleMove = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please Select AED");
      return;
    }
    // if(selectedAcc === selectedSite){
    //     toast.error('Please Select Different Account');
    //     return;
    // }
    if (!selectedAcc) {
      toast.error("Please Select  Account");
      return;
    }

    if (!selectedSite) {
      toast.error("Please Select  Site");
      return;
    }

    const sendData = {
      account_id: selectedAcc,
      site_id: selectedSite,
      id: selectedIds,
    };
    setBtnLoading(true);
    const res = await CallPOSTAPI("account/move-aed", sendData);
    setBtnLoading(false);
    if (res.data.status) {
      toast.success(res.data.msg);
      onLoad();
      onChangeAccount(selectedAcc);
    } else {
      toast.error("Something went Wrong Please Try Again");
    }
  };

  //     const sendData = {
  //         "account_id":selectedAcc,
  //         "site_id":selectedSite,
  //         "id":selectedIds
  //     };
  //     const res = await CallPOSTAPI('account/move-aed',sendData)
  //     if(res.data.status){
  //         toast.success(res.data.message);
  //         onLoad();
  //         onChangeAccount(selectedAcc)
  //     }else{
  //         toast.success('Something went Wrong Please Try Again');
  //     }
  //   }
  //   const SelectedTB       = AedSiteList.find((item)=>item?.account_site_info_id===parseInt(siteId))
  //   const SetelectsiteName = SelectedTB?.site_name
  return (
    <>
      <div
        className="mt-4"
        style={{ width: "100%", paddingInline: "45px" }}
        id="move-aed-section"
      >
        <BackButton />
        <h2 className="section-title">Move AED</h2>
        <div className="move-aed">
          <div className="row">
            <div className="col-12 text-center">
              <h5 className="site-name">
                {/* {AccountName} : {siteName ? siteName : "Pending"} */}
                {
                  parseInt(siteId) === 0 && AccountName ? `${AccountName} : Pending`
                    :
                    AccountName ? `${AccountName} : ${siteName}` : ''
                }
              </h5>
            </div>
            <div className="col-8">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>
                      <lable htmlFor="all">
                        <input
                          type="checkbox"
                          id="all"
                          onChange={SelectAll}
                          checked={selectedIds.length === AedSiteData.length}
                        />{" "}
                        &nbsp;
                        <span>AED Brand / Model</span>
                      </lable>
                    </th>
                    <th>Serial Number</th>
                    <th>AED Placement</th>
                  </tr>
                </thead>
                <tbody>
                  {AedSiteData.length === 0 ? (
                    <>
                      <tr>
                        <td colSpan={3} className="text-center">
                          <h5>{loading ? "Loading..." : "No Data Found"}</h5>
                        </td>
                      </tr>
                    </>
                  ) : (
                    ""
                  )}

                  {AedSiteData.sort((a, b) =>
                    a.aed_brand_model.localeCompare(b.aed_brand_model)
                  ).map((item, index) => (
                    <MoveAedTr
                      item={item}
                      index={index}
                      handleCheckboxChange={handleCheckboxChange}
                      selectedIds={selectedIds}
                      onLoad={onLoad}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="col-4 border"
              style={{ height: "fit-content", padding: "10px" }}
            >
              <div className="move-aed-header">
                <h5>Move To</h5>
              </div>
              <div className=" mt-4">
                <div className="form-group">
                  <label>Account Name</label>
                  <span className="drop-icom">▼</span>
                  <select
                    className="form-control"
                    onChange={(e) => onChangeAccount(e.target.value)}
                    defaultValue={selectedAcc}
                  >
                    <option value={""} key={0}>
                      --- Select One ---
                    </option>
                    {accountList.map((item, index) => (
                      <option
                        value={item?.account_id}
                        key={index}
                        selected={parseInt(selectedAcc) === item?.account_id}
                      >
                        {item?.account_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Site Name*</label>
                  <span className="drop-icom">▼</span>
                  <select
                    className="form-control"
                    onChange={(e) => setSelectedSite(e.target.value)}
                    defaultValue={selectedSite}
                  >
                    <option value={""} key={0}>
                      --- Select One ---
                    </option>
                    {
                      parseInt(siteId) === 0 ?
                        <option value={0} selected> Pending </option>
                        :
                        ''
                    }
                    {AedSiteList.map((item, index) => (
                      <>
                        <option
                          value={item?.account_site_info_id}
                          key={index}
                          selected={
                            parseInt(selectedSite) === item?.account_site_info_id
                          }
                        >
                          {item?.account_site_name}
                        </option>
                      </>
                    ))}
                  </select>
                </div>

                <div
                  className="form-group d-flex"
                  style={{ justifyContent: "right" }}
                >
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  &nbsp;
                  <button
                    className="btn btn-success"
                    type="button"
                    onClick={handleMove}
                    disabled={btnLoad}
                  >
                    {btnLoad ? "Looading" : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className=""></div>
        </div>
      </div>
    </>
  );
}

export default MoveAed;
