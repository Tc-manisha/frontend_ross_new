import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router';
import AccountSiteEditForm from '../../components/forms/AccountSiteEditForm'
import { FetchAccountSiteDetails } from '../../helper/BasicFn';
import Loading from '../accounts/Loading';

function AccountSiteEdit() {
  const { siteId } = useParams();  
  const [siteData, setSiteData] = useState([])
  const [showLoading, setShowLoading] = React.useState(true);
  const [billingData, setBillingData] = useState("")
  const [shippingData, setShippingData] = useState("")
  const [traningData, setTraningData] = useState("")
  const [coordinatorData, setCoordinatorData] = useState("")

  const fetchOnLoad = async() => {
    let data = await FetchAccountSiteDetails(siteId);
        if(data){
            // setAccountData(data);
            let allSiteData = data
            allSiteData.siteData.site_name_toggle = (allSiteData?.siteData?.site_name_toggle == 0 || !allSiteData?.siteData?.site_name_toggle) ? false : true
            setSiteData(allSiteData?.siteData)
            setBillingData(allSiteData?.billingData)
            setShippingData(allSiteData?.shippingData)
            // setTraningData(data?.traningData)
            setCoordinatorData(allSiteData?.cordinatorInformation)
        }

      setShowLoading(false);  
  }

  useEffect(()=>{
    fetchOnLoad();
  },[])

  return (
    <>
        {/* loading */}
        {showLoading ? 
            <>
                <div className="showloading">
                    <Loading />
                </div>
            </>
            :
            <>
                <div className='' >
                    {siteData ? 
                        <AccountSiteEditForm EditsiteData={siteData} EditbillingData={billingData} EditshippingData={shippingData} EdittraningData={traningData} EditcoordinatorData={coordinatorData} />
                    :""}
                </div>
            
            </>
        }
    </>
  )
}

export default AccountSiteEdit;