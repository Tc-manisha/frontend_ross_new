// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Checkbox, FormControlLabel, Icon, Radio, Switch } from "@mui/material";
// import { Form, Button as BButton, Button as BsButton } from "react-bootstrap";
// import Button from "@mui/material/Button";
// import { validatePhone } from "../../helper/Common";
// import { toast } from "react-toastify";

// export default function SubForm({
//   altTrainerForm,
//   setSubFormData,
//   increaseAlternative,
//   decreaseAlternative,
//   handleInputChange,
//   allDropDowns,
//   formData,
//   formName,
//   setFormData,
//   noBtns,
//   noMain,
//   setSubFormPhoneValidated,
//   mainRequired,
//   setMainRequired,
//   billingMainRequired,
//   setBillingMainRequired,
//   shippingMainRequired,
//   setShippingMainRequired,
//   type,
// }) {
//   console.log(type)
//   console.log("altTrainerFormPhone", altTrainerForm);

//   const [allPhoneData, setAllPhoneData] = useState([]);
//   const [phone, setPhone] = useState("");
//   const [phoneExt, setPhoneExt] = useState("");

//   const [phoneType, setPhoneType] = useState(1);
//   const [main, setMain] = useState(false);
//   const [phoneValidations, setPhoneValidations] = useState([]);

//   useEffect(() => {
//     const initialValidations = altTrainerForm.map(() => ({
//       account_main_contact_phone: false,
//     }));
//     setPhoneValidations(initialValidations);
//   }, [altTrainerForm]);

//   const updateFieldChanged = (e, index, name) => {
//     const newArr = [...altTrainerForm];
//     if (name === `account_main_contact_phone_main`) {
//       newArr.forEach((form, i) => {
//         newArr[i].account_main_contact_phone_main = i === index ? 1 : 0;
//       });
//       type == "SitePoc" ? setMainRequired(true) :
//       type ==  "BillingContact" ? setBillingMainRequired(true) :
//       type == "ShippingContact" ? setShippingMainRequired(true) : "";
//     } else {
//       newArr[index][name] = e.target.value;
//     }
//     setSubFormData(newArr);
//   };

//   const validatePhoneNumber = (phoneNumber) => {
//     const phoneRegex = /^\d{10}$/;
//     return phoneRegex.test(phoneNumber);
//   };

//   const handlePhoneChange = (e, index) => {
//     const phoneNumber = e.target.value;
//     if (validatePhoneNumber(phoneNumber)) {
//       // Update phone validation state for the specific index
//       setPhoneValidations((prevValidations) => {
//         const updatedValidations = [...prevValidations];
//         updatedValidations[index] = { account_main_contact_phone: false };
//         return updatedValidations;
//       });
//       updateFieldChanged(e, index, "account_main_contact_phone");
//     } else {
//       // Update phone validation state for the specific index
//       setPhoneValidations((prevValidations) => {
//         const updatedValidations = [...prevValidations];
//         updatedValidations[index] = { account_main_contact_phone: true };
//         return updatedValidations;
//       });
//     }
//   };

//   console.log("altTrainerForm", altTrainerForm);

//   return (
//     <>
//       {altTrainerForm &&
//         altTrainerForm?.map((singleForm, index) => (
//           <div
//             className="row mb-4 "
//             style={{ display: "flex", alignItems: "center" }}
//             key={index}
//           >
//             <Form.Group className={"col"}>
//               <div className="d-flex mb-2" style={{ alignItems: "center" }}>
//                 <Form.Label>Phone</Form.Label>
//                 {noBtns && (
//                   <>
//                     <button
//                       onClick={increaseAlternative}
//                       type="button"
//                       className="btn mx-2 btn-sm btn-primary "
//                     >
//                       +
//                     </button>
//                     <button
//                       onClick={decreaseAlternative}
//                       type="button"
//                       className="btn mx-2 btn-sm btn-danger "
//                     >
//                       -
//                     </button>
//                   </>
//                 )}
//               </div>

//               <Form.Control
//                 type="number"
//                 name="account_main_contact_phone"
//                 minLength="10"
//                 maxLength="10"
//                 defaultValue={singleForm.account_main_contact_phone}
//                 onChange={(e) => handlePhoneChange(e, index)}
//                 className={
//                   phoneValidations[index]?.account_main_contact_phone
//                     ? "phone-invalid-input"
//                     : ""
//                 }
//                 // required={altTrainerForm.length == 1 ? true : false}
//               />

