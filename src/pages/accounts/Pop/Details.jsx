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
import { FormatDate, RenderWithOutZero } from "../../../helper/Common";
import moment from "moment";
import { FetchAccountDetails } from "../../../helper/BasicFn";
import Loading from "../Loading";
import Documents from "../tabs/Documents";
import { setPopActiveTab } from "../../../redux/slices/TabSlice";


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
const Details = () => {
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

  return (
    <>
      {loading ? (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      ) : (<>
        <div className="mt-4" style={{ width: "100%", paddingInline: "5px" }}>

          {/* <SubHeadingOther title={accountDetails?.account_name} hideNew={true} hideHierarchy={true} hideInstructor={true} subHeading={true} bottomLinks={false} />

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
          </div> */}

          {/* tabs */}
          {/* <Box className="bg-primary my-3 ">
            <div className="d-flex border-bottom border-secondary">
              {Object.values(AccountPopTab).map((tabItem, i) => (
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
              ))}
            </div>
          </Box> */}


          {/* { currentTab === AccountPopTab.Details && (
							<>
								<PopDetails accountDetails={ accountDetails }
                //  CoordiDataList={ CoordiDataList } 
                //  programDetails={ programDetails }
                //   httpsWeb={ httpsWeb } 
                  />
							</>
						) } */}
             {/* {console.log({currentTab})}
            { currentTab === AccountPopTab.Documents &&
                <Documents 
                 accountId={accountId}
                //  contact_id={data[0].contact_id}
                 type={"Documents"}
                  />
							} */}

                    {/* { currentTab === AccountPopTab.Notes && (
							<>
								<PopDetails accountId={accountId}   type="ACCOUNT"  />
							</>
						) } */}


          <div className="text-left  pt-3 pb-1">
            <Box className="text-left pt-1 pb-1">
              <h4 className='heading'>Period of Performance Information</h4>
            </Box>


            <table className='theme-table' >
              <thead>
                <tr>
                  <td>Contract Type</td>
                  <td>Contract #</td>
                  <td>Req #</td>
                  <td>Order #</td>
                  <td>Modification #</td>
                  <td>Option Years</td>
                </tr>
              </thead>
              <tbody>
                <tr >
                  <td>{popDetails.contract_type}</td>
                  <td>{popDetails.contract}</td>
                  <td>{popDetails.req}</td>
                  <td>{popDetails.order}</td>
                  <td>{popDetails.modification}</td>
                  <td>{popDetails.of_year === 0 ? "" : popDetails.of_year}</td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <td>Contract Start</td>
                  <td>Contract Year</td>
                  <td>Yearly Value</td>
                  <td>Total</td>
                  <td>Spending Cap</td>
                  <td>Shipping</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{moment(popDetails.contract_start).format("MM/DD/YYYY")}</td>
                  <td>{popDetails.contract_year}</td>
                  <td> <span>$</span>{popDetails.yearly_value == 0 ? "" : Number(popDetails.yearly_value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                  <td> <span>$</span>{popDetails.total == 0 ? "" : Number(popDetails.total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                  <td><span>$</span>{popDetails.spending_cap == 0 ? "" : Number(popDetails.spending_cap).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                  <td>{popDetails.shipping}</td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <td colSpan="2">Pop Type</td>
                  <td colSpan="1">QB Invoice #</td>
                  <td colSpan="2">Invoice Paid</td>
                  <td colSpan="2">Invoicing Instructions</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="2">{popDetails.pop_type}</td>
                  <td colSpan="1">{popDetails.qb_invoice}</td>
                  <td colSpan="2">{invoicePaid}</td>
                  <td colSpan="2">{popDetails.invoicing_instructions}</td>
                </tr>
              </tbody>
            </table>
          </div>


          {planType === "Equipment" && (
            <>
              <div className="text-left  pt-3 pb-1">

                <Box className="text-left pt-1 pb-1">
                  <h4 className='heading'>Program Management Plan Information</h4>
                </Box>

                <table className='theme-table'>
                  <thead>
                    <tr>
                      <td colSpan="1">Type</td>
                      <td colSpan="1">Activated</td>
                      <td colSpan="1">Rental</td>
                      <td colSpan="1">Visits</td>
                      <td colSpan="1">Medical Direction</td>
                      <td colSpan="1">RMS</td>
                      <td colSpan="1">Accessories Included</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="1">{planDetails.plan_name}</td>
                      <td colSpan="1">{FormatDate(popDetails?.activated_plan_date)}</td>
                      <td colSpan="1">
                        <div className="row">
                          {planDetails.rental === 0 ? (
                            <img className="col" style={{ maxWidth: "20%", height: "20px" }} src={Cancel} />
                          ) : (
                            <img className="col" style={{ height: "25px", maxWidth: "20%" }} src={Check} />
                          )} <h1 className="col" style={{ fontSize: "15px", marginTop: "0px", fontWeight: "400" }}>{planDetails.rental_duration}</h1>
                        </div></td>
                      <td colSpan="1">
                        <>
                          {planDetails.visits === '0' || planDetails.visits === null ? (
                            <img className="col" style={{ maxWidth: "20%", height: "20px" }} src={Cancel} />
                          ) : (
                            <img className="col" style={{ maxWidth: "20%", height: "25px" }} src={Check} />
                          )}
                          <span>{planDetails.visits}</span>
                        </>
                      </td>
                      <td colSpan="1">
                        <>
                          {planDetails.visits === '0' || planDetails.visits === null ? (
                            <img className="col" style={{ maxWidth: "20%", height: "20px" }} src={Cancel} />
                          ) : (
                            <img className="col" style={{ maxWidth: "20%", height: "25px" }} src={Check} />
                          )}
                          <span>{planDetails.visits}</span>
                        </>
                      </td>
                      <td colSpan="1">
                        {planDetails?.rms_billable === 1 ? (
                          <img className="col" style={{ marginLeft: "0px", maxWidth: "40px", height: "20px" }} src={MoneyBag} />
                        ) : ""
                        }
                        {planDetails.rms === 0 ? (
                          <img className="col" style={{ maxWidth: "20%", height: "20px" }} src={Cancel} />
                        ) : (
                          <img className="col" style={{ maxWidth: "20%", height: "25px" }} src={Check} />
                        )}
                      </td>
                      <td colSpan="1">
                        {planDetails.accessory_billable === 1 ? (
                          <img className="col" style={{ marginRight: "4px", maxWidth: "40px", height: "25px" }} src={MoneyBag} />
                        ) : null
                        }
                        {planDetails.battery === 1 ? (
                          <img src={Battery} alt="" style={{ marginRight: "4px" }} />
                        ) : null
                        }
                        {planDetails.spare_battery === 1 ? (
                          <img src={Battery} alt="" style={{ marginRight: "4px" }} />
                        ) : null
                        }
                        {planDetails.adult_pad === 1 ? (
                          <img src={Adult} alt="" style={{ marginRight: "4px" }} />
                        ) : null
                        }
                        {planDetails.spare_adult === 1 ? (
                          <img src={Adult} alt="" style={{ marginRight: "4px" }} />
                        ) : null
                        }
                        {planDetails.aed_cabinet_9v === 1 ? (
                          <img src={AEDCabinet} alt="" style={{ marginRight: "4px" }} />
                        ) : null
                        }
                        {planDetails.rms_battery === 1 ? (
                          <img src={RMSBattery} alt="RMS Battery" />
                        ) : null
                        }
                        {planDetails.pediatric_pad === 1 ? (
                          <img src={pediatricPad} alt="pediatric pad" style={{ height: "26px" }} />
                        ) : null
                        }
                        {planDetails.pediatric_spare_pad === 1 ? (
                          <img src={pediatricPad} alt="pediatric spare pad" style={{ height: "26px" }} />
                        ) : null
                        }
                      </td>
                    </tr>
                  </tbody>
                  <thead>
                    <tr>
                      <td colSpan="1">CLINS</td>
                      <td colSpan="1">Qty</td>
                      <td colSpan="2">RMS Monthly Price</td>
                      <td colSpan="2">Plan Monthly Price</td>
                      <td colSpan="2">Yearly Cost</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr >
                      <td colSpan="1">{RenderWithOutZero(popDetails.purchased_products_clins)}</td>
                      <td colSpan="1">{popDetails?.purchased_products_qty}</td>
                      <td colSpan="2"><span>$</span>{popDetails?.purchased_products_rms_yearly_cost == 0 ? "" : Number(popDetails.purchased_products_rms_yearly_cost).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                      <td colSpan="2"><span>$</span>{popDetails?.purchased_products_price == 0 ? "" : Number(popDetails.purchased_products_price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} </td>
                      <td colSpan="2"><span>$</span>{popDetails.purchased_products_yearly_cost ? Number(popDetails.purchased_products_yearly_cost).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ""}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="text-left pt-3 pb-3">
                <Box className="text-left pt-1 pb-1">
                  <h4 className='heading'>Purchased Equipment</h4>
                </Box>

                <table className='theme-table'>
                  <thead>
                    <tr>
                      <td>CLINS</td>
                      <td>Equipment</td>
                      <td>Part #</td>
                      <td>Purchase Type</td>
                      <td>Condition</td>
                      <td>Qty</td>
                      <td>Price</td>
                      <td>Total Price</td>
                    </tr>
                  </thead>
                  {purchaseEquipment?.length === 0 ? (
                    <tbody>
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center" }} >No data available</td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>

                      {purchaseEquipment?.map((purchaseEquipment) => (<>
                        <tr key={purchaseEquipment?.equipment_id}>
                          <td  >{RenderWithOutZero(purchaseEquipment?.equipment?.clins)}</td>
                          <td>
                            <p className="m-0"> {purchaseEquipment?.equipment?.equipment_type ? "AEDs" : ""}</p>
                            <p className="m-0"> {purchaseEquipment?.equipment.battery_part ? "Device Included Battery" : ""} </p>
                            <p className="m-0"> {purchaseEquipment?.equipment.battery_spare_toggle ? "Spare Battery" : ""} </p>
                            <p className="m-0"> {purchaseEquipment?.equipment.adult_pad ? "Device Included Adult Pad/Pak" : ""} </p>
                            <p className="m-0"> {purchaseEquipment?.equipment.adult_spare_toggle ? "Spare Adult Pad/Pak" : ""} </p>
                            <p className="m-0"> {purchaseEquipment?.equipment.ped_pad ? "Pediatric Pad" : ""} </p>
                            <p className="m-0"> {purchaseEquipment?.equipment.spare_ped_pad ? " Spare Pediatric Pad" : ""} </p>
                            <p className="m-0"> {purchaseEquipment?.equipment.ready_kit_part ? "Ready Kit" : ""} </p>
                            <p className="m-0">{purchaseEquipment?.equipment.storage_brand ? "Storage" : ""} </p>
                            <p className="m-0"> {purchaseEquipment?.equipment.wall_sign_part ? "Wall Sign" : ""} </p>
                          </td>
                          <td>
                            {purchaseEquipment?.equipment?.part ? <p className="m-0"> {purchaseEquipment?.equipment?.part} </p> : ""}
                            {purchaseEquipment?.equipment?.battery_part ? <p className="m-0">{purchaseEquipment?.equipment?.battery_part}</p> : ""}
                            {purchaseEquipment?.equipment?.battery_spare_toggle ? <p className="m-0">{purchaseEquipment?.equipment?.spare_battery_part}</p> : ""}
                            {purchaseEquipment?.equipment?.adult_pad ? <p className="m-0">{purchaseEquipment?.equipment?.adult_pad}</p> : ""}
                            {purchaseEquipment?.equipment?.adult_spare_toggle ? <p className="m-0">{purchaseEquipment?.equipment?.spare_adult_pad}</p> : ""}
                            {purchaseEquipment?.equipment?.ped_pad ? <p className="m-0">{purchaseEquipment?.equipment?.ped_pad}</p> : ""}
                            {purchaseEquipment?.equipment?.spare_ped_pad ? <p className="m-0">{purchaseEquipment?.equipment?.spare_ped_pad}</p> : ""}
                            {purchaseEquipment?.equipment?.ready_kit_part ? <p className="m-0">{purchaseEquipment?.equipment?.ready_kit_part}</p> : ""}
                            {purchaseEquipment?.equipment?.storage_part ? <p className="m-0" >{purchaseEquipment?.equipment?.storage_part}</p> : ""}
                            {purchaseEquipment?.equipment?.wall_sign_part ? <p className="m-0">{purchaseEquipment?.equipment?.wall_sign_part}</p> : ""}
                          </td>
                          <td>{purchaseEquipment?.equipment?.purchase_type}</td>
                          <td>{purchaseEquipment?.equipment?.condition}</td>
                          <td>{purchaseEquipment?.equipment?.quantity}</td>
                          <td><span>$</span>{purchaseEquipment?.equipment?.price ? Number(purchaseEquipment.equipment.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ""}</td>
                          <td><span>$</span>{equipmentTPrice ? Number(equipmentTPrice).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ""}</td>
                        </tr>
                      </>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>

              <div className="text-left pt-3 pb-3">
                <Box className="text-left pt-1 pb-1">
                  <h4 className='heading'>Purchased Accessories</h4>
                </Box>

                <table className='theme-table'>
                  <thead>
                    <tr>
                      <td>CLINS</td>
                      <td>Accessory</td>
                      <td>Part #</td>
                      <td>Condition</td>
                      <td>Qty</td>
                      <td>Price</td>
                      <td>Total Price</td>
                    </tr>
                  </thead>
                  {accessories.length === 0 ? (
                    <tbody>
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>No data available</td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      {accessories.map((accessory) => (
                        <tr key={accessory?.accessories_id}>
                          <td>{RenderWithOutZero(accessory?.accessories?.clins) || " "}</td>
                          <td>{accessory?.accessories?.accessories_type || " "}</td>
                          <td>{accessory?.accessories?.part || ""}</td>
                          <td>{accessory?.accessories?.condition || ""}</td>
                          <td>{accessory?.accessories?.quantity || ""}</td>
                          <td><span>$</span>{accessory?.accessories?.price ? Number(accessory.accessories.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ""}</td>
                          <td><span>$</span>{accessoryTPrice ? Number(accessoryTPrice).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>


              <div className="text-left  pt-3 pb-1">
                <Box className="text-left pt-1 pb-1">
                  <h4 className='heading'>Equipment Contract Pricing</h4>
                </Box>

                <table className='theme-table'>
                  <thead>
                    <tr>
                      <td>CLINS</td>
                      <td>Equipment</td>
                      <td>Part #</td>
                      <td>Purchase Type</td>
                      <td>Price</td>
                      <td>Condition</td>
                    </tr>
                  </thead>
                  {contractEquipment?.length === 0 ? (
                    <tbody>
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }} >No data available</td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      {contractEquipment?.map((contractEquipment) => (
                        <tr key={contractEquipment?.equipment_id}>
                          <td>{RenderWithOutZero(contractEquipment?.equipment?.clins)}</td>
                          <td>
                            <p className="m-0"> {contractEquipment?.equipment?.equipment_type ? "AEDs" : ""}</p>
                            <p className="m-0"> {contractEquipment?.equipment.battery_part ? "Device Included Battery" : ""} </p>
                            <p className="m-0"> {contractEquipment?.equipment.battery_spare_toggle ? "Spare Battery" : ""} </p>
                            <p className="m-0"> {contractEquipment?.equipment.adult_pad ? "Device Included Adult Pad/Pak" : ""} </p>
                            <p className="m-0"> {contractEquipment?.equipment.adult_spare_toggle ? "Spare Adult Pad/Pak" : ""} </p>
                            <p className="m-0"> {contractEquipment?.equipment.ped_pad ? "Pediatric Pad" : ""} </p>
                            <p className="m-0"> {contractEquipment?.equipment.spare_ped_pad ? " Spare Pediatric Pad" : ""} </p>
                            <p className="m-0"> {contractEquipment?.equipment.ready_kit_part ? "Ready Kit" : ""} </p>
                            <p className="m-0">{contractEquipment?.equipment.storage_brand ? "Storage" : ""} </p>
                            <p className="m-0"> {contractEquipment?.equipment.wall_sign_part ? "Wall Sign" : ""} </p>
                          </td>
                          <td>
                            {contractEquipment?.equipment?.part ? <p className="m-0"> {contractEquipment?.equipment?.part} </p> : ""}
                            {contractEquipment?.equipment?.battery_part ? <p className="m-0">{contractEquipment?.equipment?.battery_part}</p> : ""}
                            {contractEquipment?.equipment?.battery_spare_toggle ? <p className="m-0">{contractEquipment?.equipment?.spare_battery_part}</p> : ""}
                            {contractEquipment?.equipment?.adult_pad ? <p className="m-0">{contractEquipment?.equipment?.adult_pad}</p> : ""}
                            {contractEquipment?.equipment?.adult_spare_toggle ? <p className="m-0">{contractEquipment?.equipment?.spare_adult_pad}</p> : ""}
                            {contractEquipment?.equipment?.ped_pad ? <p className="m-0">{contractEquipment?.equipment?.ped_pad}</p> : ""}
                            {contractEquipment?.equipment?.spare_ped_pad ? <p className="m-0">{contractEquipment?.equipment?.spare_ped_pad}</p> : ""}
                            {contractEquipment?.equipment?.ready_kit_part ? <p className="m-0">{contractEquipment?.equipment?.ready_kit_part}</p> : ""}
                            {contractEquipment?.equipment?.storage_part ? <p className="m-0" >{contractEquipment?.equipment?.storage_part}</p> : ""}
                            {contractEquipment?.equipment?.wall_sign_part ? <p className="m-0">{contractEquipment?.equipment?.wall_sign_part}</p> : ""}
                          </td>
                          <td>{contractEquipment?.equipment?.purchase_type}</td>
                          <td><span>$</span>{Number(contractEquipment?.equipment?.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                          <td>{contractEquipment?.equipment?.condition}</td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>

              <div className="text-left pt-3 pb-1">
                <Box className="text-left pt-1 pb-1">
                  <h4 className='heading'>Accessories Contract Pricing</h4>
                </Box>

                <table className='theme-table'>
                  <thead>
                    <tr>
                      <td>CLINS</td>
                      <td>Accessory</td>
                      <td>Part #</td>
                      <td>Price</td>
                      <td>Condition</td>
                    </tr>
                  </thead>
                  {contractAccessories?.length === 0 ? (
                    <tbody>
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }} >No data available</td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      {contractAccessories?.map((contractAccessories) => (
                        <tr key={contractAccessories?.accessories_id}>
                          <td>{RenderWithOutZero(contractAccessories?.accessories.clins)}</td>
                          <td>{contractAccessories?.accessories.accessories_type}</td>
                          <td>{contractAccessories?.accessories.part}</td>
                          <td><span>$</span>{Number(contractAccessories?.accessories.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                          <td>{contractAccessories?.accessories.condition}</td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>


            </>
          )}







          {planType === "Training" && (
            <div className="text-left  pt-3 pb-1">
              <Box className="text-left pt-1 pb-1">
                <h4 className='heading'>Course Contract Pricing</h4>
              </Box>


              <table className='theme-table' >
                <thead>
                  <tr>
                    <td>CLINs</td>
                    <td>Certifying Agency</td>
                    <td>Allowed Classes</td>
                    <td>Covered Sites</td>
                    <td>Class Price</td>
                    <td>Price Per Student</td>
                    <td>Min / Max Enrollment</td>
                  </tr>
                </thead>
                {contractCourse.length === 0 ? (
                  <tbody>
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }} >No data available</td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {contractCourse.map((contract) => (
                      <tr key={contract?.courseData.id}>
                        <td>{RenderWithOutZero(contract?.courseData?.clin)}</td>
                        <td>{contract?.certAgency}</td> {/* Access the certifying_agency from courseData */}
                        <td>{contract?.allowed_class}</td> {/* Access the allowed_class from courseData */}
                        <td>{contract?.siteNames.map(site => site.account_site_name).join(', ')}</td>
                        <td><span>$</span>{parseInt(contract?.courseData.class_price) ? Number(contract.courseData.class_price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ""}</td>
                        <td><span>$</span>{parseInt(contract?.courseData.price_per_student) ? Number(contract.courseData.price_per_student).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ""}</td>
                        <td>{`${contract?.courseData.min ? contract?.courseData.min : ""} / ${contract?.courseData.max ? contract?.courseData.max : ""}`}</td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          )}

          <div className="row pt-3 pb-5">
            <div className="col" style={{ maxWidth: "700px" }}>
              <Box className="text-left pt-1 pb-1">
                <h4 className='heading'>Contract Contacts</h4>
              </Box>


              <table className='theme-table' >
                <thead>
                  <tr>
                    <td>Contract officer</td>
                    <td>Contract officer Rep</td>
                    <td>Other Contacts</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><PrintContact accountId={accountId} data={contractOfficer || []} /></td>
                    <td><PrintContact accountId={accountId} data={contractOfficerRep || []} /></td>
                    <td><PrintContact accountId={accountId} data={otherReps || []} /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col" style={{ maxWidth: "750px" }}>
              <Box className="text-left pt-1 pb-1">
                <h4 className='heading'>Sites</h4>
              </Box>

              <table className='theme-table' >
                <tbody style={{ height: "60px", maxWidth: "750px" }}>
                  {sitesDetails.map((site, index) => (
                    <tr key={index}>
                      <td>{site?.account_site_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
      )}
    </>
  )
}

export default Details;