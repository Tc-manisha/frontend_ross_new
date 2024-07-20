import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Button as FixedButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { CallGETAPI, CallPOSTAPI } from "../../helper/API";
import Drawer from "@mui/material/Drawer";
import SubHeading from "../../components/header/SubHeading";
import Filter from "../../components/filter/accessoryListingFilter";
import TableSkeleton from "../../pages/accounts/skeleton/table/TableSkeleton";
import AccessoryListingTbl from "../../components/tables/AEDs/AccessoryListingTbl";
import {
  removeFilterData,
  removePayloadData,
} from "../../redux/slices/AccessoryListingFilterSlice";
import { useDispatch, useSelector } from "react-redux";

const AccessoryListing = ({ setShowSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showLoading, setShowLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [aedList, setAedList] = useState([]);
  const accessoryFilterData = useSelector(
    (state) => state.accessorylistingfilter.accessoryListingFilterData
  );
  const accessoryPayloadData = useSelector(
    (state) => state.accessorylistingfilter.accessoryListingPayloadData
  );

  const getAeds = async () => {
    let result;
    if (accessoryFilterData && Object.keys(accessoryFilterData).length !== 0) {
      result = await CallPOSTAPI(
        "admin/admin-accessorylisting-search",
        accessoryPayloadData
      );
    } else {
      result = await CallGETAPI("admin/admin-accessory-list-v1");
    }

    if (result?.data?.status) {
      const aeds = result?.data?.data;
      setAedList(aeds);
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

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClearFilterData = async () => {
    dispatch(removeFilterData());
    dispatch(removePayloadData());
    setShowLoading(true);
    const result = await CallGETAPI("admin/admin-accessory-list-v1");
    if (result?.data?.status) {
      const aeds = result?.data?.data;
      setAedList(aeds);
    }
    setShowLoading(false);
  };

  return (
    <>
      {/* loading */}
      {showLoading ? (
        <div className="showloading-table">
          <TableSkeleton />
        </div>
      ) : (
        <>
          <div>
            {accessoryFilterData &&
            Object.keys(accessoryFilterData).length !== 0 ? (
              <>
                <FixedButton
                  className="btn-style-accessory-cancel-filter"
                  onClick={handleClearFilterData}
                >
                  Clear Filter
                </FixedButton>
              </>
            ) : null}
            <FixedButton
              className="btn-style-filter"
              onClick={handleDrawerOpen}
            >
              Accessory Filters
            </FixedButton>
            <Drawer
              sx={{
                width: "300px",
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: "300px",
                  boxSizing: "border-box",
                },
              }}
              anchor="right"
              open={open}
              onClose={handleDrawerClose}
            >
              {/* filter component  */}
              <Filter
                setAedList={setAedList}
                setOpen={setOpen}
                setShowLoading={setShowLoading}
              />
            </Drawer>
          </div>
          <div className="mt-4" style={{ paddingInline: "45px" }}>
            <SubHeading
              hideNew={true}
              hideHierarchy={true}
              title={"Accessory Listing"}
              subHeading={true}
            />

            <div>
              <Box className="d-flex justify-content-center py-4">
                <AccessoryListingTbl standaloneData={aedList} />
              </Box>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AccessoryListing;
