import React,{useState} from 'react'

export default function DymmyMultiForm({altTrainerForm,setAltTrainerForm}) {

    const [data, setData] = useState([
        {
          id:   1,
          name: 'john',
          gender: 'm'
        },
        {
          id:   2,
          name: 'mary',
          gender: 'f'
        }
      ]);
      
      const updateFieldChanged = index => e => {
        let newArr = [...altTrainerForm]; // copying the old datas array
        // a deep copy is not needed as we are overriding the whole object below, and not setting a property of it. this does not mutate the state.
        newArr[index][e.target.name] = e.target.value; // replace e.target.value with whatever you want to change it to
        setAltTrainerForm(newArr);
      }

  return (
    <>
     {altTrainerForm.map((datum, index) => (
      <li key={index}>
        <input type="text" name="phone_number" value={datum.phone_number} onChange={updateFieldChanged(index)}  />
        <input type="text" name="ext" value={datum.ext} onChange={updateFieldChanged(index)}  />
        <input type="text" name="phone_type_id" value={datum.phone_type_id} onChange={updateFieldChanged(index)}  />
      </li>
    ))}
    </>
  )
}
