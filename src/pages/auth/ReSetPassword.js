// import React,{useState,useEffect} from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// export default function ReSetPassword() {
//   const navigate     = useNavigate();
//   const searchParams = useSearchParams();
//   const token        = searchParams.get('token')

//   return (
//     <>

//     </>
//   )
// }


import React,{useState,useEffect} from 'react';
import { CallPOSTAPI } from '../../helper/API';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import MessageHandler from '../../components/common/MessageHandler';
import { FetchIP, getIpAddress, PasswordRGX } from '../../helper/BasicFn';

export default function ForgotPassword() {

    const navigate             = useNavigate();
    const [searchParams] = useSearchParams();
    // const searchParams         = useSearchParams();
    const token                = searchParams.get('token')
    const [FormMsg,setFormMsg] = React.useState({type:true,msg:""});
    const [loading,setLoading] = React.useState(false);
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
    let password = e.target.new_password.value;
    let c_password = e.target.c_new_password.value;
    

    if(!password){
      setFormMsg({type:false,msg:'Please Fill Password'})
      setLoading(false)
      return;
  }

  if(password.length < 8){
    setFormMsg({type:false,msg:'Password Length Must Be More Then 8 Character'})
    setLoading(false)
    return;
}

    if(!c_password){
        setFormMsg({type:false,msg:'Please Fill Confirm Password'})
        setLoading(false)
        return;
    }

    if(!PasswordRGX.test(password)){
      setPasswordMsg('Please Use Strong Password')
      return;
    }

    if(password!==c_password){
      setFormMsg({type:false,msg:'New Password And Confirm Password Does Not Matched'})
      setLoading(false)
      return;
    } 

    let obj     = {"password":password};
    let result  = await CallPOSTAPI('auth/reset-password?token='+token,obj);

    setFormMsg({type:result?.data?.status,msg:result?.data?.msg})

    setTimeout(()=>{
      navigate('/');
    },30000)

    setLoading(false)
    document.getElementById("forgot-password-from").reset();

    // e.resetForm();

  }

  const [passwordMsg,setPasswordMsg] = useState('');
  const HandlePassword = (e)=>{
    if(!PasswordRGX.test(e.target.value)){
      setPasswordMsg('Please Use Strong Password')
      return;
    }
    setPasswordMsg('')
  }

  useEffect(()=>{
    fetchData();
  },[])

  const StrongPwdList = [
    "8 characters minimum",
    "1 special character",
    "1 Uppercase",
    "1 Lowercase",
    "1 Number",
  ]
  return (
    <>
    <div className='container base-container ' id="forgot-password"  >
        <form className='border box-shadow m-4 p-4' id="forgot-password-from" onSubmit={HandleSubmit} >

            <h4>Update Your Password</h4>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>New Password </Form.Label>
                <Form.Control type="password" placeholder="New Password"  name="new_password"  
                  onChange={HandlePassword}
                />

                  {passwordMsg && <>
                    <div className='text-danger my-2' >{passwordMsg}</div>

                    <div className='mt-2' >
                      <ul>
                        {StrongPwdList.map((single)=>(
                          <li>{single}</li>
                          ))}
                      </ul>
                    </div>
                  </>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control type="password" placeholder="Confim New Password"  name="c_new_password"  />
            </Form.Group>


            <br/>
              <MessageHandler status={FormMsg.type} msg={FormMsg.msg} HandleMessage={setFormMsg} />
            <br/>

            <button type="submit" className='btn btn-primary mt-2 ml-auto   '
                style={{float:'right'}}
            >{loading ? "Loading..." : "Send"}</button>

            <Link to="/" className='text-primary'>Go To Login</Link>
        </form>
    </div>
    </>
  )
}
