import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { DecryptToken } from "../../helper/BasicFn";
import { GetProfile, getPermission, setPermission } from "../../helper/Common";
import { CallGETAPI } from "../../helper/API";

export default function PermissionDeniedPage({ setLoading }) {
  const user = DecryptToken();
  const privilege = getPermission();
  const userData = GetProfile();

  const navigate = useNavigate();

  const deniedDivStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "70vh",
    flexDirection: "column",
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSwitchSubAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await CallGETAPI("auth/switch-admin");
    console.log({res})
    if(res?.data?.status){
    let token = res?.data?.token;
    let refresh_token = res?.data?.refreshtoken;
    if (!token) {
      return;
    }
    sessionStorage.setItem("ross_token", token);
    sessionStorage.setItem("ross_rtoken", refresh_token);
    localStorage.setItem("ross_token", token);
    localStorage.setItem("ross_rtoken", refresh_token);
    const permission = res?.data?.permission;
    setPermission(permission);
    // toast.error(res?.data?.msg)
    const redirectSubAdmin = permission?.includes("dashboard")
      ? "/dashboard"
      : "";
    navigate(redirectSubAdmin);
  }
    // } else {
    //   toast.error(res?.data?.msg);
    // }
    setLoading(false);
  };

  return (
    <div style={deniedDivStyle}>
      {(user?.user_type != 2 && privilege?.length < 1) && (<>
      <h2 style={{ margin: 0, padding: 0 }}>404 Permission denied!</h2>
      <Button style={{ marginTop: "1%", border: "none" }} onClick={handleBack}>
        Back
      </Button>
      </>)}

      {user?.user_type == 2 && userData?.sub_admin != "Work as an Admin" && (
        <Button
          style={{ marginTop: "1%", border: "none" }}
          onClick={(e) => handleSwitchSubAdmin(e)}
        >
          Switch as an Admin
        </Button>
      )}
    </div>
  );
}
