import React from 'react'
import Header from '../../meep-table/Header'
import AlertLindbergh from './AlertLindbergh'
import AlertRickenbacker from './AlertRickenbacker'
import AlertTable from './AlertTable'
import AlertWoodfield from './AlertWoodfield'
import Vector from '../../../img/Vector1.png'
import Edit from '../../../img/Edit.png'
import New from '../../../img/New.png'
import Hierarchy from '../../../img/Hierarchy.png'
import Delete from '../../../img/Delete.png'
import Move from '../../../img/Move.png'
import Fix from '../../../img/Fix.png'
import { useNavigate } from 'react-router-dom'


const TraningDetailsTable = () =>
{

	const navigate = useNavigate()
	return (
		<div>
			{/* <div style={{color:"#0c71c3"}}><img src={Vector} style={{marginRight:"5px"}} className=""/>Back</div>
      <div style={{fontSize:"22px",fontWeight:"700",marginTop:"5px",marginBottom:"5px"}}>Meep Fitness</div>

      <div className='d-flex justify-content-between' style={{marginBottom:"5px"}}>
        <div className='d-flex' style={{color:"#0c71c3"}}>
          <div><img src={Edit} style={{marginRight:"5px"}} className="img-style"/>Edit</div>
          <div style={{marginInline:"15px"}} ><img src={New} style={{marginRight:"5px"}}/>New</div>
          <div className='d-flex'>
            <div><img src={Hierarchy} style={{marginRight:"5px"}}/></div>
            <div>Hierarchy</div>
          </div>
        </div>
        <div className='d-flex'>
          <div><img src={Delete} style={{marginRight:"5px"}} /></div>
          <div style={{color:"#f36060"}}>Delete</div>
        </div>
      </div> */}

			{/* <div>
        <Header />
      </div> */}


			<div className='d-flex justify-content-between' style={ { marginTop: "5px", marginBottom: "5px", color: "#0c71c3" } }>
				<div style={ { fontSize: "22px", fontWeight: "bold", color: "#f36060" } }>Alert</div>
				<div className='d-flex' onClick={ () => { navigate("/fix-alert") } }>
					<div><img src={ Fix } style={ { marginRight: "5px" } } /></div>
					<div>Fix</div>
				</div>
			</div>

			<AlertTable />

			<div className='d-flex justify-content-between' style={ { marginTop: "5px", marginBottom: "5px", color: "#0c71c3" } }>
				<div style={ { fontSize: "22px", fontWeight: "bold" } }>Meep Fitness Rickenbacker</div>
				<div className='d-flex'>
					<div className='d-flex' style={ { marginRight: "15px" } }>
						<div><img src={ New } style={ { marginRight: "5px" } } /></div>
						<div>New</div>
					</div>
					<div className='d-flex'>
						<div><img src={ Move } style={ { marginRight: "5px" } } /></div>
						<div>Move</div>
					</div>
				</div>
			</div>

			<AlertRickenbacker />

			<div className='d-flex justify-content-between' style={ { marginTop: "5px", marginBottom: "5px", color: "#0c71c3" } }>
				<div style={ { fontSize: "22px", fontWeight: "bold" } }>Meep Fitness Lindbergh</div>
				<div className='d-flex'>
					<div className='d-flex' style={ { marginRight: "15px" } }>
						<div><img src={ New } style={ { marginRight: "5px" } } /></div>
						<div>New</div>
					</div>
					<div className='d-flex'>
						<div><img src={ Move } style={ { marginRight: "5px" } } /></div>
						<div>Move</div>
					</div>
				</div>
			</div>

			<AlertLindbergh />

			<div className='d-flex justify-content-between' style={ { marginTop: "5px", marginBottom: "5px", color: "#0c71c3" } }>
				<div style={ { fontSize: "22px", fontWeight: "bold" } }>Meep Fitness Woodfield</div>
				<div className='d-flex'>
					<div className='d-flex' style={ { marginRight: "15px" } }>
						<div><img src={ New } style={ { marginRight: "5px" } } /></div>
						<div>New</div>
					</div>
					<div className='d-flex'>
						<div><img src={ Move } style={ { marginRight: "5px" } } /></div>
						<div>Move</div>
					</div>
				</div>
			</div>

			<AlertWoodfield />

		</div>
	)
}

export default TraningDetailsTable