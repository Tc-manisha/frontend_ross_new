// import React from 'react';

import UserDashboard from "../userPages/UserDashboard";

// function UserRoutes({layoutWrapper,setShowSidebar}) {
//   return (
//     <>
//         <Route
//             path="/account/:accountId/email/:emailId"
//             element={ layoutWrapper(
//                 <UserDashboard setShowSidebar={ setShowSidebar } />,
//                 "User Dashboard"
//             ) }
//         />
//     </>
//   )
// }
const UserRoutes = [
    {
        path: '/user-dashboard',
        eletemt: <UserDashboard/>
    }
];
export default  UserRoutes   

