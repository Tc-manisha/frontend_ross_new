import React, { useEffect, useState } from 'react'
import './css/login.scss';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { CallGETAPI, CallPOSTAPI } from '../../helper/API';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MessageHandler from '../../components/common/MessageHandler';
import { DecryptToken, FetchIP, getIpAddress } from '../../helper/BasicFn';
import { GetProfile, getLoggedInUser, getPermission, setPermission } from '../../helper/Common';
import { useDispatch } from 'react-redux';
import { MainDashboardTopTabLists } from '../../helper/constants';
import { removeFilterData as removeListingFilter, removePayloadData as removeListingFilterPayload } from "../../redux/slices/AccountListFilter";
import { removeFilterData as removeEquipmentFilter, removePayloadData as removeEquipmentFilterPayload } from "../../redux/slices/AccountDetailsEquipmentFilter";
import { removeFilterData as removeEquipmentListingFilter, removePayloadData as removeEquipmentListingFilterPayload } from "../../redux/slices/EquipmentListingFilterSlice";
import { removeFilterData as removeAccessoryListingFilter, removePayloadData as removeAccessoryListingFilterPayload } from "../../redux/slices/AccessoryListingFilterSlice";

export default function Login(isUser) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [FormMsg, setFormMsg] = React.useState({ type: true, msg: "" });
  const [loading, setLoading] = React.useState(false);
  const [systemIp, setSystemIp] = React.useState("");

  const fetchPrivilege = async () => {
    let response = await CallGETAPI("auth/priviledge");

    if (response.status && response?.data?.permission) {
      let permission = response?.data?.permission;
      setPermission(permission);
      const permissionsArray = permission;
      const allTabsObj1 = MainDashboardTopTabLists.filter((item) =>
        permissionsArray.includes(item?.id)
      );
      const filteredAllTabsArr1 = allTabsObj1.map((item) => item.name);

      setAllTabsObj(allTabsObj1);
      setFilteredAllTabsArr(filteredAllTabsArr1);
      return filteredAllTabsArr1;
    } else {
      return [];
    }
  };

  const getIp = async () => {
    let res = await getIpAddress();
    if (res) {
      setSystemIp(res);
    }
  };

  const [is_dashboard, setIsDashboard] = useState(false);
  const [allTabsObj, setAllTabsObj] = useState([]);
  const [filteredAllTabsArr, setFilteredAllTabsArr] = useState([]);

  const checkDashboardPermission = async (profile) => {
    let result = 0;
    if (profile && profile.user_type > 1) {
      const is_user = sessionStorage.getItem("is_user") || 0;
      const permissions = getPermission(); // is_user && is_user == 1 ? sessionStorage.getItem('permissions') : localStorage.getItem('permissions');
      const permissionsArray = permissions.split(",");
      if (permissionsArray.includes("dashboard")) {
        result = 1;
      }
    }
    return result;
  };

  // const allTabsObj = MainDashboardTopTabLists.filter(item => permissionsArr.includes(item?.id));
  // const filteredAllTabsArr = allTabsObj.map(item => item.name)

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const Username = e.target.username.value;
    const Password = e.target.password.value;

    if (!Username) {
      setFormMsg({ type: false, msg: "Please Fill User Name" });
      setLoading(false);
      return;
    }

    if (!Password) {
      setFormMsg({ type: false, msg: "Please Fill Password" });
      setLoading(false);
      return;
    }

    let os = Navigator.platform ? Navigator.platform : "";

    let senData = {
      email: Username,
      password: Password,
      ip_address: systemIp,
      source_os: os,
    };
    let result = await CallPOSTAPI("auth/login", senData);
