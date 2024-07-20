import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clickOnTitle, removeLastItem, updateTab } from "../redux/slices/BreadCrumbsSlice";
import { setSiteActiveTab } from "../redux/slices/TabSlice";

const BreadCrumbs = ( ) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const breadcrumbs = useSelector(state => state.BreadCrumbs.items);
  console.log(breadcrumbs);

  // React.useEffect(() => {

  // },[breadcrumbs])

  const handleClick = (index) => {
    console.log(index+1);
    if (breadcrumbs[index+1]?.title === "Accounts") {
      
      // If the clicked title is "Accounts", navigate to the second index object path
      dispatch(removeItemsFromIndex(breadcrumbs, index + 1));
      const updateb = dispatch(updateTab({ index: index+1, tab: "Details" }));
      console.log({updateb})
      console.log(breadcrumbs[1])
      const tabState = dispatch(setSiteActiveTab("Details"));
      console.log({tabState})
     navigate(breadcrumbs[1].path);
    } else {
      // Dispatch action to remove items from index to end
      dispatch(removeItemsFromIndex(breadcrumbs, index + 1));
    }
  };

  const removeItemsFromIndex = (breadcrumbs, index) => {
    console.log({index})
    return (dispatch) => {
      const items = breadcrumbs?.slice(0, index);
      const newBreadcrumbs = items;
      console.log(newBreadcrumbs)
      const clickDispatch = dispatch(clickOnTitle(newBreadcrumbs));
      console.log({clickDispatch})
      const lastIndexPath = newBreadcrumbs[newBreadcrumbs?.length - 1].path;
      console.log({lastIndexPath})
      if (lastIndexPath) {
        navigate(lastIndexPath);
      }
    };
  };

  var excludedBreadCrumbs = "";
  if (breadcrumbs?.length > 1) {
    excludedBreadCrumbs = breadcrumbs.slice(1);
    console.log({excludedBreadCrumbs})
  }

  return (
    <>
      {excludedBreadCrumbs &&
        excludedBreadCrumbs.map((breadcrumb, index) => (
          <span key={index}>
            <span
              className="link"
              onClick={() => handleClick(index)}
            >
              {breadcrumb.title}
            </span>
            {breadcrumb?.tab ? " > " : ""}
          </span>
        ))}

      {/* Display the title of the last index as plain text */}
      {breadcrumbs && breadcrumbs.length == 1 && (
        <span
          className="link"
        >
          {breadcrumbs[0].title}
        </span>
      )}

      {/* Display the ">" icon after the last index title */}
      {breadcrumbs && breadcrumbs.length == 1 && (
        <span> {breadcrumbs[0].tab ? ">" : ""} </span>
      )}

      {/* Display the tab of the last index object if it exists */}
      {breadcrumbs?.[breadcrumbs.length - 1]?.tab && (
        <span>{breadcrumbs[breadcrumbs.length - 1].tab}</span>
      )}
    </>
  );
};

export default BreadCrumbs;
