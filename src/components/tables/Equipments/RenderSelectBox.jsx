import React, { useEffect, useState } from "react";
const RenderSelectBox = ({
  handlerChange,
  name,
  contact_list,
  index,
  assign_user,
  value,
}) => {
  const us = assign_user ? JSON.parse(assign_user) : [];
  const [val, setVal] = useState(value || "");
  // useEffect(()=>{
  //     if(us.length > 0){
  //         const check = us.find((it2)=>(it2?.type===name))
  //         if(check?.contact_id){
  //             setVal(check.contact_id)
  //         }
  //     }
  // },[us]);
  useEffect(() => {
  }, [val]);
  return (
    <select
      defaultValue={"N/A"}
      name={name}
      onChange={(e) => {
        handlerChange(e, index);
        setVal(e.target.value);
      }}
      value={value}
    >
      <option value="N/A">N/A</option>
      {contact_list?.map((item, i) => (

        <option value={item.contact_id} data-item={value}>
          {item.contact_name}
        </option>
      ))}
    </select>
  );
};
export default RenderSelectBox;
