import React, { useEffect, useState } from "react";
import { CallPOSTAPI } from "../../../helper/API";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import RenderSelectBox from "./RenderSelectBox";

function AssignEquipTbl({ data, contact_list }) {
  const [editedData, setEditedData] = useState([]); // Track changes made by the user
  const [loading, setLoading] = useState(false);

  const handleEdit = (rowIndex, columnName, value) => {
    // Update the editedData state when a user edits a cell
    const newData = [...editedData];
    newData[rowIndex] = { ...newData[rowIndex], [columnName]: value };
    setEditedData(newData);
  };

  const handlerDropDownChange = (e, index) => {
    handleEdit(index, e.target.name, e.target.value);
  };
  const handleEquipmentAssignment = () => {
  };

  useEffect(() => {
    if (data) {
      setEditedData(data);
    }
  }, [data]);
  const navigate = useNavigate();
  const handleSubmit = async () => {
    /*
          
{
    "equipments":[
        {"aed_id":6,"users":[{"primary":"Rahul Phalke","contact_id":"1"},{"backup1":"Gautam Phalke","contact_id":"2"}]}
        ]
}
        */
    const payload = { equipments: [] };
    setLoading(true);
    for (let i = 0; i < editedData.length; i++) {
      const item = editedData[i];
      const itemDetails = editedData[i].aed_details;

      const pName = contact_list.find(
        (it1) => it1.contact_id === parseInt(item.primary)
      );
      const b1Name = contact_list.find(
        (it1) => it1.contact_id === parseInt(item.backup1)
      );
      const b2Name = contact_list.find(
        (it1) => it1.contact_id === parseInt(item.backup2)
      );
      const b3Name = contact_list.find(
        (it1) => it1.contact_id === parseInt(item.backup3)
      );
      payload.equipments.push({
        aed_id:
          itemDetails && itemDetails?.aed_id
            ? itemDetails?.aed_id
            : item[0]?.aed_id,
        users: [
          {
            type: "primary",
            primary: pName?.contact_name,
            contact_id: item.primary,
          },
          {
            type: "backup1",
            backup1: b1Name?.contact_name,
            contact_id: item.backup1,
          },
          {
            type: "backup2",
            backup2: b2Name?.contact_name,
            contact_id: item.backup2,
          },
          {
            type: "backup3",
            backup3: b3Name?.contact_name,
            contact_id: item.backup3,
          },
        ],
      });
    }
    const response = await CallPOSTAPI(
      "account/assign-equipment-to-user",
      payload
    );
    setLoading(false);
    if (response.data.status) {
      toast.success(response?.data?.msg);
      navigate(-1);
    } else {
      toast.error(response?.data?.msg);
    }
  };

  return (
    <div
    className="mt-4 mb-5"
    style={{ width: "100vw", paddingInline: "0px" }}
  >
    <div className="tableWrapper" id="table-main-20002">
      <table className="table w-100 border-b-blue odd-even-row  "
      style={{ width: "100vw", maxWidth: "100vw" }}
      >
        <thead className="heading">
          <tr>
            <th style={{ whiteSpace: "nowrap", fontSize: "14px",maxWidth:"100px",textOverflow: "ellipsis", overflow: "hidden"  }}>AED Brand / Model</th>
            <th style={{ whiteSpace: "nowrap", fontSize: "14px",maxWidth:"100px" }}>Serial #</th>
            <th style={{ whiteSpace: "nowrap", fontSize: "14px",maxWidth:"100px" }}>AED Placement</th>
            <th style={{ whiteSpace: "nowrap", fontSize: "14px",maxWidth:"100px",textOverflow: "ellipsis", overflow: "hidden"  }}>Primary</th>
            <th style={{ whiteSpace: "nowrap", fontSize: "14px",maxWidth:"100px" }}>Backup 1</th>
            <th style={{ whiteSpace: "nowrap", fontSize: "14px",maxWidth:"100px" }}>Backup 2</th>
            <th style={{ whiteSpace: "nowrap", fontSize: "14px",maxWidth:"100px" }}>Backup 3</th>
          </tr>
        </thead>
        <tbody>
          {editedData?.map((item, rowIndex) => (
            <tr key={rowIndex}>
              <td style={{maxWidth:"200px"}}>{item?.aed_brand}</td>
              <td style={{maxWidth:"200px"}}>{item?.aed_details?.serial_number}</td>
              <td style={{maxWidth:"200px"}}>{item?.aed_details?.placement}</td>
              <td style={{maxWidth:"200px"}} >
                <RenderSelectBox
                  handlerChange={handlerDropDownChange}
                  contact_list={contact_list}
                  index={rowIndex}
                  value={item?.primary}
                  assign_user={item?.aed_details?.assign_user}
                  name="primary"
                />
              </td>

              <td style={{maxWidth:"200px"}}>
                <RenderSelectBox
                  handlerChange={handlerDropDownChange}
                  contact_list={contact_list}
                  index={rowIndex}
                  value={item?.backup1}
                  assign_user={item?.aed_details?.assign_user}
                  name="backup1"
                />
              </td>

              <td style={{maxWidth:"200px"}}>
                <RenderSelectBox
                  handlerChange={handlerDropDownChange}
                  contact_list={contact_list}
                  index={rowIndex}
                  value={item?.backup2}
                  assign_user={item?.aed_details?.assign_user}
                  name="backup2"
                />
              </td>

              <td style={{maxWidth:"200px"}}>
                <RenderSelectBox
                  handlerChange={handlerDropDownChange}
                  contact_list={contact_list}
                  index={rowIndex}
                  value={item?.backup3}
                  assign_user={item?.assign_user}
                  name="backup3"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="row pb-3 py-5">
        <div className="col-12 content-flex-right">
          <button
            className="btn btn-danger text-uppercase"
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            className="btn btn-success text-uppercase ms-2"
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default AssignEquipTbl;
