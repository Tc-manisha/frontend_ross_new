<tr key={Pindex}>
{(allPads.is_spare == 0 && allPads.is_pediatric == 0)&& (<>
    <td>main</td>
    <td>{allPads?.pad_type_id}</td>
    <td>{allPads?.pad_expiration ? new Date(allPads.pad_expiration).toLocaleDateString('en-US') : ""}</td>
    <td>{allPads?.pad_lot}</td>
    <td>{allPads?.pad_udi}</td>
    <td>
        <div style={{display:"flex",flexDirection:"row",columnGap:"5%",alignItems:"center"}}>
        <img src={Activitycheck} alt='Activitycheck' height={30} width={30} />
        <img src={Minus} alt='Minus' height={20} width={30} style={{cursor:"pointer"}} onClick={() => handleRemoveMainPadRow(index)} />
        </div>
    </td>
  </>  )} 
</tr>  
<tr key={Pindex}>
    {(allPads.is_spare == 1 && allPads.is_pediatric == 0)&& (<>
    <td>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        Spare
        <img src={KingTaz} marginTop={10} onClick={()=> handleMoveSpareToMainPadRow(index)}/>
      </div>
    </td>
    <td>{allPads?.pad_type_id}</td>
    <td>{allPads?.pad_expiration ? new Date(allPads.pad_expiration).toLocaleDateString('en-US') : ""}</td>
    <td>{allPads?.pad_lot}</td>
    <td>{allPads?.pad_udi}</td>
    <td>
        <div style={{display:"flex",flexDirection:"row",columnGap:"5%",alignItems:"center"}}>
        <img src={Activitycheck} alt='Activitycheck' height={30} width={30}  />
        <img src={Minus} alt='Minus' height={20} width={30} style={{cursor:"pointer"}} onClick={() => handleRemoveSparePadRow(index)} />
        </div>
    </td>
 </> )} 
</tr> 
<tr key={Pindex}>
{(allPads.is_spare == 0 && allPads.is_pediatric == 1) && (<>
    <td>Pediatric</td>
    <td>{allPads?.pad_type_id}</td>
    <td>{allPads?.pad_expiration ? new Date(allPads.pad_expiration).toLocaleDateString('en-US') : ""}</td>
    <td>{allPads?.pad_lot}</td>
    <td>{allPads?.pad_udi}</td>
    <td>
        <div style={{display:"flex",flexDirection:"row",columnGap:"5%",alignItems:"center"}}>
        <img src={Activitycheck} alt='Activitycheck' height={30} width={30} />
        <img src={Minus} alt='Minus' height={20} width={30}  style={{cursor:"pointer"}} onClick={() => handleRemoveMainPadPadiatricRow(index)} />
        </div>
    </td>
</>)} 
</tr>
<tr key={Pindex}>
{(allPads.is_spare == 1 && allPads.is_pediatric == 1) && (<>
    <td>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        Spare Pediatric
       </div>
    </td>
    <td>{allPads?.pad_type_id}</td>
    <td>{allPads?.pad_expiration ? new Date(allPads.pad_expiration).toLocaleDateString('en-US') : ""}</td>
    <td>{allPads?.pad_lot}</td>
    <td>{allPads?.pad_udi}</td>
    <td>
        <div style={{display:"flex",flexDirection:"row",columnGap:"5%",alignItems:"center"}}>
        <img src={Activitycheck} alt='Activitycheck' height={30} width={30} />
        <img src={Minus} alt='Minus' height={20} width={30}  style={{cursor:"pointer"}} onClick={()=> handleRemoveSparePadiatricPadRow(index)} />
        </div>
    </td>
</>)} </tr>
</>))}
{showAdditionalPadsRows && (<>
 {Array.from({ length: additionalPadRows }).map((_, rowPadIndex) => (
 <tr key={rowPadIndex}>
    <td>
   <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center",position: 'relative' }}>
    <select
      value={selectedPadiatricValue}
      className={"form-control"}
      onChange={handlePadSelectChange}
      style={{width:"150px"}}
    >
      {/* <option value="">--Select One--</option> */}
      <option value="Main">Main</option>
      <option value="Spare">Spare</option>
      <option value="Pediatric">Pediatric</option>
    </select>
    <MdOutlineArrowDropDown style={{ position: 'absolute',width:"50px",height:"35px", right: '-4px'  }} />
  </div>
    </td>
    <td></td>
    <td>
    <div className={'d-flex align-items-center calendar-input-btn' }>
          <LocalizationProvider dateAdapter={AdapterDayjs} >
           <Stack spacing={3} >
             <DesktopDatePicker
               label=""
               // inputFormat="HH:mm:ss"
               components={{
                 OpenPickerIcon: calendarIcon,
               }}
               // minDate={new Date()}
               value={""}
               // onChange={(newValue) => handleCalendarChange(newValue, 'contractStart')}
               renderInput={(params) => <TextField className='form-control' {...params} error={false} 
               />}
               // isInvalid={formData.contractStart === ''}
               required
            />
           </Stack>
         </LocalizationProvider>
         </div> 
      </td>
    <td>
    <Form.Group className={"col"}>
{/* <Form.Label>Contract #</Form.Label> */}
<Form.Control
type="text"
name="contractNumber"
// value={formData.contractNumber}
// onChange={(e)=>handleChange(e, 'contractNumber')}
/>
</Form.Group>
    </td>
    <td>
    <Form.Group className={"col"}>
{/* <Form.Label>Contract #</Form.Label> */}
<Form.Control
type="text"
name="contractNumber"
// value={formData.contractNumber}
// onChange={(e)=>handleChange(e, 'contractNumber')}
/>
</Form.Group>
    </td>
    <td>
        <div style={{display:"flex",flexDirection:"row",columnGap:"5%",alignItems:"center"}}>
        <img src={InventoryIcon} alt='Activitycheck' height={30} width={30} />
        <img src={Minus} alt='Minus' height={20} width={30} style={{cursor:"pointer"}}  />
        </div>
    </td>
</tr>
 ))}
</>)}