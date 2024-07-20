import { CallGETAPINEW,CallGETAPI,CallGETAPI2,CallPOSTAPI } from "./API";
export const FetchContactName = async (id)=>{
    let res = await CallGETAPINEW(`account/get-contact-data/${id}`);
    if(res?.status){
        return res?.data;
    }
    return  false;
}