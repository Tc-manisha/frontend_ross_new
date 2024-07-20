import React, { useEffect } from 'react'
import Header from '../../meep-table/Header'
import TrainingTableData from './TrainingTableData'
import AlertTable from './AlertTable'
import Vector from '../../../img/Vector1.png'
import Edit from '../../../img/Edit.png'
import New from '../../../img/New.png'
import Hierarchy from '../../../img/Hierarchy.png'
import Delete from '../../../img/Delete.png'
import Move from '../../../img/Move.png'
import Fix from '../../../img/Fix.png'
import { useNavigate } from 'react-router-dom'
import { CallGETAPI } from '../../../helper/API'


const TraningDetailsTable = () =>
{

	const navigate = useNavigate();
	const [ alertTrainingData, setAlertTrainingData] = React.useState([]);
	const [ trainingData, setTrainingData] = React.useState([]);

	// get training data
	const getAlertTrainingData = async() => {

		// alert training data
		const result = await CallGETAPI('account/admin-account-training-alert');

		if(result?.status) {
			const alertTrainingData = result?.data?.data;
			setAlertTrainingData(alertTrainingData)
		}

		// training data
		const trainingDataResult = await CallGETAPI('account/admin-account-training-by-site');

		if(trainingDataResult?.status) {
			const trainingData = trainingDataResult?.data?.data;
			setTrainingData(trainingData)
		}
	}

	useEffect(() => {
		getAlertTrainingData();
	}, [])

	return (
		<div>

			<div className='d-flex justify-content-between mt-4' style={ { marginTop: "5px", marginBottom: "5px", color: "#0c71c3" } }>
				<div style={ { fontSize: "22px", fontWeight: "bold", color: "#f36060" } }>Alert</div>
				<div className='d-flex' onClick={ () => { navigate("/fix-alert") } }>
					<div><img src={ Fix } style={ { marginRight: "5px" } } /></div>
					<div>Fix</div>
				</div>
			</div>

			<AlertTable alertTrainingData={alertTrainingData} />

			<div className='d-flex justify-content-between mt-4' style={ { marginTop: "5px", marginBottom: "5px", color: "#0c71c3" } }>
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

			<TrainingTableData trainingData={trainingData} />

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

			<TrainingTableData trainingData={trainingData} />

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

			<TrainingTableData trainingData={trainingData} />

		</div>
	)
}

export default TraningDetailsTable