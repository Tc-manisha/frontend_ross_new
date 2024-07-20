import React, { useEffect, useState } from 'react';

export default function MessageHandler({ status, msg, HandleMessage })
{

    if (!msg)
    {
        return "";
    }

    const [ showMsg, setShowMsg ] = useState(true);
    useEffect(() =>
    {
        setTimeout(() =>
        {
            setShowMsg(false)
            HandleMessage({ type: false, msg: '' })
        }, 5000);
    }, [ msg, status ])

    return (

        <>
            { showMsg && <>
                { status ?
                    <div className='alert alert-success success-msg' >
                        { msg }
                    </div>
                    :
                    <div className='alert alert-danger error-msg' >
                        { msg }
                    </div>
                }
            </> }
        </>
    )
}
