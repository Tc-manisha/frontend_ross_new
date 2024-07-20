import React from 'react'
import CommonDatePicker from '../../common/date-picker/CommonDatePicker';
import BatteryComp from './sub-comp/BatteryComp';
import { CheckADTable, HandleUnknow } from '../../../helper/BasicFn';
import { FormatDate } from '../../../helper/Common';
import moment from 'moment';
import ActionsComp from './sub-comp/ActionsComp';


const MenufectureDate = ({ is_unknowntrue, crrFormData, handleDateChange }) => {
    return (
        <>

            <div className='col-3 form-group' >
                <label htmlFor="">Manufactured Date</label>
                <CommonDatePicker
                    disabled={is_unknowntrue}
                    calName={'manufactured_date'}
                    CalVal={crrFormData?.manufactured_date}
                    HandleChange={handleDateChange}
                />
            </div>
        </>
    )
}


const InstallBeforeDateComp = ({ is_unknowntrue, crrFormData, handleDateChange }) => {
    return (
        <>

            <div className='col form-group' style={{ maxWidth: "300px" }} >
                <label htmlFor="">Installed Before Date</label>
                <CommonDatePicker
                    disabled={is_unknowntrue}
                    calName={'install_before_date'}
                    CalVal={crrFormData?.install_before_date}
                    HandleChange={handleDateChange}
                />
            </div>
        </>
    )
}

const BatteryExpiery = ({ is_unknowntrue, crrFormData, handleDateChange }) => {
    return (
        <>
            <div className='col form-group' >
                <label htmlFor="">Battery Expiration</label>

                <CommonDatePicker
                    disabled={is_unknowntrue}
                    calName={'battery_expiration'}
                    CalVal={crrFormData?.battery_expiration}
                    HandleChange={handleDateChange}
                />

            </div>
        </>
    )
}

const InstalledDate = ({ is_unknowntrue, crrFormData, handleDateChange }) => {
    return (<>

        <div className='col-3 form-group' >
            <label htmlFor="">Installed Date</label>
            <CommonDatePicker
                disabled={is_unknowntrue}
                calName={'date_installed'}
                CalVal={crrFormData?.install_date}
                HandleChange={handleDateChange}
            />
        </div>
    </>)
}

