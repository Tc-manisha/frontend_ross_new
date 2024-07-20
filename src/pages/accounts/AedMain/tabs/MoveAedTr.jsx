import React from "react";
import { EditIcon } from "../../../../helper/Icons";
import EditMoveAedPlacement from "../../../../components/modals/AED/EditMoveAedPlacement";
import { useState } from "react";

function MoveAedTr({ item, index, handleCheckboxChange, selectedIds, onLoad }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <tr key={index}>
        <td>
          <label htmlFor={"label_" + item.aed_id}>
            <input
              type="checkbox"
              checked={selectedIds.includes(item.aed_id)}
              onChange={() => handleCheckboxChange(item.aed_id)}
            />{" "}
            &nbsp;
            <span>
              {item.aed_brand_model} {item.aed_id}
            </span>
          </label>
        </td>
        <td
          className=""
          style={{
            wordWrap: "break-word",
            overflow: "hidden",
            maxWidth: "150px",
          }}
        >
          {item.serial_number}
        </td>
        <td>
          <div className="d-flex justify-content-between align-content-center">
            <span>{item.placement} </span>
            <button
              type="button"
              className="btn btn-link ml-auto"
              style={{ width: "50px" }}
              onClick={() => {
                setShowModal(true);
              }}
            >
              <EditIcon />
            </button>
          </div>
        </td>
      </tr>

      <EditMoveAedPlacement
        show={showModal}
        id={item.aed_id}
        onHide={() => {
          setShowModal(false);
          onLoad();
        }}
        aedDetails={item.placement}
      />
    </>
  );
}

export default MoveAedTr;
