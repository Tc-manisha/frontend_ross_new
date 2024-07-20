import React from 'react'
import NewNote from '../../pages/accounts/notes/NewNote'

const  UserNewNotes = ()=>{
  return (
    <>
        <div className="mt-4" style={ { width: "100%", paddingInline: "45px" } }>
          <NewNote is_user={true} />
        </div>
    </>
  )
}

export default UserNewNotes