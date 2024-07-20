import DoneIcon from "@mui/icons-material/Done";
import LockIcon from "@mui/icons-material/Lock";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";

export const RenderEqupment = (e) => {
  // console.log("e data", e);
  return (
    <>
      {e?.isAED ? <DoneIcon color="success" /> : <CloseIcon color="error" />}
      / <CloseIcon color="error" />
    </>
  );
};

export const RenderTraining = (e) => {
  return (
    <>
      {e?.isTraining ? (
        <DoneIcon color="success" />
      ) : (
        <CloseIcon color="error" />
      )}
    </>
  );
};

export const RenderSecure = (account) => {
  return (
    <>{account?.isSecure == 1 ? <LockIcon /> : <CloseIcon color="error" />}</>
  );
};

export const SortObj = (a, b) => {
  if (a.last_nom < b.last_nom) {
    return -1;
  }
  if (a.last_nom > b.last_nom) {
    return 1;
  }
  return 0;
};

export const DynamicSort = (property) => {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
};

export const RenderAccTitle = (data) => {};

// "Account : " +

export const DateFormate = "MM/DD/YYYY"; // HH:MM:SS

export const DefaultDateForm = (date) => {
  let dateNew = moment(date).format(DateFormate);
  return dateNew != "Invalid Date" ? dateNew : "";
};
