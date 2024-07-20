import React, { useEffect, useState } from "react";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import { Box } from "@mui/material";
import { AccountPopTab } from "../../../utils";
import New from "../../../img/New.png";
import Edit from "../../../img/Edit.png";
import Clone from "../../../img/Clone.svg";
import { CallGETAPI } from "../../../helper/API";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AEDCabinet from "../../../img/AEDCabinet.svg";
import Adult from "../../../img/Adult.svg";
import Battery from "../../../img/Battery.svg";
import RMSBattery from "../../../img/RMSBattery.svg";
import pediatricPad from "../../../img/pediatricPad.svg";
import Cancel from "../../../img/Cancel.svg";
import Check from "../../../img/Check.svg";
import Equipment from "../../../img/Equipment.svg";
import Accessories from "../../../img/Accessories.svg";
import MoneyBag from "../../../img/MoneyBag.svg";
import { useDispatch } from "react-redux";
import { FormatDate, RenderWithOutZero, getPermission } from "../../../helper/Common";
import moment from "moment";
import { DecryptToken, FetchAccountDetails } from "../../../helper/BasicFn";
import Loading from "../Loading";
import { setPopActiveTab } from "../../../redux/slices/TabSlice";
import Details from "./Details";
import Documents from "./tabs/Documents";
import Notes from "./tabs/Notes";