function SpareBatteryinformation({
    keyName,
    crrIndex,
    formData,
    setFormData,
    crrFormData,
    Permissins,
    bettery_type,
    BatteryList,
    is_unknowntrue,
    batteryInfo,
    batteryIndex,
    RenderDate,
    print_battery_part,
    is_spare_manu = 0,
    DataValue,
    unKnownToggleKey
}) {
    const handleInputChange = (e) => {
        let index = crrIndex;
        let name = e.target.name;
        let val = e.target.value;
        const oldData = { ...formData };
        oldData[keyName][index][name] = val;
        setFormData(oldData);
    }

    const handleDateChange = (name, val) => {
        const oldData = { ...formData };
        oldData[keyName][crrIndex][name] = val;
        if (name === 'date_installed' && (bettery_type !== 1 || bettery_type !== 2)) {
            let add_year = BatteryList.find((item) => parseInt(item.battery_type_id) === parseInt(oldData[keyName][crrIndex]['battery_type_id']));
            // .calendar()
            let battery_expiration = FormatDate(moment(val).add(add_year?.lifespan, 'years'));
            oldData[keyName][crrIndex]['battery_expiration'] = battery_expiration;
        }
        setFormData(oldData);;
    }



    if (bettery_type === 5) {
        return <>
            <hr />
            <div className='row' >
                <BatteryComp is_readonly={is_unknowntrue} crrFormData={crrFormData} BatteryList={BatteryList} handleInputChange={handleInputChange} crrIndex={crrIndex} />

                {/* <InstalledDate
                 is_unknowntrue={is_unknowntrue}  crrFormData={crrFormData}  handleDateChange={handleDateChange}
                /> */}
                <InstallBeforeDateComp
                    is_unknowntrue={is_unknowntrue} crrFormData={crrFormData} handleDateChange={handleDateChange}
                />

<ActionsComp
          index={0}
          crrIndex={crrIndex}
          formData={formData}
          setFormData={setFormData}
          section_name={keyName}
          crrFormData={crrFormData}
          unKnownToggleKey={unKnownToggleKey}
          />
            </div>

        </>
    }

    if (bettery_type === 4) {
        return (<>
            <div className='row' key={crrIndex} >
                <div className='col-12' >
                    <hr />
                </div>
                <BatteryComp is_readonly={is_unknowntrue} crrFormData={crrFormData} BatteryList={BatteryList} handleInputChange={handleInputChange} crrIndex={crrIndex} />


                <MenufectureDate is_unknowntrue={is_unknowntrue} crrFormData={crrFormData} handleDateChange={handleDateChange} />
                {(is_spare_manu === 1 ?
                    "" :
                    <InstalledDate
                        is_unknowntrue={is_unknowntrue} crrFormData={crrFormData} handleDateChange={handleDateChange}

                    />)}

                <div className='col form-group' >
                    <label htmlFor="">Battery lot</label>
                    <input onChange={handleInputChange} className='form-control' type="text" id="" value={HandleUnknow(crrFormData?.battery_lot)} name="battery_lot" disabled={is_unknowntrue} />
                </div>


                <div className='col form-group' >
                    <label htmlFor="">Battery UDI</label>
                    <input onChange={handleInputChange} className='form-control' type="text" id="" value={HandleUnknow(crrFormData?.battery_udi)} name="battery_udi" disabled={is_unknowntrue} />
                </div>

                <ActionsComp
          index={0}
          crrIndex={crrIndex}
          formData={formData}
          setFormData={setFormData}
          section_name={keyName}
          crrFormData={crrFormData}
          unKnownToggleKey={unKnownToggleKey}
          />
            </div>
        </>);
    }


    if (bettery_type === 3) {
        return (<>
            <div className='col' key={crrIndex} >
                <div className='col-12' >
                    <hr />
                </div>

                <div className='row'>
                    <BatteryComp is_readonly={is_unknowntrue} crrFormData={crrFormData} BatteryList={BatteryList} handleInputChange={handleInputChange} crrIndex={crrIndex} />

                    <InstallBeforeDateComp
                        is_unknowntrue={is_unknowntrue} crrFormData={crrFormData} handleDateChange={handleDateChange}

                    />

                    {/* <InstalledDate
                 is_unknowntrue={is_unknowntrue}  crrFormData={crrFormData}  handleDateChange={handleDateChange}
                
                /> */}

                    <div className='col form-group' >
                        <label htmlFor="">Battery lot</label>
                        <input onChange={handleInputChange} className='form-control' type="text" id="" value={HandleUnknow(crrFormData?.battery_lot)} name="battery_lot" disabled={is_unknowntrue} />
                    </div>

                    <div className='col form-group' >
                        <label htmlFor="">Battery UDI</label>
                        <input onChange={handleInputChange} className='form-control' type="text" id="" value={HandleUnknow(crrFormData?.battery_udi)} name="battery_udi" disabled={is_unknowntrue} />
                    </div>

                    <div className='col form-group' >
                        <label htmlFor="">Serial #</label>
                        <input onChange={handleInputChange} className='form-control' type="text" id="" value={HandleUnknow(crrFormData?.battery_serial)} name="battery_serial" disabled={is_unknowntrue} />
                    </div>

                    <ActionsComp
          index={0}
          crrIndex={crrIndex}
          formData={formData}
          setFormData={setFormData}
          section_name={keyName}
          crrFormData={crrFormData}
          unKnownToggleKey={unKnownToggleKey}
          />
                </div>

            </div>
        </>);
    }

    if (bettery_type === 2) {
        return (<>
            <div className='row' key={crrIndex} >
                <div className='col-12' >
                    <hr />
                </div>

                <BatteryComp is_readonly={is_unknowntrue} crrFormData={crrFormData} BatteryList={BatteryList} handleInputChange={handleInputChange} crrIndex={crrIndex} />

                <BatteryExpiery


                    is_unknowntrue={is_unknowntrue}
                    crrFormData={crrFormData}
                    handleDateChange={handleDateChange}
                />

                <div className='col form-group' >
                    <label htmlFor="">Battery lot</label>
                    <input onChange={handleInputChange} className='form-control' type="text" id="" value={HandleUnknow(crrFormData?.battery_lot)} name="battery_lot" disabled={is_unknowntrue} />
                </div>


                <div className='col form-group' >
                    <label htmlFor="">Battery UDI</label>
                    <input onChange={handleInputChange} className='form-control' type="text" id="" value={HandleUnknow(crrFormData?.battery_udi)} name="battery_udi" disabled={is_unknowntrue} />
                </div>

                <div className='col form-group' >
                    <label htmlFor="">9v Install</label>

                    <CommonDatePicker
                        disabled={is_unknowntrue}
                        calName={'v9_install'}
                        CalVal={crrFormData?.install_9v_date}
                        HandleChange={handleDateChange}
                    />
                </div>

                <ActionsComp
          index={0}
          crrIndex={crrIndex}
          formData={formData}
          setFormData={setFormData}
          section_name={keyName}
          crrFormData={crrFormData}
          unKnownToggleKey={unKnownToggleKey}
          />
            </div>
        </>);
    }


    if (bettery_type === 1) {
        return (<>
            <div className='row' key={crrIndex} >
                <div className='col-12' >
                    <hr />
                </div>


                <BatteryComp is_readonly={is_unknowntrue} crrFormData={crrFormData} BatteryList={BatteryList} handleInputChange={handleInputChange} crrIndex={crrIndex} />

                <BatteryExpiery


                    is_unknowntrue={is_unknowntrue}
                    crrFormData={crrFormData}
                    handleDateChange={handleDateChange}
                />

                <div className='col form-group' >
                    <label htmlFor="">Battery lot</label>
                    <input onChange={handleInputChange} className='form-control' type="text" id="" value={HandleUnknow(crrFormData?.battery_lot)} name="battery_lot" disabled={is_unknowntrue} />
                </div>


                <div className='col form-group' >
                    <label htmlFor="">Battery UDI</label>
                    <input onChange={handleInputChange} className='form-control' type="text" id="" value={HandleUnknow(crrFormData?.battery_udi)} name="battery_udi" disabled={is_unknowntrue} />
                </div>

                <ActionsComp
          index={0}
          crrIndex={crrIndex}
          formData={formData}
          setFormData={setFormData}
          section_name={keyName}
          crrFormData={crrFormData}
          unKnownToggleKey={unKnownToggleKey}
          />

            </div>
        </>);
    }


    //     return (
    //         <>

    //             <hr />
    //             <div className='row' >

    //                 <BatteryComp is_readonly={is_unknowntrue} crrFormData={ crrFormData } BatteryList={ BatteryList } handleInputChange={ handleInputChange } crrIndex={ crrIndex } />

    //                 <BatteryExpiery


    //                         is_unknowntrue={is_unknowntrue}  crrFormData={crrFormData}  handleDateChange={handleDateChange} 
    //                 />

    //                 <div className='col form-group' >
    //                     <label htmlFor="">Battery lot</label>
    //                     <input onChange={ handleInputChange } className='form-control' type="text" id="" value={ HandleUnknow(crrFormData?.battery_lot) } name="battery_lot" disabled={is_unknowntrue} />
    //                 </div>


    //                 <div className='col form-group' >
    //                     <label htmlFor="">Battery UDI</label>
    //                     <input onChange={ handleInputChange } className='form-control' type="text" id="" value={ HandleUnknow(crrFormData?.battery_uid) } name="battery_udi" disabled={is_unknowntrue} />
    //                 </div>


    //                 { Permissins?.has_9v ?
    //                     <div className='col form-group' >
    //                         <label htmlFor="">9v Install</label>
    //                         <input onChange={ handleInputChange } className='form-control' type="text" id="" value={ crrFormData?.v9_install } name="v9_install" />
    //                     </div>
    //                     : "" }
    //             </div>
    //             <div className='row'>


    //                 { Permissins?.has_installby ? <InstallBeforeDateComp
    //                 is_unknowntrue={is_unknowntrue}  crrFormData={crrFormData}  handleDateChange={handleDateChange}

    //                 /> : "" }


    //                 <InstalledDate
    //                  is_unknowntrue={is_unknowntrue}  crrFormData={crrFormData}  handleDateChange={handleDateChange}

    //                 />

    //                 { Permissins?.has_man ? <MenufectureDate is_unknowntrue={is_unknowntrue}  crrFormData={crrFormData}  handleDateChange={handleDateChange} /> : "" }
    //                 { Permissins?.has_installby ?
    //                     <div className='col form-group' >
    //                         <label htmlFor="">Serial #</label>
    //                         <input onChange={ handleInputChange } className='form-control' type="text" id="" value={ crrFormData?.serial } name="battery_serial" />
    //                     </div>
    //                     : "" }

    //             </div>
    //             {/* </div>  */ }
    //         </>
    //     )
    // }
    // const DataValue = batteryInfo[batteryIndex];
    return (
        <>


            {/*     
    <tr className="" key={batteryIndex}>
    

                    <td className="border border-2 py-1 px-2 bg-tbl-border border-l-blue border-r-blue">
                  {print_battery_part(batteryInfo[batteryIndex]?.battery_type_id)}
                   </td>

                   <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                   {moment(batteryInfo[batteryIndex]?.manufactured_date).isValid() ? moment(batteryInfo[batteryIndex]?.manufactured_date).format('MM/DD/YYYY') : ''}
                   </td>


                   <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                       {RenderDate(batteryInfo[batteryIndex]?.battery_expiration,true)}
                   </td>

                   <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                       {batteryInfo[batteryIndex]?.battery_lot}
                   </td>

                   <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                       {batteryInfo[batteryIndex]?.battery_udi}
                   </td>


        
      </tr> */}

            <tr className="" key={batteryIndex}>
                {/* <td>Main</td> */}
                {CheckADTable(batteryInfo, 'battery_type_id') === 1 ?
                    <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {print_battery_part(DataValue?.battery_type_id)}
                    </td> : ""}

                {CheckADTable(batteryInfo, 'battery_expiration') === 1 ?
                    <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {/* {RenderDate(FormatDate(DataValue?.battery_expiration), 1)} */}
                        {
                            DataValue?.battery_expiration === 'unknown' ?
                                'unknown' :
                                RenderDate(FormatDate(DataValue?.battery_expiration), 1)
                        }
                    </td> : ""}

                {/* <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {RenderDate(DataValue?.battery_expiration,true)}
                </td> */}
                {/* <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {RenderDate(DataValue?.battery_expiration,true)}
                </td>
                
                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {DataValue?.battery_serial}
                </td>

                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {DataValue?.install_9v_date}
                </td>
                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {DataValue?.manufactured_date}
                </td>
                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {DataValue?.installed_date}
                </td>

                
                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {DataValue?.battery_lot}
                </td>

                
                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {DataValue?.battery_udi}
                </td>
                
                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {DataValue?.install_before_date}
                </td> */}

                {CheckADTable(batteryInfo, 'battery_serial') === 1 ?
                    <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {DataValue?.battery_serial}
                    </td> : ""}
                {CheckADTable(batteryInfo, 'install_9v_date') === 1 ?
                    <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {/* {RenderDate(DataValue?.install_9v_date, 0)} */}
                        {
                            DataValue?.install_9v_date === 'unknown' ?
                                'unknown' :
                                RenderDate(DataValue?.install_9v_date, 0)
                        }
                    </td> : ""}
                {CheckADTable(batteryInfo, 'install_9v_date') === 1 ?
                    <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {/* {RenderDate(moment(DataValue?.install_9v_date).add(1, 'year').format('YYYY-MM-DD'))} */}
                        {
                            DataValue?.install_9v_date === 'unknown' ?
                                'unknown' :
                                RenderDate(moment(DataValue?.install_9v_date).add(1, 'year').format('YYYY-MM-DD'))
                        }
                    </td> : ""}
                {CheckADTable(batteryInfo, 'manufactured_date') === 1 ?
                    <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {/* {RenderDate(DataValue?.manufactured_date, 0)} */}
                        {
                            DataValue?.manufactured_date === 'unknown' ?
                                'unknown' :
                                RenderDate(DataValue?.manufactured_date, 0)
                        }
                    </td> : ""}
                {CheckADTable(batteryInfo, 'installed_date') === 1 ?
                    <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {/* {RenderDate(DataValue?.installed_date, 0)} */}
                        {
                            DataValue?.installed_date === 'unknown' ?
                                'unknown' :
                                RenderDate(DataValue?.installed_date, 0)
                        }
                    </td>
                    : ""}

                {CheckADTable(batteryInfo, 'battery_lot') === 1 ?
                    <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {DataValue?.battery_lot}
                    </td>
                    : ""}

                {CheckADTable(batteryInfo, 'battery_udi') === 1 ?
                    <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {DataValue?.battery_udi}
                    </td>
                    : ""}
                {CheckADTable(batteryInfo, 'install_before_date') === 1 ?
                    <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {/* {RenderDate(DataValue?.install_before_date, 0)} */}
                        {
                            DataValue?.install_before_date === 'unknown' ?
                                'unknown' :
                                RenderDate(DataValue?.install_before_date, 0)
                        }
                    </td>
                    : ""}
            </tr>

        </>

    )
}

export default SpareBatteryinformation