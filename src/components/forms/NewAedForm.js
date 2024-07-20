import React from "react";
import GeneralInfo from "./subaed_forms/GeneralInfo";
import ExternalRMSInfo from "./subaed_forms/ExternalRMSInfo";
import OutOfService from "./subaed_forms/OutOfService";
import StorageInformation from "./subaed_forms/StorageInformation";

function NewAedForm({
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
  setAccId,
  AccId,
  siteId
}) {
  return (
    <>
      <div className="">
        <GeneralInfo
          BrandList={BrandList}
          AccountList={AccountList}
          formData={formData}
          setFormData={setFormData}
          setPermission={setPermission}
          Permissins={Permissins}
          is_edit={is_edit}
          DefaultValue={DefaultValue}
          setAccId={setAccId}
          AccId={AccId}
        />
        {formData?.RMS_toggle || all_condition_true ? (
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
            siteId={siteId}
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
        />
      </div>
    </>
  );
}

export default NewAedForm;
