import React, { useEffect, useState } from "react";
import { Alert, Box, Snackbar } from "@mui/material";
import { Button as FixedButton } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CallGETAPI } from "../../helper/API";
import Drawer from "@mui/material/Drawer";

import SubHeading from "../../components/header/SubHeading";
import Filter from "../../components/filter/";
import { createTheme } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import TableSkeleton from "../../pages/accounts/skeleton/table/TableSkeleton";
import EquipmentListTbl from "./EquipmentListTbl";
import { FormatDate, getPermission } from "../../helper/Common";
import Loading from "../../pages/accounts/Loading";

const UserEquipments = ({ setShowSidebar }) => {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = React.useState(true);
  const [accounts, setAccounts] = useState([]);
  const [filteredAccount, setFilterdAccount] = useState([]);
  const [openModel, setOpenModel] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [siteDataList, setsiteDataList] = useState([]);
  const [aedList, setAedList] = useState([]);

  const privileges = getPermission();

     const getAeds = async () => {
        const result = await CallGETAPI("user/account-equipment-list-v2");
        if (result?.data?.status) {
          const aeds = result?.data?.data;
          const resultArr = [];
          for (let a1 = 0; a1 < aeds?.length; a1++) {
            const aed1 = aeds[a1];
            let obj = {
              site_name: aed1?.site_name,
              account_name: aed1?.account_name,
              aed_brand: aed1?.aed_brand,
              serial_number: aed1?.aed_details?.serial_number,
              aed_id: aed1?.aed_details?.aed_id,
              site_id: "",
              data: [],
            };
    
            for (let a2 = 0; a2 < aed1?.data?.length; a2++) {
              const aeds2d = aed1?.data[a2]?.aed_details;
              obj.site_id = aeds2d?.site_id;
              let obj2 = {
                aed_id: aeds2d?.aed_id,
                site_id: aeds2d?.site_id,
                serial_number: aeds2d?.serial_number,
                placement: aeds2d?.placement,
                brand_name: aed1.data[a2]?.aed_brand,
                battery_expiration: [],
                pads_expiration: [],
                last_check: FormatDate(aeds2d?.last_check),
                last_service: aeds2d?.last_service,
                rms_check: aeds2d?.rms_check,
                pediatric_key: aeds2d?.pediatric_key,
              };
              let bi1 = aed1?.data[a2] ? aed1?.data[a2].batteryInfo : [];
              // let bi1 = aeds2d?.battery_info
              //     ? JSON.parse(aeds2d?.battery_info)
              //     : [];
              let si1 = aeds2d?.storage_info
                ? JSON.parse(aeds2d?.storage_info)
                : [];
              let cpi1 = aed1?.data[a2]
                ? aed1?.data[a2].batteryInfo.filter(
                  (item) => item.section_name === "charge_pack"
                )
                : [];
              // let cpi1 = aeds2d?.charge_pak_info
              // ? JSON.parse(aeds2d?.charge_pak_info)
              // : []; // charge_pak_info
              let cpi1Arr = cpi1.length > 0 ? cpi1 : [];
              let cpi1BatteryDatesata = cpi1Arr.map(
                (cpi1Arritem) => cpi1Arritem.battery_expiration
              );
    
              let sbi1 = aed1?.data[a2]
                ? aed1?.data[a2].batteryInfo.filter((item) => item.is_spare)
                : [];
              //   let sbi1 = aeds2d?.spare_battery_info
              //     ? JSON.parse(aeds2d?.spare_battery_info)
              //     : []; //spare_battery_info
              let sbi1Arr = sbi1.length > 0 ? sbi1[0] : [];
    
              let sbi1_arr =
                sbi1Arr?.has_battery_spare && sbi1Arr?.has_battery_spare?.length > 0
                  ? sbi1Arr?.has_battery_spare.map(
                    (item) => item.battery_expiration
                  )
                  : [];
              let sbi1_arr2 =
                sbi1Arr?.has_9v_spare && sbi1Arr?.has_9v_spare?.length > 0
                  ? sbi1Arr?.has_9v_spare.map((item) => item.battery_expiration)
                  : [];
              let sbi1_arr3 =
                sbi1Arr?.has_10pk_spare && sbi1Arr?.has_10pk_spare?.length > 0
                  ? sbi1Arr?.has_10pk_spare.map((item) => item.battery_expiration)
                  : [];
              let sbi1_arr4 =
                sbi1Arr?.has_installby_spare &&
                  sbi1Arr?.has_installby_spare?.length > 0
                  ? sbi1Arr?.has_installby_spare.map(
                    (item) => item.battery_expiration
                  )
                  : [];
              let sbi1_arr5 =
                sbi1Arr?.has_man_spare && sbi1Arr?.has_man_spare?.length > 0
                  ? sbi1Arr?.has_man_spare.map((item) => item.battery_expiration)
                  : [];
    
              let spare_obj = [
                {
                  title: "spare_battery_info",
                  data: sbi1_arr,
                  img: "/Battery.png",
                },
                {
                  title: "spare_battery_info",
                  data: sbi1_arr2,
                  img: "/spare-battery.png",
                },
                {
                  title: "spare_battery_info",
                  data: sbi1_arr3,
                  img: "/Battery.png",
                },
                {
                  title: "spare_battery_info",
                  data: sbi1_arr4,
                  img: "/Battery.png",
                },
                {
                  title: "spare_battery_info",
                  data: sbi1_arr5,
                  img: "/Battery.png",
                },
                {
                  title: "spare_battery_info",
                  data: cpi1BatteryDatesata,
                  img: "/Battery.png",
                },
              ];
    
              //   let ppi1 = aeds2d?.pediatric_pad_info
              //     ? JSON.parse(aeds2d?.pediatric_pad_info)
              //     : [];
              let ppi1 = aed1?.data[a2]
                ? aed1?.data[a2].allPads.filter(
                  (item) => item.section_name === "pediatric_pad_info"
                )
                : [];
              //   let sppi1 = aeds2d?.spare_padric_pad_info
              //     ? JSON.parse(aeds2d?.spare_padric_pad_info)
              //     : [];
              let sppi1 = aed1?.data[a2]
                ? aed1?.data[a2].allPads.filter(
                  (item) =>
                    item.is_spare && item.section_name === "pediatric_pad_info"
                )
                : [];
              //   let api1 = aeds2d?.adult_pad_info
              //     ? JSON.parse(aeds2d?.adult_pad_info)
              //     : [];
              let api1 = aed1?.data[a2]
                ? aed1?.data[a2].allPads.filter(
                  (item) => item.section_name === "adult_pad_info"
                )
                : [];
              //   let sapi1 = aeds2d?.spare_adult_pad_info
              //     ? JSON.parse(aeds2d?.spare_adult_pad_info)
              //     : [];
              let sapi1 = aed1?.data[a2]
                ? aed1?.data[a2].allPads.filter(
                  (item) =>
                    item.is_spare && item.section_name === "adult_pad_info"
                )
                : [];
    
              let ppd =
                ppi1 && ppi1?.length > 0
                  ? ppi1.map(
                    (item) =>
                      item?.pediatric_pad_expiration &&
                      item?.pediatric_pad_expiration != "" &&
                      item?.pediatric_pad_expiration
                  )
                  : [];
              let spsd =
                sppi1 && sppi1?.length > 0
                  ? sppi1.map(
                    (item) =>
                      item?.spare_pediatric_pad_expiration &&
                      item?.spare_pediatric_pad_expiration != "" &&
                      item?.spare_pediatric_pad_expiration
                  )
                  : [];
              let apid =
                api1 && api1?.length > 0
                  ? api1.map(
                    (item) =>
                      item?.adult_pad_expiration &&
                      item?.adult_pad_expiration != "" &&
                      item?.adult_pad_expiration
                  )
                  : [];
              let spd =
                sapi1 && sapi1?.length > 0
                  ? sapi1.map(
                    (item) =>
                      item?.spare_adult_pad_expiration &&
                      item?.spare_adult_pad_expiration != "" &&
                      item?.spare_adult_pad_expiration
                  )
                  : [];
    
              let batteryDateArr = [];
              for (let bi = 0; bi < bi1.length; bi++) {
                const hab_batery = bi1[bi]?.has_battery;
                const has_9v = bi1[bi]?.has_9v;
    
                const has_10pk = bi1[bi]?.has_10pk;
                const has_installby = bi1[bi]?.has_installby;
                const has_man = bi1[bi]?.has_man;
    
                let arr =
                  hab_batery && hab_batery?.length > 0
                    ? hab_batery.map((item) => item.battery_expiration)
                    : [];
                let arr2 =
                  has_9v && has_9v?.length > 0
                    ? has_9v.map((item) => item.battery_expiration)
                    : [];
                let arr3 =
                  has_10pk && has_10pk?.length > 0
                    ? has_10pk.map((item) => item.battery_expiration)
                    : [];
                let arr4 =
                  has_installby && has_installby?.length > 0
                    ? has_installby.map((item) => item.battery_expiration)
                    : [];
                let arr5 =
                  has_man && has_man?.length > 0
                    ? has_man.map((item) => item.battery_expiration)
                    : [];
                // console.log({brand_name: aed1.data[ a2 ]?.aed_brand,arr2});
                let obj = [
                  { title: "hab_batery", data: arr, img: "/Battery.png" },
                  { title: "has_9v", data: arr2, img: "/spare-battery.png" },
                  { title: "has_10pk", data: arr3, img: "/Battery.png" },
                  { title: "has_installby", data: arr4, img: "/Battery.png" },
                  { title: "has_man", data: arr5, img: "/Battery.png" },
                ];
    
                batteryDateArr = obj;
              }
    
              let si_obj = {
                title: "storage_info",
                data: [],
                img: "/Aed-Cabinet.png",
              };
              // if(obj2?.brand_name==='Defibtech Lifeline'){
              //      si_obj = { title: "storage_info", data: [], img: '/spare-battery.png' };
              // }
    
              for (let si = 0; si < si1.length; si++) {
                const sie = si1[si];
                si_obj.data.push(FormatDate(sie?.expiry_date));
              }
              batteryDateArr.push(si_obj);
    
              obj2.battery_expiration = [...batteryDateArr, ...spare_obj];
              let Chargepad1Arr = cpi1Arr.map(
                (cpi1Item) => cpi1Item.pad_1_expiration
              );
              let Chargepad2Arr = cpi1Arr.map(
                (cpi1Item) => cpi1Item.pad_2_expiration
              );
    
              let obj3 = [
                { title: "adult_pad_info", data: apid, img: "/people-Group.png" },
                {
                  title: "spare_adult_pad_info",
                  data: spd,
                  img: "/people-Group.png",
                },
                {
                  title: "pediatric_pad_info",
                  data: ppd,
                  img: "/child-Vector.png",
                },
                {
                  title: "spare_padric_pad_info",
                  data: spsd,
                  img: "/child-Vector.png",
                },
                {
                  title: "spare_padric_pad_info",
                  data: Chargepad1Arr,
                  img: "/people-Group.png",
                },
                {
                  title: "spare_padric_pad_info",
                  data: Chargepad2Arr,
                  img: "/people-Group.png",
                },
              ];
              obj2.pads_expiration = obj3;
              obj.data.push(obj2);
            }
            resultArr.push(obj);
          }
    
          setAedList(resultArr);
        }
    
        setShowLoading(false);
      };
    
      // on load fetch data
      useEffect(() => {
        getAeds();
      }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const [searchInput, setSearchINput] = useState({
    name: "",
    equipment: "",
    training: "",
    type: "",
    parent: "",
    distributor: "",
    owner: "",
    secure: "",
  });
  const location = useLocation();
  const showDelete = location?.state?.showDelete;

  const handleCloseModel = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenModel(false);
  };

  const fetchLoad = async () => {
    let result = await CallGETAPI('user/user-site-list-v2');
    console.log(result)
    if (result?.status) {
      let siteData = result?.data?.data || [];
      console.log(siteData)
      setsiteDataList(siteData);
    }
  }

  useEffect(() => {
    fetchLoad();
  },[])

  const getAccountsList = async () => {
    const accountsData = await CallGETAPI("account/account-list");

    if (accountsData?.status) {
      setAccounts(accountsData?.data?.data?.account);
    }

    // show loading false
    setShowLoading(false);
  };

  useEffect(() => {
    let filteredData = accounts;
    if (searchInput.name !== "") {
      filteredData = filteredData.filter(({ account_name }) =>
        account_name
          .toLocaleLowerCase()
          .includes(searchInput.name.toLocaleLowerCase())
      );
    }
    if (searchInput.type !== "") {
      filteredData = filteredData.filter(({ customer_type_name }) =>
        customer_type_name
          .toLocaleLowerCase()
          .includes(searchInput.type.toLocaleLowerCase())
      );
    }
    if (searchInput.parent !== "") {
      filteredData = filteredData.filter(({ parent_name }) =>
        parent_name
          .toLocaleLowerCase()
          .includes(searchInput.parent.toLocaleLowerCase())
      );
    }
    if (searchInput.distributor !== "") {
      filteredData = filteredData.filter(({ distributon_name }) =>
        distributon_name
          .toLocaleLowerCase()
          .includes(searchInput.distributor.toLocaleLowerCase())
      );
    }
    if (searchInput.secure !== "") {
      filteredData = filteredData.filter(
        ({ isSecure }) => isSecure == Number(searchInput.secure)
      );
    }

    setFilterdAccount(filteredData);
  }, [searchInput]);

  const [isAsc, setIsAsc] = useState(false);

  const handleSorting = (key) => {
    let sortedData = [...filteredAccount];
    if (sortedData?.[0]?.[key] === undefined) {
      return;
    }
    // isSecure

    const data = sortedData.sort((a, b) => {
      if (Number.isInteger(a[key])) {
        if (isAsc) {
          return b[key] - a[key];
        } else {
          return a[key] - b[key];
        }
      } else {
        let fa = a[key].toLowerCase(),
          fb = b[key].toLowerCase();
        if (isAsc) {
          if (fa < fb) {
            return 1;
          }
          if (fa > fb) {
            return -1;
          }
          return 1;
        } else {
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        }
      }
    });

    setFilterdAccount(data);
    setIsAsc(!isAsc);
  };

  // check account listing on state value
  useEffect(() => {
    if (location?.state?.accountListings) {
      setTimeout(() => {
        setAccounts(location?.state?.accountListings);
      }, 1000);
    } else {
      setTimeout(() => {
        getAccountsList();
      }, 1000);
    }

    return () => {
      // Anything in here is fired on component unmount.
      location.state = "";
    };
  }, [location]);

  return (
    <>
      {/* loading */}
      {showLoading ? (
        <div className="showloading">
          {/* <TableSkeleton /> */}
          <Loading />
        </div>
      ) : (<> 

      <div className="mt-4" style={{ paddingInline: "45px" }}>
        <SubHeading
          hideNew={true}
          hideHierarchy={true}
          title={"Equipment Listing"}
          // newUrl="/new-account"
        //   newUrl="/admin-account"
          subHeading={true}
        />

        <div style={{ minHeight: "84.6vh" }}>
          <Box className="d-flex justify-content-center py-4">
            <EquipmentListTbl tableData={aedList} privileges={privileges} showLoading={showLoading} />
          </Box>
        </div>
      </div>
      </>)}
    </>
  );
};

export default UserEquipments;