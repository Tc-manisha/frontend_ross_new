import React from 'react'

function AEDTBBack() {
  return (
    <div>
        
        <tr className="" key={ batteryIndex }>
													<td>Main</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ hasBattery?.battery_type_id &&
															hasBattery?.battery_type_id != "" && hasBattery?.battery_type_id != 'unknown' &&
															print_battery_part(hasBattery?.battery_type_id) }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ hasBattery?.battery_lot != "" && hasBattery?.battery_lot != 'unknown' &&
															hasBattery?.battery_lot }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border">
														{ hasBattery?.battery_uid != "" && hasBattery?.battery_uid != 'unknown' &&
															hasBattery?.battery_uid }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
															{RenderDate(hasBattery?.manufactured_date)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{RenderDate(hasBattery?.date_installed)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{RenderDate(hasBattery?.date_installed,false)}
													</td>
												</tr>




												<tr className="" key={ hasInstallbyIndex }>
													<td>Main</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ hasInstallby?.battery_type_id &&
															hasInstallby?.battery_type_id != "" && hasInstallby?.battery_type_id != 'unknown' &&
															print_battery_part(hasInstallby?.battery_type_id) }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { hasInstallby?.manufactured_date &&
															hasInstallby?.manufactured_date != "" && hasInstallby?.manufactured_date != 'unknown' && (
																<Moment
																	date={ hasInstallby?.manufactured_date }
																	format={ 'MM/DD/YYYY' }
																/>
															) } */}
															{RenderDate(hasInstallby?.manufactured_date,false)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { hasInstallby?.date_installed &&
															hasInstallby?.date_installed != "" &&
															hasInstallby?.date_installed && hasInstallby?.date_installed != 'unknown' ? (
															<Moment
																date={ hasInstallby?.date_installed }
																format={ 'MM/DD/YYYY' }
															/>
														) : (
															""
														) } */}
														{RenderDate(hasInstallby?.date_installed,false)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { hasInstallby?.battery_expiration &&
															hasInstallby?.battery_expiration != "" && hasInstallby?.battery_expiration != 'unknown' && (
																<Moment
																	date={ hasInstallby?.battery_expiration }
																	format={ 'MM/DD/YYYY' }
																/>
															) } */}
															{RenderDate(hasInstallby?.battery_expiration,true)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ hasInstallby?.battery_lot != "" && hasInstallby?.battery_lot != 'unknown' &&
															hasInstallby?.battery_lot }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border">
														{ hasInstallby?.battery_uid != "" && hasInstallby?.battery_uid != 'unknown' &&
															hasInstallby?.battery_uid }
													</td>
												</tr>

												<tr className="" key={ hasManIndex }>
													<td>Main</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ hasMan?.battery_type_id &&
															hasMan?.battery_type_id != "" && hasMan?.battery_type_id != 'unknown' &&
															print_battery_part(hasMan?.battery_type_id) }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { hasMan?.manufactured_date &&
															hasMan?.manufactured_date != "" && hasMan?.manufactured_date != 'unknown' && (
																<Moment
																	date={ hasMan?.manufactured_date }
																	format={ 'MM/DD/YYYY' }
																/>
															) } */}
															{RenderDate(hasMan?.manufactured_date,false)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { hasMan?.date_installed &&
															hasMan?.date_installed != "" &&
															hasMan?.date_installed && hasMan?.date_installed != 'unknown' ? (
															<Moment
																date={ hasMan?.date_installed }
																format={ 'MM/DD/YYYY' }
															/>
														) : (
															""
														) } */}
														{RenderDate(hasMan?.date_installed,false)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { hasMan?.battery_expiration &&
															hasMan?.battery_expiration != "" && hasMan?.battery_expiration != 'unknown' && (
																<Moment
																	date={ hasMan?.battery_expiration }
																	format={ 'MM/DD/YYYY' }
																/>
															) } */}
															{RenderDate(hasMan?.battery_expiration,true)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ hasMan?.battery_lot != "" && hasMan?.battery_lot != 'unknown' &&
															hasMan?.battery_lot }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border">
														{ hasMan?.battery_uid != "" && hasMan?.battery_uid != 'unknown' &&
															hasMan?.battery_uid }
													</td>
												</tr>


												<tr className="" key={ has10pkIndex }>
													<td>Main</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ has10pk?.battery_type_id &&
															has10pk?.battery_type_id != "" && 
															has10pk?.battery_type_id != 'unknown' &&
															print_battery_part(has10pk?.battery_type_id) }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { has10pk?.manufactured_date &&
															has10pk?.manufactured_date != "" && 
															has10pk?.manufactured_date != 'unknown' && (
																<Moment
																	date={ has10pk?.manufactured_date }
																	format={ 'MM/DD/YYYY' }
																/>
															) } */}
															{RenderDate(has10pk?.manufactured_date,false)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { has10pk?.date_installed &&
															has10pk?.date_installed != "" &&
															has10pk?.date_installed &&
															has10pk?.date_installed != 'unknown' ? (
															<Moment
																date={ has10pk?.date_installed }
																format={ 'MM/DD/YYYY' }
															/>
														) : (
															""
														) } */}
														{RenderDate(has10pk?.date_installed,false)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { has10pk?.battery_expiration &&
															has10pk?.battery_expiration != "" && has10pk?.battery_expiration != 'unknown' && (
																<Moment
																	date={ has10pk?.battery_expiration }
																	format={ 'MM/DD/YYYY' }
																/>
															) } */}
															{RenderDate(has10pk?.battery_expiration,false)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ has10pk?.battery_lot != "" && has10pk?.battery_lot != 'unknown' &&
															has10pk?.battery_lot }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border">
														{ has10pk?.battery_uid != "" && has10pk?.battery_uid != 'unknown' &&
															has10pk?.battery_uid }
													</td>
												</tr>


												<tr className="" key={ has9vIndex }>
													<td>Main</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ has9v?.battery_type_id &&
															has9v?.battery_type_id != "" && has9v?.battery_type_id != 'unknown' &&
															print_battery_part(has9v?.battery_type_id) }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { has9v?.manufactured_date &&
															has9v?.manufactured_date != "" && has9v?.manufactured_date != 'unknown' && (
																<Moment
																	date={ has9v?.manufactured_date }
																	format={ 'MM/DD/YYYY' }
																/>
															) } */}
															{RenderDate(has9v?.manufactured_date)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { has9v?.date_installed &&
															has9v?.date_installed != "" &&
															has9v?.date_installed && has9v?.date_installed != 'unknown' ? (
															<Moment
																date={ has9v?.date_installed }
																format={ 'MM/DD/YYYY' }
															/>
														) : (
															""
														) } */}
														{RenderDate(has9v?.date_installed)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { has9v?.battery_expiration &&
															has9v?.battery_expiration != "" && has9v?.battery_expiration != 'unknown' && (
																<Moment
																	date={ has9v?.battery_expiration }
																	format={ 'MM/DD/YYYY' }
																/>
															) } */}
															{RenderDate(has9v?.date_installed,true)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ has9v?.battery_lot != "" && has9v?.battery_lot != 'unknown' &&
															has9v?.battery_lot }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border">
														{ has9v?.battery_uid != "" && has9v?.battery_uid != 'unknown' &&
															has9v?.battery_uid }
													</td>
												</tr>



												<tr className="" key={ batteryIndex }>
													<td>Spare</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ hasBattery?.battery_type_id &&
															hasBattery?.battery_type_id != "" && hasBattery?.battery_type_id != 'unknown' &&
															print_battery_part(hasBattery?.battery_type_id) }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { hasBattery?.manufactured_date &&
															hasBattery?.manufactured_date != "" && hasBattery?.manufactured_date != 'unknown' && (
																<Moment
																	date={ hasBattery?.manufactured_date }
																	format={ 'MM/DD/YYYY' }
																/>
															) } */}
															{RenderDate(hasBattery?.manufactured_date,false)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { hasBattery?.date_installed &&
															hasBattery?.date_installed != "" &&
															hasBattery?.date_installed && hasBattery?.date_installed != 'unknown' ? (
															<Moment
																date={ hasBattery?.date_installed }
																format={ 'MM/DD/YYYY' }
															/>
														) : (
															""
														) } */}
														{RenderDate(hasBattery?.date_installed,false)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { hasBattery?.battery_expiration &&
															hasBattery?.battery_expiration != "" && hasBattery?.battery_expiration != 'unknown' && (
																<Moment
																	date={ hasBattery?.battery_expiration }
																	format={ 'MM/DD/YYYY' }
																/>
															) } */}
															{RenderDate(hasBattery?.battery_expiration,true)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ hasBattery?.battery_lot != "" && hasBattery?.battery_lot != 'unknown' &&
															hasBattery?.battery_lot }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border">
														{ hasBattery?.battery_uid != "" && hasBattery?.battery_uid != 'unknown' &&
															hasBattery?.battery_uid }
													</td>
												</tr>

												<tr className="" key={ has9vIndex }>
													<td>Spare</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ has9v?.battery_type_id &&
															has9v?.battery_type_id != "" && has9v?.battery_type_id != 'unknown' &&
															print_battery_part(has9v?.battery_type_id) }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { has9v?.manufactured_date &&
															has9v?.manufactured_date != "" && has9v?.manufactured_date != 'unknown' && (
																<Moment
																	date={ has9v?.manufactured_date }
																	format={ 'MM/DD/YYYY' }
																/>
															) } */}
															{RenderDate(has9v?.manufactured_date,false)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { has9v?.date_installed &&
															has9v?.date_installed != "" &&
															has9v?.date_installed && has9v?.date_installed != 'unknown' ? (
															<Moment
																date={ has9v?.date_installed }
																format={ 'MM/DD/YYYY' }
															/>
														) : (
															""
														) } */}
														{RenderDate(has9v?.date_installed,false)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { has9v?.battery_expiration &&
															has9v?.battery_expiration != "" && has9v?.battery_expiration != 'unknown' && (
																<Moment
																	date={ has9v?.battery_expiration }
																	format={ 'MM/DD/YYYY' }
																/>
															) } */}
															{RenderDate(has9v?.battery_expiration,true)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ has9v?.battery_lot != "" && has9v?.battery_lot != 'unknown' &&
															has9v?.battery_lot }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border">
														{ has9v?.battery_uid != "" && has9v?.battery_uid != 'unknown' &&
															has9v?.battery_uid }
													</td>
												</tr>


												<tr className="" key={ hasBatterySphereIndex }>
													<td>Spare</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ hasBatterySphere?.battery_type_id &&
															hasBatterySphere?.battery_type_id != "" && 
															hasBatterySphere?.battery_type_id != 'unknown' &&
															print_battery_part(hasBatterySphere?.battery_type_id) }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { hasBatterySphere?.manufactured_date &&
															hasBatterySphere?.manufactured_date != "" && 
															hasBatterySphere?.manufactured_date != 'unknown' && (
																<Moment
																	date={ hasBatterySphere?.manufactured_date }
																	format={ 'MM/DD/YYYY' }
																/>
															) } */}
															{RenderDate(hasBatterySphere?.manufactured_date,false)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { hasBatterySphere?.date_installed &&
															hasBatterySphere?.date_installed != "" &&
															hasBatterySphere?.date_installed && 
															hasBatterySphere?.date_installed != 'unknown' ? (
															<Moment
																date={ hasBatterySphere?.date_installed }
																format={ 'MM/DD/YYYY' }
															/>
														) : (
															""
														) } */}
														{RenderDate(hasBatterySphere?.date_installed,false)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { hasBatterySphere?.battery_expiration &&
															hasBatterySphere?.battery_expiration !=
															"" && hasBatterySphere?.battery_expiration != 'unknown' && (
																<Moment
																	date={ hasBatterySphere?.battery_expiration }
																	format={ 'MM/DD/YYYY' }
																/>
															) } */}
															{RenderDate(hasBatterySphere?.battery_expiration,true)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ hasBatterySphere?.battery_lot != "" && hasBatterySphere?.battery_lot != 'unknown' &&
															hasBatterySphere?.battery_lot }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border">
														{ hasBatterySphere?.battery_uid != "" && hasBatterySphere?.battery_uid != 'unknown' &&
															hasBatterySphere?.battery_uid }
													</td>
												</tr>

												
												<tr className="" key={ hasInstallByIndex }>
													<td>Spare</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ hasInstallBy?.battery_type_id &&
															hasInstallBy?.battery_type_id != "" && hasInstallBy?.battery_type_id != 'unknown' &&
															print_battery_part(hasInstallBy?.battery_type_id) }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { hasInstallBy?.manufactured_date &&
															hasInstallBy?.manufactured_date != "" && hasInstallBy?.manufactured_date != 'unknown' && (
																<Moment
																	date={ hasInstallBy?.manufactured_date }
																	format={ 'MM/DD/YYYY' }
																/>
															) } */}
															{RenderDate(hasInstallBy?.manufactured_date,false)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { hasInstallBy?.date_installed &&
															hasInstallBy?.date_installed != "" &&
															hasInstallBy?.date_installed && hasInstallBy?.date_installed != 'unknown' ? (
															<Moment
																date={ hasInstallBy?.date_installed }
																format={ 'MM/DD/YYYY' }
															/>
														) : (
															""
														) } */}
														{RenderDate(hasInstallBy?.date_installed,false)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{/* { hasInstallBy?.battery_expiration &&
															hasInstallBy?.battery_expiration != "" && hasInstallBy?.battery_expiration != 'unknown' && (
																<Moment
																	date={ hasInstallBy?.battery_expiration }
																	format={ 'MM/DD/YYYY' }
																/>
															) } */}
															{RenderDate(hasInstallBy?.battery_expiration,true)}
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
														{ hasInstallBy?.battery_lot != "" && hasInstallBy?.battery_lot != 'unknown' &&
															hasInstallBy?.battery_lot }
													</td>
													<td className="border border-2 py-1 px-2 bg-tbl-border">
														{ hasInstallBy?.battery_uid != "" && hasInstallBy?.battery_uid != 'unknown' &&
															hasInstallBy?.battery_uid }
													</td>
												</tr>
    </div>
  )
}

export default AEDTBBack