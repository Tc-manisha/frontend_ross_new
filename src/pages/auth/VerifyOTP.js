import React, { useState, useEffect } from "react";
import { CallGETAPI, CallPOSTAPI } from "../../helper/API";
import Form from "react-bootstrap/Form";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import MessageHandler from "../../components/common/MessageHandler";
import { FetchIP, getIpAddress, PasswordRGX } from "../../helper/BasicFn";
import { getPermission, setPermission } from "../../helper/Common";

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const [FormMsg, setFormMsg] = React.useState({ type: true, msg: "" });
  const [loading, setLoading] = React.useState(false);
  const [IpData, setIpData] = useState({});

  const fetchData = async () => {
    let result = await getIpAddress();
    if (result) {
      setIpData(result);
    }
  };
  const HandleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let userOTP = e.target.OTP.value;

    if (!userOTP) {
      setFormMsg({ type: false, msg: "Please Fill OTP" });
      setLoading(false);
      return;
    }

    if (userOTP.length != 6) {
      setFormMsg({ type: false, msg: "It has to be 6 digits" });
      setLoading(false);
      return;
    }
    let obj = { verification_otp: userOTP };
    // let result = await CallPOSTAPI('auth/verify-otp', obj);
    let result = await CallPOSTAPI("auth/verify-otp/v2", obj);

    if (result?.data?.status) {
      let token = result?.data?.token;
      let rtoken = result?.data?.refreshtoken;
      sessionStorage.setItem("ross_token", token);
      sessionStorage.setItem("ross_rtoken", rtoken);

      localStorage.setItem("ross_token", token);
      const type = location?.state?.type;
      const isAssign = location?.state?.isAssign;
      const isLogin = location?.state?.isLogin;

      var base64Url = token.split(".")[1];
      var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      let jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const newJsonPayload = JSON.parse(jsonPayload);

      if (jsonPayload?.is_admin && jsonPayload?.user_type == 2) {
        response = await CallGETAPI("auth/switch-admin");
        let permission = response?.data?.permission;
        setPermission(permission);
      } else {
        let response = await CallGETAPI("auth/priviledge");
        let permission = response?.data?.permission;
        setPermission(permission);
      }

      const permission = getPermission();

      if (isLogin) {
        if (parseInt(newJsonPayload?.user_type) > 1) {
          if (newJsonPayload?.is_edit == true) {
            if (permission?.length > 0) {
              permission.includes("dashboard")
                ? navigate("/user-dashboard1")
                : permission.includes("site-tab")
                ? navigate("/user-listing/sites")
                : permission.includes("contact-tab")
                ? navigate("/user-listing/contacts")
                : permission.includes("equipment-tab")
                ? navigate("/user-listing/equipment")
                : permission.includes("notes-tab")
                ? navigate("/user-listing/notes")
                : permission.includes("support-tab")
                ? navigate("/user-listing/support")
                : //   permission.includes("account-details") ?
                  navigate("/user/Details");
            } else {
              navigate(
                "/user-dashboard1/user-profile/" + newJsonPayload?.contact_id
              );
            }
          } else {
            navigate(
              "/user-dashboard1/user-profile/" + newJsonPayload?.contact_id
            );
          }
        } else {
          navigate("/dashboard");
        }
      } else {
        if (!isAssign) {
          navigate("/user-class-registration", {
            state: {
              classId: location?.state?.classId,
            },
          });
        } else if (type == "studentSignup") {
          navigate("/user-class-registration", {
            state: {
              classId: location?.state?.classId,
            },
          });
        } else {
          navigate("/dashboard");
        }
      }
      setLoading(false);
      return;
    }
    setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
    setLoading(false);
    document.getElementById("forgot-password-from").reset();
  };

  return (
    <>
      <div className="container base-container " id="forgot-password">
        <form
          className="border box-shadow m-4 p-4"
          id="forgot-password-from"
          onSubmit={HandleSubmit}
        >
          <h4>Enter OTP</h4>

          {location?.state?.message && (
            <div className="alert alert-success">
              {location?.state?.message}
            </div>
          )}

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>OTP </Form.Label>
            <Form.Control type="number" placeholder="Enter OTP" name="OTP" />
          </Form.Group>

          <br />
          <MessageHandler
            status={FormMsg.type}
            msg={FormMsg.msg}
            HandleMessage={setFormMsg}
          />
          <br />

          <button
            type="submit"
            className="btn btn-primary mt-2 ml-auto   "
            style={{ float: "right" }}
          >
            {loading ? "Loading..." : "Submit"}
          </button>

          <Link to="/" className="text-primary">
            Go To Login
          </Link>
        </form>
      </div>
    </>
  );
}
