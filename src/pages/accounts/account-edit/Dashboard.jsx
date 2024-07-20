import React, { useEffect, useState } from 'react'
import SubHeading from '../../../components/header/SubHeading'
import Loading from "../Loading";
import { useNavigate } from 'react-router-dom';
import { DecryptToken } from '../../../helper/BasicFn';
import CircularLoadingComp from '../../../userPages/userComp/CircularLoadingComp';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(true)
  const navigate = useNavigate();

  const handleClick = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/accounts-listing');
    }, 500)
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading2(false);
    }, 1000);
  }, []);

  const token = DecryptToken();

  return (
    <>
      {
        loading2 ?
          <><CircularLoadingComp /></>
          :
          <>
            <div className='mt-4' style={{ paddingInline: "45px" }}>

              <SubHeading
                hideNew={true}
                hideHierarchy={true}
                title={"Dashboard"}
                newUrl="/new-account"
                subHeading={true}
              />

              <div className="text-center py-5" style={{ minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button className='btn btn-primary' onClick={handleClick}>
                  Go to Account Listings
                </button>
              </div>

              {loading && (
                <>
                  <div className="showloading">
                    <Loading />
                  </div>
                </>
              )}
            </div>
          </>
      }
    </>
  )
}
