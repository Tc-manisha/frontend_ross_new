import React,{useState,useEffect} from 'react';
import { CallPOSTAPI } from '../../helper/API';

import { useNavigate } from 'react-router-dom';
import MessageHandler from '../../components/common/MessageHandler';
import { FetchIP, getIpAddress } from '../../helper/BasicFn';

export default function ForgotPassword() {

    const navigate             = useNavigate();
    const [FormMsg,setFormMsg] = React.useState({type:true,msg:""});
    const [loading,setLoading] = React.useState(false);
    const [email,setemaill] = useState('');
    const [IpData,setIpData] = useState({});
    const fetchData = async ()=>{
        let result = await getIpAddress();
        if(result){
            setIpData(result);
        }
    }
  const HandleSubmit = async (e)=>{
    e.preventDefault();
    setLoading(true);
    if(!email){
        setFormMsg({type:false,msg:'Please Fill Email'})
        setLoading(false)
        return;
    }

    let obj     = {"email":email};
    let result  = await CallPOSTAPI('auth/forgot-password',obj)
    setFormMsg({type:result?.data?.status,msg:result?.data?.msg})
    setLoading(false)
  }

  useEffect(()=>{
    fetchData();
  },[])
  return (
    <>
    <div className='container base-container ' id="forgot-password" onSubmit={HandleSubmit} >
        <form className='border box-shadow m-4 p-4' id="forgot-password-from" >
            <label htmlFor='forgot_password mb-2' >Enter Email</label>
            <input type="email" name="email" className='form-control mt-2' placeholder='Enter Your Registered Email...' 
                value={email} onChange={(e)=>setemaill(e.target.value)}
                id="forgot_password"
            />
            <br/>
            <MessageHandler status={FormMsg.type} msg={FormMsg.msg} HandleMessage={setFormMsg} />
            <br/>

            <button type="submit" className='btn btn-primary mt-2 ml-auto   '
                style={{float:'right'}}
            >{loading ? "Loading..." : "Send"}</button>
        </form>
    </div>
    </>
  )
}
