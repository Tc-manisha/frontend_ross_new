import React from "react";
import GeneralInfo from "./subaed_forms/GeneralInfo";
import ExternalRMSInfo from "./subaed_forms/ExternalRMSInfo";
import OutOfService from "./subaed_forms/OutOfService";
import StorageInformation from "./subaed_forms/StorageInformation";
import StdlnGeneralInfo from "./subaed_forms/StdlnGeneralInfo";

function NewStdlnAedForm({
  AccountList,
  BrandList,
  formData,
  setFormData,
  setPermission,
  Permissins,
  RmsDropdown,
  all_condition_true,
  is_edit = false,
  DefaultValue,
  aedList,
  loanerList,
}) {
  return (
    <>
      <div className="">
        <StdlnGeneralInfo
          BrandList={BrandList}
          AccountList={AccountList}
          formData={formData}
          setFormData={setFormData}
          setPermission={setPermission}
          Permissins={Permissins}
          is_edit={is_edit}
          DefaultValue={DefaultValue}
        />
        {/* {formData?.RMS_toggle || all_condition_true ? (
          <ExternalRMSInfo
            BrandList={BrandList}
            AccountList={AccountList}
            formData={formData}
            setFormData={setFormData}
            RmsDropdown={RmsDropdown}
          />
        ) : (
          ""
        )}

        {formData?.out_of_service_toggle || all_condition_true ? (
          <OutOfService
            BrandList={BrandList}
            AccountList={AccountList}
            formData={formData}
            setFormData={setFormData}
            aedList={aedList}
            loanerList={loanerList}
          />
        ) : (
          ""
        )}

        <StorageInformation
          BrandList={BrandList}
          AccountList={AccountList}
          formData={formData}
          setFormData={setFormData}
          keyName={"keyName"}
          Permissins={Permissins}
        /> */}
      </div>
    </>
  );
}

export default NewStdlnAedForm;
