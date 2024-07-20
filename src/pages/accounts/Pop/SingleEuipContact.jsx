import React from 'react'

function SingleEuipContact({inx,it,removeList,handleRemoveCheck,name,checked}) {
  return (
      <b key={inx}>
        <label htmlFor={name+`${it?.contact_id}`} className="mx-1"> 
        <input 
            type={'checkbox'} 
            name={`Name_${name}${it?.contact_id}`}
            id={name+`${it?.contact_id}`}
            className='check'
            checked={checked}
            value={it?.contact_id}
            onChange={(e)=>handleRemoveCheck(e,name)}
            />
            &nbsp;
            <span>{it?.contact_name}</span>    
        </label>
        </b>
  )
}

export default SingleEuipContact