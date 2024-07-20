import React from "react";
import PadsInfoEditTr from "./PadsInfoEditTr";
import PediatricPadInfoTr from "./PediatricPadInfoTr";
import SparePadsInfoEditTr from "./SparePadsInfoEditTr";
import SparePediatricPadInfoTr from "./SparePediatricPadInfoTr";

const PadsInfoEditTbl = ({
  aedPadTypeList,
  RenderDate,
  adultPadInfo,
  spareAdultPadInfo,
  pediatricPadInfo,
  sparePadricPadInfo,
  adultPadPakInfo,
  spareAdultPadPakInfo,
  pediatricPadPakInfo,
  sparePadricPadPakInfo,
  formData,
  setFormData,
  toggle,
  readOnly = 0,
}) => {
  const print_aed_pad_type = (bid) => {
    if (bid === "unknown") return "unknown";
    let findName = aedPadTypeList.find(
      (item) => parseInt(item?.pad_type_id) === parseInt(bid)
    );
    return findName?.pad_part_number || bid;
  };

  console.log({ sparePadricPadPakInfo });

  return (
    <>
      <div className="account-info pb-4">
        {(adultPadInfo?.length > 0 && adultPadInfo?.[0]?.pad_type_id != "") ||
        (adultPadPakInfo?.length > 0 &&
          adultPadPakInfo?.[0]?.pad_type_id != "") ||
        (spareAdultPadInfo?.length > 0 &&
          spareAdultPadInfo?.[0]?.pad_type_id != "") ||
        (pediatricPadInfo?.length > 0 &&
          pediatricPadInfo?.[0]?.pad_type_id != "") ||
        (sparePadricPadInfo?.length > 0 &&
          sparePadricPadInfo?.[0]?.pad_type_id != "") ||
        (sparePadricPadPakInfo?.length > 0 &&
          sparePadricPadPakInfo?.[0]?.pad_type_id != "") ? (
          <table className="w-100">
            <thead>
              <tr className="">
                <th
                  scope="col"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  Pad Type
                </th>
                <th
                  scope="col"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  Part #{" "}
                </th>
                <th
                  scope="col"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  Expiration Date
                </th>
                <th
                  scope="col"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  Pad Lot{" "}
                </th>
                <th
                  scope="col"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue"
                >
                  Pad UDI
                </th>
              </tr>
            </thead>
            <tbody className="odd-even-row border-b-blue">
              {adultPadInfo?.map((API, i) => (
                <>
                  {API?.pad_type_id && API?.pad_type_id != "" && (
                    <PadsInfoEditTr
                      aedPadTypeList={aedPadTypeList}
                      toggle={toggle}
                      i={i}
                      parentName={"adult_pad_info"}
                      dataName={"pad_type_id"}
                      formData={formData}
                      setFormData={setFormData}
                      print_aed_pad_type={print_aed_pad_type}
                      RenderDate={RenderDate}
                      readOnly={readOnly}
                    />
                  )}
                </>
              ))}

              {adultPadPakInfo?.map((API, i) => (
                <>
                  {API?.pad_type_id && API?.pad_type_id != "" && (
                    <>
                      <PadsInfoEditTr
                        aedPadTypeList={aedPadTypeList}
                        toggle={toggle}
                        i={i}
                        parentName={"adult_pad_pak_info"}
                        dataName={"pad_type_id"}
                        formData={formData}
                        setFormData={setFormData}
                        print_aed_pad_type={print_aed_pad_type}
                        RenderDate={RenderDate}
                        readOnly={readOnly}
                      />
                    </>
                  )}
                </>
              ))}

              {spareAdultPadInfo?.map((SAPI, i) => (
                <>
                  {SAPI?.pad_type_id && SAPI?.pad_type_id != "" && (
                    <SparePadsInfoEditTr
                      aedPadTypeList={aedPadTypeList}
                      toggle={toggle}
                      i={i}
                      parentName={"spare_adult_pad_info"}
                      dataName={"spare_adult_pad_part"}
                      formData={formData}
                      setFormData={setFormData}
                      print_aed_pad_type={print_aed_pad_type}
                      RenderDate={RenderDate}
                      readOnly={readOnly}
                    />
                  )}
                </>
              ))}

              {spareAdultPadPakInfo?.map((SAPI, i) => (
                <>
                  {SAPI?.pad_type_id && SAPI?.pad_type_id != "" && (
                    <SparePadsInfoEditTr
                      aedPadTypeList={aedPadTypeList}
                      toggle={toggle}
                      i={i}
                      parentName={"spare_adult_pad_pak_info"}
                      dataName={"spare_adult_pad_part"}
                      formData={formData}
                      setFormData={setFormData}
                      print_aed_pad_type={print_aed_pad_type}
                      RenderDate={RenderDate}
                      readOnly={readOnly}
                    />
                  )}
                </>
              ))}
              {pediatricPadInfo &&
                pediatricPadInfo?.map((ppitem, i) => (
                  <>
                    {ppitem?.pad_type_id && ppitem?.pad_type_id != "" && (
                      <PediatricPadInfoTr
                        aedPadTypeList={aedPadTypeList}
                        toggle={toggle}
                        i={i}
                        parentName={"pediatric_pad_info"}
                        dataName={"pediatric_pad_part"}
                        formData={formData}
                        setFormData={setFormData}
                        print_aed_pad_type={print_aed_pad_type}
                        RenderDate={RenderDate}
                        readOnly={readOnly}
                      />
                    )}
                  </>
                ))}

              {pediatricPadPakInfo &&
                pediatricPadPakInfo?.map((ppitem, i) => (
                  <>
                    {ppitem?.pad_type_id && ppitem?.pad_type_id != "" && (
                      <PediatricPadInfoTr
                        aedPadTypeList={aedPadTypeList}
                        toggle={toggle}
                        i={i}
                        parentName={"pediatric_pak_pad_info"}
                        dataName={"pediatric_pad_part"}
                        formData={formData}
                        setFormData={setFormData}
                        print_aed_pad_type={print_aed_pad_type}
                        RenderDate={RenderDate}
                        readOnly={readOnly}
                      />
                    )}
                  </>
                ))}

              {sparePadricPadInfo?.map((SPPi, i) => (
                <>
                  {SPPi?.pad_type_id && SPPi?.pad_type_id != "" && (
                    <SparePediatricPadInfoTr
                      aedPadTypeList={aedPadTypeList}
                      toggle={toggle}
                      i={i}
                      parentName={"spare_padric_pad_info"}
                      dataName={"spare_pediatric_pad_part"}
                      formData={formData}
                      setFormData={setFormData}
                      print_aed_pad_type={print_aed_pad_type}
                      RenderDate={RenderDate}
                      readOnly={readOnly}
                    />
                  )}
                </>
              ))}

              {sparePadricPadPakInfo?.map((SPPi, i) => (
                <>
                  {SPPi?.pad_type_id && SPPi?.pad_type_id != "" && (
                    <SparePediatricPadInfoTr
                      aedPadTypeList={aedPadTypeList}
                      toggle={toggle}
                      i={i}
                      parentName={"spare_padric_pak_pad"}
                      dataName={"spare_pediatric_pad_part"}
                      formData={formData}
                      setFormData={setFormData}
                      print_aed_pad_type={print_aed_pad_type}
                      RenderDate={RenderDate}
                      readOnly={readOnly}
                    />
                  )}
                </>
              ))}
            </tbody>
          </table>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default PadsInfoEditTbl;