const PrintContact = ({ data, accountId }) => {
  if (!Array.isArray(data)) {
    return "";
  }

  console.log({data})

  return (
    <ul className="list-unstyled">
      {data?.map((it, i) => (
        <li className="my-1" key={i} ><Link to={`/account/${accountId}/contact-details/${it?.contact_id}`} >{it?.contact_name}</Link></li>
      ))}
    </ul>
  )
}
const PopDetails = () => {
  const { pop_id, accountId } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(AccountPopTab.Details);
  const [popDetails, setPopDetails] = useState("");
  const [planDetails, setPlanDetails] = useState("");
  const [sitesDetails, setSitesDetails] = useState([]);
  const [accessories, setAccessories] = useState([])
  const [purchaseEquipment, setPurchaseEquipment] = useState([])
  const [contractEquipment, setContractEquipment] = useState([])
  const [contractAccessories, setContractAccessories] = useState([])
  const [contractCourse, setContractCourse] = useState([])
  const [contractOfficer, setContractOfficer] = useState("")
  const [contractOfficerRep, setContractOfficerRep] = useState("")
  const [otherReps, setOtherReps] = useState("")
  const [invoicePaid, setInvoicePaid] = useState("");
  const [activated, setActivated] = useState("");
  const [planType, setPlanType] = useState('');
  const [accessoryPrice, setAccessoryPrice] = useState("");
  const [accessoryQuantity, setAccessoryQuantity] = useState("");
  const [equipmentPrice, setequipmentPrice] = useState("");
  const [equipmentQuantity, setequipmentQuantity] = useState("");
  const [loading, setLoading] = useState(true);
  const user = DecryptToken();
  const privilege = getPermission();
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    // Fetch data and update invoicePaid
    const fetchInvoicePaid = async () => {
      try {
        const response = await CallGETAPI(`account/pop-details/${pop_id}`);
        const data = response?.data?.data || [];
        if (data.popDetails) {
          const invoicePaidDate = data.popDetails.invoice_paid_date;
          const activatedDate = popDetails.activated_plan_date;
          if (invoicePaidDate) {
            const date = new Date(invoicePaidDate);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            const formattedDate = `${month}/${day}/${year}`;
            setInvoicePaid(formattedDate); // Update invoicePaid
          }
          if (activatedDate) {
            const activateDate = new Date(activatedDate);
            const activateMonth = String(activateDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to month since January is 0
            const activateDay = String(activateDate.getDate()).padStart(2, '0');
            const activateYear = activateDate.getFullYear();
            const formattedDate1 = `${activateMonth}/${activateDay}/${activateYear}`;
            setActivated(formattedDate1);
          }
        }
      } catch (error) {
        console.error("Error fetching invoicePaid:", error);
      }
    };

    fetchInvoicePaid(); // Fetch and update invoicePaid
  }, [pop_id]);
  const [accountDetails, setAccountDetails] = useState({})
  const fetchOnLoad = async () => {
    const response = await CallGETAPI(`account/pop-details/${pop_id}`);
    // const response = await CallGETAPI(`account/pop-details/${24}`);    16/24
    const data = response?.data?.data || [];
    if (accountId) {
      const AccDetails = await FetchAccountDetails(accountId);
      setAccountDetails(AccDetails)
    }

    if (data.popDetails) {
      const contactData = JSON.parse(data.popDetails.contact);
      const contractOfficer = contactData.contract_officer;
      // planType,setPlanType

      setPlanType(data?.popDetails?.pop_type)
      const contractOfficerRep = contactData.contracting_officer_rep;
      const otherReps = contactData.other_reps;
      setContractOfficer(contractOfficer);
      setContractOfficerRep(contractOfficerRep);
      setOtherReps(otherReps);
    }

    if (data.popDetails) {
      const PopDetails = data.popDetails;
      setPopDetails(PopDetails);
    }

    if (data.planDetails) {
      const planDetails = data.planDetails;
      setPlanDetails(planDetails);
    }

    if (data.siteNames) {
      const sitesDetails = data.siteNames;
      setSitesDetails(sitesDetails);
    }

    if (data.purchase_accessories) {
      // Assuming 'purchase_accessories' is an array
      const accessoriesArray = data.purchase_accessories;
      setAccessories(accessoriesArray);
    }
    if (data.purchase_equipment) {
      const PurchaseEquipmentArray = data.purchase_equipment;
      setPurchaseEquipment(PurchaseEquipmentArray);
    }
    if (data.contract_equipment) {
      const ContractEquipmentArray = data.contract_equipment;
      setContractEquipment(ContractEquipmentArray);
    }
    if (data.contract_accessories) {
      const ContractAccessoriesArray = data.contract_accessories;
      setContractAccessories(ContractAccessoriesArray);
    }
    if (data.contract_course) {
      const ContractCourseArray = data.contract_course;
      setContractCourse(ContractCourseArray);
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchOnLoad();
  }, [])

  const dispatch = useDispatch();
  const handleTab = (item) => {
    console.log({item})
    dispatch(setPopActiveTab(item));
    setCurrentTab(item);
  };
  const [yearlyCost, setYearlyCost] = useState("");
  const calculateYearlyPrice = (qty, price, rmsPrice) => {
    price = (price) ? price : 0;
    rmsPrice = (rmsPrice) ? rmsPrice : 0;
    qty = (qty) ? qty : 0;

    let TTPrice = parseInt(price) + parseInt(rmsPrice);
    qty = parseInt(qty);
    const yearlycost = qty * TTPrice;
    setYearlyCost(yearlycost);
  }
  useEffect(() => {
    calculateYearlyPrice(popDetails?.purchased_products_qty, popDetails?.purchased_products_price, popDetails?.purchased_products_rms_yearly_cost)
  }, [popDetails?.purchased_products_qty, popDetails?.purchased_products_price, popDetails?.purchased_products_rms_yearly_cost]);

  // Calculate and set the accessory prices in the effect
  useEffect(() => {
    const accessoryPricesvalue = accessories.map((accessory) => accessory.accessories.price);
    const accessoryQuantityvalue = accessories.map((accessory) => accessory.accessories.quantity);
    setAccessoryPrice(accessoryPricesvalue);
    setAccessoryQuantity(accessoryQuantityvalue);
  }, [accessories]);

  const [accessoryTPrice, setAccessoryTPrice] = useState("")
  const accessoryTotalPrice = (qty, price) => {
    qty = (qty) ? qty : 0;
    price = (price) ? price : 0;
    const accessoryCalucalateprice = parseInt(qty) * parseInt(price);
    setAccessoryTPrice(accessoryCalucalateprice);
  }

  useEffect(() => {
    accessoryTotalPrice(accessoryQuantity, accessoryPrice)
  }, [accessoryQuantity, accessoryPrice]);

  // Calculate and set the Equipment prices in the effect
  useEffect(() => {
    const equipmentPricesvalue = purchaseEquipment.map((equipment) => equipment.equipment.price);
    const equipmentQuantityvalue = purchaseEquipment.map((equipment) => equipment.equipment.quantity);
    setequipmentPrice(equipmentPricesvalue);
    setequipmentQuantity(equipmentQuantityvalue);
  }, [purchaseEquipment]);

  const [equipmentTPrice, setequipmentTPrice] = useState("")
  const equipmentTotalPrice = (qty, price) => {
    console.log(qty)
    qty = (qty) ? qty : 0;
    price = (price) ? price : 0;
    const equipmentCalculateprice = parseInt(qty) * parseInt(price);
    setequipmentTPrice(equipmentCalculateprice);
  }

  useEffect(() => {
    equipmentTotalPrice(equipmentQuantity, equipmentPrice)
  }, [equipmentQuantity, equipmentPrice]);

  const handleHoverFloating = () => {
    setIsOpen(true);
  };

  const handleLeaveFloating = () => {
    setIsOpen(false);
  };

  const documentRedirect = () => {
    navigate("/account-document-upload", {
      state: {
        type: "account",
        accountId,
        siteId: "",
      },
    });
  };

  const notesRedirect = () => {
    navigate(`/account/new-note?account_id=${accountId}`);
  };

  return (
    <>
      {loading ? (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      ) : (<>
        <div className="mt-4" style={{ width: "100%", paddingInline: "45px" }}>

          <SubHeadingOther title={accountDetails?.account_name} hideNew={true} hideHierarchy={true} hideInstructor={true} subHeading={true} bottomLinks={false} />

          <div className="d-flex" style={{ gap: "10px" }}>
            <button
              className="btn text-primary"
              type="button"
              onClick={() => navigate('/account/new-pop/' + accountId)}
            >
              <img
                src={New}
                alt="New"
                style={{ marginRight: "5px" }}
              />
              <span className="ms-1">New</span>
            </button>

            {(user?.user_type == 0 || (user?.user_type == 2 && privilege?.includes("pop-edit"))) && (
            <button
              className="btn text-primary"
              type="button"
              onClick={() => navigate(`/account/pop-edit/${pop_id}/${accountId}`)}
            >
              <img
                src={Edit}
                alt="Edit"
                style={{ marginRight: "5px" }}
              />
              <span className="ms-1">Edit</span>
            </button>
            )}

            {(user?.user_type == 0 || (user?.user_type == 2 && privilege?.includes("pop-clone"))) && (
            <button
              className="btn text-primary"
              type="button"
            >
              <img
                src={Clone}
                alt="Clone"
                style={{ marginRight: "5px" }}
              />
              <span className="ms-1">Clone</span>
            </button>
            )}
          </div>

          {/* tabs */}
          <Box className="bg-primary my-3 ">
            <div className="d-flex border-bottom border-secondary">
              {Object.values(AccountPopTab).map((tabItem, i) => (
                (
                  (user?.user_type === 0) ||
                  (tabItem === "Details" && user?.user_type === 2 && privilege?.includes("pop-details")) ||
                  (tabItem === "Documents" && user?.user_type === 2 && privilege?.includes("documents-tab")) ||
                  (tabItem === "Notes" && user?.user_type === 2 && privilege?.includes("notes-tab"))) && (
                  
                <div
                  role="button"
                  key={i}
                  className={"text-light py-2 px-3"}
                  style={{
                    backgroundColor: `${tabItem == currentTab ? "#26AEE0" : "#0C71C3"}`,
                  }}
                  onClick={() => handleTab(tabItem)}
                >
                  {tabItem}
                </div>
                  )
              ))}
            </div>
          </Box>


          { currentTab === AccountPopTab.Details && (
							<>
								<Details accountDetails={ accountDetails }
                //  CoordiDataList={ CoordiDataList } 
                //  programDetails={ programDetails }
                //   httpsWeb={ httpsWeb } 
                  />
							</>
						) }

             {console.log({currentTab})}
            { currentTab === AccountPopTab.Documents &&
                <Documents 
                 accountId={accountId}
                //  contact_id={data[0].contact_id}
                 type={"Documents"}
                  />
							}

            { currentTab === AccountPopTab.Notes && (
							<>
								<Notes accountId={accountId}   type="Notes"  />
							</>
						) }


        </div>
        <div
            className="floating-menu-btn d-flex flex-column gap-2"
            onMouseEnter={handleHoverFloating}
            onMouseLeave={handleLeaveFloating}
          >
            {isOpen && (
              <>
                <img
                  src="/NewDocument.svg"
                  width={60}
                  height={60}
                  style={{
                    padding: "2px",
                    borderRadius: "50%",
                    borderColor: "#0c71c3",
                    borderWidth: "3px",
                    borderStyle: "solid",
                  }}
                  className="pointer bg-white"
                  onClick={documentRedirect}
                  title="New Document"
                />

                <img
                  src="/NewSupport.svg"
                  width={60}
                  height={60}
                  style={{
                    padding: "2px",
                    borderRadius: "50%",
                    borderColor: "#0c71c3",
                    borderWidth: "3px",
                    borderStyle: "solid",
                  }}
                  className="pointer bg-white"
                  // onClick={supportRedirect}
                  title="New Support"
                />

                <img
                  src="/NewNote.svg"
                  width={60}
                  height={60}
                  style={{
                    padding: "2px",
                    borderRadius: "50%",
                    borderColor: "#0c71c3",
                    borderWidth: "3px",
                    borderStyle: "solid",
                  }}
                  className="pointer bg-white"
                  onClick={notesRedirect}
                  title="New Note"
                />
              </>
            )}

            <img
              src="/Plus.svg"
              width={60}
              height={60}
              style={{
                padding: "2px",
                borderRadius: "50%",
                borderColor: "#0c71c3",
                borderWidth: "3px",
                borderStyle: "solid",
              }}
              className="pointer bg-white"
              // onMouseLeave={() => {
              //   setIsOpen((prev) => !prev);
              // }}
              onClick={() => {
                setIsOpen((prev) => !prev);
              }}
            />
          </div>
      </>
      )}
    </>
  )
}

export default PopDetails;