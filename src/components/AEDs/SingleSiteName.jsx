import React from "react";

function SingleSiteName({ equipmentFilterData, item }) {
  let show_site_name = 0;

  if (Object.keys(equipmentFilterData).length !== 0) {
    if (equipmentFilterData?.aed && item?.data.length > 0) {
      show_site_name = 1;
    }
    if (equipmentFilterData?.accessories && item?.standalone_data.length > 0) {
      show_site_name = 1;
    }
  } else {
    console.log({len2: item?.data.length});
    if (item?.data.length > 0) {
      show_site_name = 1;
    }
    if (item?.standalone_data.length > 0) {
      show_site_name = 1;
    }
  }

  return (
    <>
      <div className="text-center p-0 site-title-btn EquipmentHeaderDiv">
        {show_site_name ? (
          <div className="text-title">
            <h2 className="aed-title">{item?.site_name}</h2>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default SingleSiteName;
