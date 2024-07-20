import { CallGETAPI } from "./API";
import { DecryptToken } from "./BasicFn";
import { getPermission } from "./Common";

const user = DecryptToken();
const accountId = user?.account_id;
const permission = getPermission();

const allPermissions = [
    {permission: "dashboard", link: "/user-dashboard1"},
    {permission: "accounts-listing", link: "/accounts-listing"},
    {permission: "account-details", link: "/account-details/:"},
    {permission: "account-edit", link: ""},
    {permission: "site-tab", link: ""},
    {permission: "sites-new", link: ""},
    {permission: "site-details", link: ""},
    {permission: "site-details-edit", link: ""},
    {permission: "contact-tab", link: ""},
    {permission: "contacts-new", link: ""},
    {permission: "contact-details", link: ""},
    {permission: "contact-details-edit", link: ""},
    {permission: "equipment-tab", link: ""},
    {permission: "new-aed", link: ""},
    {permission: "aed-details", link: ""},
    {permission: "aed-edit", link: ""},
    {permission: "move-aed", link: ""},
    {permission: "assign-aed", link: ""},
    {permission: "new-accessories", link: ""},
    {permission: "move-accessory", link: ""},
    {permission: "new-aed-checks", link: ""},
    {permission: "aed-check-details", link: ""},
    {permission: "aed-service-check", link: ""},
    {permission: "service-check-details", link: ""},
    {permission: "training-tab", link: ""},
    {permission: "training-new", link: ""},
    {permission: "training-details", link: ""},
    {permission: "edit-training", link: ""},
    {permission: "inperson-tab", link: ""},
    {permission: "new-inperson", link: ""},
    {permission: "inperson-details", link: ""},
    {permission: "edit-inperson", link: ""},
    {permission: "pops-tab", link: ""},
    {permission: "new-pop", link: ""},
    {permission: "pop-details", link: ""},
    {permission: "pop-edit", link: ""},
    {permission: "notes-tab", link: ""},
    {permission: "new-note", link: ""},
    {permission: "note-details", link: ""},
    {permission: "edit-note", link: ""},
    {permission: "email-tab", link: ""},
    {permission: "support-tab", link: ""},
    {permission: "new-support", link: ""},
    {permission: "support-details", link: ""},
    {permission: "edit-support", link: ""},
    {permission: "documents-tab", link: ""},
    {permission: "new-document", link: ""},
    {permission: "document-details", link: ""},
    {permission: "edit-document", link: ""},
    {permission: "rfi-tab", link: ""},
    {permission: "new-rfi", link: ""},
    {permission: "rfi-details", link: ""},
    {permission: "edit-rfi", link: ""},
    {permission: "out-of-service", link: ""},
    {permission: "support-respond", link: ""},
    {permission: "support-reassign", link: ""},
    {permission: "support-close", link: ""},
    {permission: "pop-clone", link: ""},
    {permission: "inperson-clone", link: ""},
    {permission: "inperson-student-tab", link: ""},
    {permission: "inperson-certification-tab", link: ""},
    {permission: "inperson-instructor", link: ""},
    {permission: "inperson-broadcast", link: ""},
    {permission: "switch-user", link: ""}
];


export const isSiteDetails = ()=>{
    const privilege = getPermission();
    const permissionArray = privilege.split(",");
    let hasPermission = 0;
    for (let i = 0; i < permissionArray?.length; i++) {
        const permission = permissionArray[i];
        if(permission==='site-details'){
            hasPermission = 1;
        }
    }
    return hasPermission;
}

export const isSubAdminPermission = (subAdminPermission)=>{
    const user = DecryptToken();
    const privilege = getPermission();
    const permissionArray = privilege.split(",");
    let hasPermission = 0;
    for (let i = 0; i < permissionArray.length; i++) {
        const permission = permissionArray[i];
        if(Number(user?.user_type === 0) || (Number(user?.user_type === 2) && permission === subAdminPermission  && user?.sub_admin != "")){
            hasPermission = 1;
        }
    }
    return hasPermission;
}

export const isUserPermission = (UserPermission)=>{
    const user = DecryptToken();
    const privilege = getPermission();
    const permissionArray = privilege?.split(",");
    let hasPermission = 0;
    for (let i = 0; i < permissionArray?.length; i++) {
        const permission = permissionArray[i];
        if(permission ===UserPermission && Number(user?.user_type ) === 3){
            hasPermission = 1;
        }
    }
    return hasPermission;
}

export const isPermission = (UserPermission)=>{
    const user = DecryptToken();
    const privilege = getPermission();
    const permissionArray = privilege?.split(",");
    let hasPermission = 0;
    if(Number(user?.user_type ) === 0){
        return 1;
    }
    for (let i = 0; i < permissionArray?.length; i++) {
        const permission = permissionArray[i];
        if(permission ===UserPermission && Number(user?.user_type ) === 3){
            hasPermission = 1;
        }
    }
    return hasPermission;   
}
export const isContactPermission = (PermissionType)=>{
    const user = DecryptToken();
    const privilege = getPermission();
    const permissionArray = privilege?.split(",");
    let hasPermission = 0;
    if(Number(user?.user_type ) === 0){
        return 1;
    }
    for (let i = 0; i < permissionArray?.length; i++) {
        const permission = permissionArray[i];
        if(permission ===PermissionType && Number(user?.user_type ) === 3){
            hasPermission = 1;
        }
    }
    return hasPermission;   
}

// ---- for click on link ---- //
export const linkTabsPermission = (userPermission) => {
    const user = DecryptToken();
    const privilege = getPermission();
    const permissionArray = privilege?.split(",");

    if (Number(user?.user_type) !== 3 && ((Number(user?.user_type) !== 2) && user?.sub_admin == "") && (Number(user?.user_type) !== 0)) {
        return 0;
    }
        console.log({permissionArray})
    let hasPermission = 0;
    if(permissionArray?.length < 1){ 
    for (let i = 0; i < userPermission?.length; i++) {
        for (let j = 0; j < permissionArray?.length; j++) {
            console.log(userPermission[i])
            // console.log(permissionArray[j])
            if (userPermission[i] === permissionArray[j]) {
                hasPermission = 1;
                break;
            }
        }
        if (hasPermission === 1) {
            break;
        }
    } 
    } else {
        hasPermission = 1;
    }

    return hasPermission;
}

export const handleAccount = async () => {
    const userData = DecryptToken();
    try {
        const accountsData = await CallGETAPI("user/user-account-list-v1");

        const accountList = accountsData?.data?.data?.accountlist;
        const multipleAccount = accountList && accountList.length > 0;

        if (userData?.user_type === 0) {
            return "/accounts-listing";
        }

        if (multipleAccount) {
            return "/user-listing/account";
        }

        const accountId = userData?.account_id;
        const permissionPaths = {
            "account-details": `/user/Details/${accountId}`,
            "site-tab": `/user/Sites/${accountId}`,
            "contact-tab": `/user/Contacts/${accountId}`,
            "equipment-tab": `/user/Equipment/${accountId}`,
            "notes-tab": `/user/Notes/${accountId}`,
            "support-tab": `/user/Support/${accountId}`,
            "training-tab": `/user/Training/${accountId}`,
            "email-tab": `/user/Emails/${accountId}`,
            "documents-tab": `/user/Documents/${accountId}`,
            "rfi-tab": `/user/RFI/${accountId}`
        };

        for (const permission of Object.keys(permissionPaths)) {
            if (permission.includes(permission)) {
                return permissionPaths[permission];
            }
        }

        return "";

    } catch (error) {
        console.error("Error fetching accounts data:", error);
    }
};

