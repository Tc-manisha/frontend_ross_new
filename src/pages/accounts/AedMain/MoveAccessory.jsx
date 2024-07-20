import { useState } from "react";
import React, { useEffect } from "react";
import "../../styles/MoveAed.scss";
import { useNavigate, useParams } from "react-router-dom";
import { GetAccountList } from "../../../helper/BasicFn";
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import { toast } from "react-toastify";
import BackButton from "../../../components/shared/BackButton";
import { EditIcon } from "../../../helper/Icons";
import MoveAccessoryTr from "./tabs/MoveAccessoryTr";
import uuid4 from "uuid4";
import { useLocation } from "react-router-dom";

function MoveAccessory() {
  const params = useParams();
  const { accountId, siteId } = params;
  const navigate = useNavigate();

  console.log('location: ', location)

  const [selectedAcc, setSelectedAcc] = useState(accountId);
  const [selectedSite, setSelectedSite] = useState("");

  const [accountList, setAccountList] = useState([]);
  const [AedList, setAedList] = useState([]);
  const [AedSiteList, setAedSiteList] = useState([]);
  const [btnLoad, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [AccountName, setAccountName] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [accList, setAccList] = useState([])
  const [siteName, setSiteName] = useState('')

  const onLoad = async () => {
    setLoading(true);

    let response = await CallGETAPI(`account/get-acc-by-site/${accountId}/${siteId}`);
    setSiteName(response?.data?.data?.siteName)
    const AccData = response?.data?.data?.accBattries.concat(response?.data?.data?.accPads) || []
    setAccList(AccData)

    const accountDataRes = await GetAccountList();
    const accountData = accountDataRes?.data?.data?.account || [];
    const selectedAcc = accountData.find(
      (item) => item.account_id == accountId
    );

    setAccountList(accountData);
    const AedDatares = await CallGETAPI("account/get-aed-by-site/" + siteId);
    const AedData = AedDatares?.data?.data || [];
    setAedList(AedData);

    setAccountName(selectedAcc?.account_name || "");

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

  // const SelectAll = (e) => {
  //   const checked = e.target.checked;
  //   if (checked) {
  //     const arr = AedSiteData.map((item) => item.aed_id);
  //     setSelectedIds(arr);
  //   } else {
  //     setSelectedIds([]);
  //   }
  // };

  const handleQtyChange = (e, item, index) => {
    let newValue = parseInt(e.target.value);
    let maxAllowed = item?.quantity;
    if (newValue > maxAllowed) {
      toast.error("Move quantity can't be greater than quantity.")
    } else {
      let Fd = [...accList]
      Fd[index].moveQty = e.target.value
      setAccList(Fd)
    }
  }

  let selectedRow = [];
  const selectedRowFunc = () => {
    for (let index = 0; index < accList.length; index++) {
      const element = accList[index];
      if (element.hasOwnProperty('moveQty') && element.moveQty !== undefined && element.moveQty !== null && element.moveQty > 0) {
        selectedRow.push(element);
      }
    }
  };

  const handleMove = async () => {

    selectedRowFunc()

    if (!selectedAcc) {
      toast.error("Please Select  Account");
      return;
    }

    if (!selectedSite) {
      toast.error("Please Select  Site");
      return;
    }

    if (selectedRow.length <= 0) {
      toast.error("Please enter Quantity for min 1 accessory");
    }
    else {
      const sendData = {
        current_account_id: accountId,
        account_id: selectedAcc,
        site_id: selectedSite,
        row: selectedRow,
        // selected_battery_type: selectedBatteryType,
        // selected_pad_type: selectedPadType,
      };

      // console.log('sendData: ', sendData)

      setBtnLoading(true);
      const res = await CallPOSTAPI("account/move-acc", sendData);
      setBtnLoading(false);
      if (res.data.status) {
        toast.success(res.data.msg);
        onLoad();
        onChangeAccount(selectedAcc);
      } else {
        toast.error("Something went Wrong Please Try Again");
      }
    }
  };


  return (
    <>
      <div
        className="mt-4"
        style={{ width: "100%", paddingInline: "45px", marginBottom: '3%' }}
        id="move-aed-section"
      >
        <BackButton />
        <h2 className="section-title">Move Accessory</h2>
        <div className="move-aed">
          <div className="row">
            <div className="col-12 text-center">
              <h5 className="site-name">
                {/* {AccountName} : {siteName ? siteName : ""} */}
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
                  <tr style={{ background: '#999999' }}>
                    <th style={{ background: 'transparent', width: 100 }}>Move Quantity</th>
                    <th style={{ background: 'transparent' }}>Accessory Type</th>
                    <th style={{ background: 'transparent' }}>Part #</th>
                    <th style={{ background: 'transparent' }}>Date</th>
                    <th style={{ background: 'transparent' }}>Lot</th>
                    <th style={{ background: 'transparent' }} >UDI</th>
                    <th style={{ background: 'transparent' }}>Qty</th>
                    <th style={{ background: 'transparent' }}>Dni</th>
                  </tr>
                </thead>
                <tbody>
                  {accList.length === 0 ? (
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

                  {accList.map((item, index) => (
                    <MoveAccessoryTr
                      item={item}
                      index={index}
                      handleQtyChange={handleQtyChange}
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
                    {AedSiteList.map((item, index) => (
                      <option
                        value={item?.account_site_info_id}
                        key={index}
                        selected={
                          parseInt(selectedSite) === item?.account_site_info_id
                        }
                      >
                        {item?.account_site_name}
                      </option>
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

export default MoveAccessory;