//     console.log(response.data)
// let result=response.data || {};



    if (result.status) {
      //  is 2FA
   
      if (result?.data?.data?.is2fa) {
     
        navigate("/verify-otp", {
          state: { message: result?.data?.data?.msg, isLogin: 1 },
        });
        return;
      }

			if (result?.status) {
				// const token = result.data.data;
				// const rtoken = result.data.data;
				let token = result?.data?.data?.token;
				let rtoken = result?.data?.data?.refreshtoken;
				localStorage.setItem('ross_rtoken', rtoken);
				localStorage.setItem('ross_token', token)
				dispatch(removeListingFilter());
				dispatch(removeListingFilterPayload());
				dispatch(removeEquipmentFilter());
				dispatch(removeEquipmentFilterPayload());
				dispatch(removeEquipmentListingFilter());
				dispatch(removeEquipmentListingFilterPayload());
				dispatch(removeAccessoryListingFilter());
				dispatch(removeAccessoryListingFilterPayload());
				// let user = GetProfile();
        let user = DecryptToken(); 
				const TabListArr = await fetchPrivilege();
				// return "";
				// get classId from state value
				const classId = location?.state?.classId
				let is_dash = await checkDashboardPermission(user);
   
        if (user?.user_type === 1) {
          navigate("/account/contact-details/" + user.contact_id, {
            state: {
              tab: "Classes",
            },
          });
        } else if (classId) {
          navigate("/user-class-registration", {
            state: {
              classId: classId,
            },
          });

          //  Login Condition for User // ----
        } else if (parseInt(user?.user_type) == 3) {
          let response = await CallGETAPI("auth/priviledge");
          if (response.status && response?.data?.permission) {
            let permission = response?.data?.permission;
            if (user?.is_edit) {
              // navigate(is_dash ? "/user-dashboard1" : "/user-dashboard/" + TabListArr?.[0]);
              if (permission?.length > 0) {
                permission.includes("dashboard")
                  ? navigate("/user-dashboard1") : 
                  permission.includes("site-tab") ? navigate("/user-listing/sites") :
                  permission.includes("contact-tab") ? navigate("/user-listing/contacts") :
                  permission.includes("equipment-tab") ? navigate("/user-listing/equipment") :
                  permission.includes("notes-tab") ? navigate("/user-listing/notes") :
                  permission.includes("support-tab") ? navigate("/user-listing/support") :
                  // permission.includes("account-details") ? 
                  navigate(`/user/Details/${user?.account_id}`);
                  // ? navigate("/user/account-details/" + user.account_id)
                  // : "";
              }
            } else {
              navigate("/user-dashboard1/user-profile/" + user.contact_id);
            }
          } else {
            navigate("/user-dashboard1/user-profile/" + user.contact_id);
          }
   // Login Condition for Sub-Admin  //----
        }  else if(parseInt(user?.user_type) == 2) {
          let response = await CallGETAPI("auth/priviledge");
          if (response.status && response?.data?.permission) {
            let permission = response?.data?.permission;
            if (user?.is_edit) {
              // navigate(is_dash ? "/user-dashboard1" : "/user-dashboard/" + TabListArr?.[0]);
              if (permission?.length > 0) {
                permission.includes("dashboard")
                  ? navigate("/user-dashboard1") : 
                  permission.includes("site-tab") ? navigate("/user-listing/sites") :
                  permission.includes("contact-tab") ? navigate("/user-listing/contacts") :
                  permission.includes("equipment-tab") ? navigate("/user-listing/equipment") :
                  permission.includes("notes-tab") ? navigate("/user-listing/notes") :
                  permission.includes("support-tab") ? navigate("/user-listing/support") :
                  // permission.includes("account-details") ? 
                  navigate(`/user/Details/${user?.account_id}`);
                  // ? navigate("/user/account-details/" + user.account_id)
                  // : "";
              } else {
                // navigate("/user-dashboard1/user-profile/" + user.contact_id);
                navigate("/user-dashboard")
              }
            } else {
              navigate("/user-dashboard1/user-profile/" + user.contact_id);
            }
          } else {
            navigate("/user-dashboard1/user-profile/" + user.contact_id);
          }
        }
      //    else if(parseInt(user?.user_type) > 1 && user.is_admin == true){

      //  } 
       else {
          navigate("/dashboard");
        }
        setLoading(false);
        return;
      } else {
        setFormMsg({ type: false, msg: result?.msg });
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    setFormMsg({ type: false, msg: "Something Went Wrong Please Try Again" });
  };

  React.useEffect(() => {
    getIp();
  }, []);

  return (
    <>
      <div className="container" id="login-container">
        <div className="row">
          <div className="col-12 mx-auto my-auto mt-4  box-shadow p-4 border-lightgray">
            <h4 className="text-center text-bold">Welcome To Ross Suite</h4>
            <Form onSubmit={HandleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Username"
                  name="username"
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                />
              </Form.Group>

              <MessageHandler
                status={FormMsg.type}
                msg={FormMsg.msg}
                HandleMessage={setFormMsg}
              />

              <div className="d-flex footer-btns">
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Link to="/forgot-password" className="nav-link">
                    Forgot Password?
                  </Link>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Submit"}
                </Button>
              </div>

              {/* create account button */}
              <p className="text-center mt-4">
                Don't have an account?{" "}
                <span
                  className="link"
                  onClick={(e) => {
                    navigate("/user-self-registration", {
                      state: {
                        classId: location?.state?.classId,
                      },
                    });
                  }}
                >
                  Click here
                </span>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