//               {phoneValidations[index]?.account_main_contact_phone ? (
//                 <>
//                   <div className="phone-invalid">
//                     Please Enter Exact 10 digits.
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <Form.Control.Feedback type="invalid">
//                     Please Enter Exact 10 digits.
//                   </Form.Control.Feedback>
//                 </>
//               )}
//             </Form.Group>

//             <Form.Group className={"col"}>
//               <Form.Label>Ext</Form.Label>

//               <Form.Control
//                 type="number"
//                 name="account_main_contact_phone_ext"
//                 onChange={(e) =>
//                   updateFieldChanged(e, index, "account_main_contact_phone_ext")
//                 }
//                 defaultValue={singleForm.account_main_contact_phone_ext}
//               />
//             </Form.Group>

//             <Form.Group className={"col"}>
//               <Form.Label>Phone Type</Form.Label>
//               <Form.Select
//                 className={""}
//                 name="phone_type_id"
//                 onChange={(e) => updateFieldChanged(e, index, "phone_type_id")}
//                 defaultValue={singleForm.phone_type_id}
//               >
//                 <option value="" selected>
//                   --Select One--
//                 </option>
//                 {allDropDowns?.phoneType &&
//                   allDropDowns?.phoneType.map((PT, index) => (
//                     <option value={PT.dropdown_phone_type_id} key={index}>
//                       {PT.dropdown_phone_type_name}
//                     </option>
//                   ))}
//               </Form.Select>
//             </Form.Group>

//             <Form.Group className={"col d-block"}>
//               {/* {!noMain && ( */}
//               <>
//                 <b className={""}>Main</b>
//                 <div className="">
//                   {JSON.stringify(singleForm?.account_main_contact_phone_main)}
//                   <FormControlLabel
//                     className={""}
//                     label=""
//                     control={
//                       <Radio
//                         // checked={
//                         //   altTrainerForm[index]
//                         //     .account_main_contact_phone_main === 1
//                         // }
//                         checked={singleForm?.account_main_contact_phone_main}
//                         name={"account_main_contact_phone_main"}
//                         value={
//                           singleForm?.account_main_contact_phone_main
//                         }
//                         color="primary"
//                         size="medium"
//                         onClick={(e) => {
//                           // Check if phone field is empty
//                           const phoneNumber = altTrainerForm[index].account_main_contact_phone;
//                           if (!phoneNumber || phoneNumber.trim() === '') {
//                             toast.error("Please first fill Phone number")
//                             setMainRequired(false)
//                           } else {
//                             e.preventDefault();
//                             updateFieldChanged(
//                               e,
//                               index,
//                               "account_main_contact_phone_main",
//                               type
//                             );
//                           }
//                         }}
//                         // onClick={(e) =>
//                         //   updateFieldChanged(
//                         //     e,
//                         //     index,
//                         //     "account_main_contact_phone_main",type
//                         //   )
//                         // }
//                         // required={type == "SitePoc" && altTrainerForm[index].account_main_contact_phone != "" ? true : false}
//                         //  type == "billingContact" ? !billingMainRequired :
//                         // type == "shippingContact" ? !shippingMainRequired : "" }
//                       />
//                     }
//                   />
//                 </div>
//               </>
//             </Form.Group>
//           </div>
//         ))}
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Checkbox, FormControlLabel, Icon, Radio, Switch } from "@mui/material";
import { Form, Button as BButton, Button as BsButton } from "react-bootstrap";
import Button from "@mui/material/Button";
import { validatePhone } from "../../helper/Common";
import { toast } from "react-toastify";

export default function SubFormAdmin({
  altTrainerForm,
  setSubFormData,
  increaseAlternative,
  decreaseAlternative,
  handleInputChange,
  allDropDowns,
  formData,
  formName,
  setFormData,
  noBtns,
  noMain,
  setSubFormPhoneValidated,
  section
}) {
    const [allPhoneData, setAllPhoneData] = useState([]);
    const [phone, setPhone] = useState("");
    const [phoneExt, setPhoneExt] = useState("");
    const [phoneType, setPhoneType] = useState(1);
    const [main, setMain] = useState(false);
    const [phoneValidations, setPhoneValidations] = useState({});
    const [phoneErrors, setPhoneErrors] = useState([]);

    const validatePhoneNumbers = (forms) => {
        const newPhoneErrors = forms.map((form) => {
            const phone = form.account_main_contact_phone || '';
            return phone.trim() !== '' && phone.trim().length < 10;
        });
        setPhoneErrors(newPhoneErrors);
    };

    const updateFieldChanged = (e, index, name) => {
        const newArr = [...altTrainerForm];
        let newPhoneErrors = [...phoneErrors];

        if (e.target.name === 'account_main_contact_phone') {
            e.target.value = e.target.value.replace(/[^0-9]/g, "").trim();
            e.target.value = e.target.value.slice(0, 10);

            newArr[index][name] = e.target.value;

            if (e.target.value.trim().length < 10) {
                newPhoneErrors[index] = true;
            } else {
                newPhoneErrors[index] = false;
            }
        }

        if (name === `account_main_contact_phone_main`) {
            newArr.forEach((form, i) => {
                newArr[i].account_main_contact_phone_main = i === index ? (form.account_main_contact_phone_main ? 0 : 1) : 0;
            });
        } else {
            newArr[index][name] = e.target.value;
        }
        setPhoneErrors(newPhoneErrors);
        setSubFormData(newArr);
    };

    const handleDecreaseAlternative = (index, section) => {
        decreaseAlternative(section, index);
        validatePhoneNumbers(altTrainerForm);
    };

    useEffect(() => {
        validatePhoneNumbers(altTrainerForm);
    }, [altTrainerForm]);

    return (
        <>
            {altTrainerForm.map((singleForm, index) => (
                <div
                    className="row mb-4 "
                    style={{ display: "flex", alignItems: "center" }}
                    key={index}
                >
                    <Form.Group className={"col"}>
                        <div className="d-flex mb-2" style={{ alignItems: "center" }}>
                            <Form.Label>Phone</Form.Label>
                            {noBtns && (
                                <>
                                    <button
                                        onClick={increaseAlternative}
                                        type="button"
                                        className="btn mx-2 btn-sm btn-primary "
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => handleDecreaseAlternative(index, section)}
                                        type="button"
                                        className="btn mx-2 btn-sm btn-danger "
                                    >
                                        -
                                    </button>
                                </>
                            )}
                        </div>
                        <Form.Control
                            type="text"
                            name="account_main_contact_phone"
                            value={singleForm.account_main_contact_phone}
                            onChange={(e) => updateFieldChanged(e, index, 'account_main_contact_phone')}
                            pattern="[0-9]*"
                            minLength={10}
                            maxLength={10}
                            className={phoneErrors[index] ? "phone-invalid-input" : ""}
                        />
                        {
                            phoneErrors[index] && (
                                <div className="phone-invalid">
                                    Please Enter Exact 10 digits.
                                </div>
                            )
                        }

                    </Form.Group>

                    <Form.Group className={"col"}>
                        <Form.Label>Ext</Form.Label>

                        <Form.Control
                            type="number"
                            name="account_main_contact_phone_ext"
                            onChange={(e) => updateFieldChanged(e, index, 'account_main_contact_phone_ext')}
                            value={singleForm.account_main_contact_phone_ext}
                        />
                    </Form.Group>

                    <Form.Group className={"col"}>
                        <Form.Label>Phone Type</Form.Label>
                        <Form.Select
                            className={""}
                            name="phone_type_id"
                            onChange={(e) => updateFieldChanged(e, index, 'phone_type_id')}
                            value={singleForm.phone_type_id}
                        >
                            <option value="" selected>
                                --Select One--
                            </option>
                            {allDropDowns?.phoneType &&
                                allDropDowns?.phoneType.map((PT, index) => (
                                    <option value={PT.dropdown_phone_type_id} key={index}>
                                        {PT.dropdown_phone_type_name}
                                    </option>
                                ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className={"col d-block"}>
                        <>
                            <b className={""}>Main</b>

                            <div className="">
                                <FormControlLabel
                                    className={''}
                                    label=''
                                    // value={true}
                                    name="account_main_contact_phone_main"
                                    onClick={(e) => {
                                        // Check if phone field is empty
                                        const phoneNumber =
                                          altTrainerForm[index].account_main_contact_phone;
                                        if (!phoneNumber || phoneNumber.trim() === "") {
                                          toast.error("Please first fill Phone number");
                                        } else {
                                          e.preventDefault();
                                          updateFieldChanged(
                                            e,
                                            index,
                                            "account_main_contact_phone_main"
                                          );
                                        }
                                      }}
                                    // onChange={(e) => updateFieldChanged(e, index, 'account_main_contact_phone_main')}
                                    control={<Radio color="primary" size="medium"
                                        // checked={singleForm?.account_main_contact_phone_main === true || singleForm?.account_main_contact_phone_main ? true : false} />}
                                        checked={singleForm?.account_main_contact_phone_main} />}
                                />
                            </div>
                        </>
                    </Form.Group>
                </div>
            ))}
        </>
    );
}

