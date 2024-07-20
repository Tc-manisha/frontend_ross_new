import { toast } from 'react-toastify';
import { CallPOSTAPI } from '../../../../helper/API';
import './creaditcard.scss';
import React, { useState, useRef } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth();
let MONTHS = {};
let YEARS = [ CURRENT_YEAR ];
for (let i = 1; i <= 12; i++)
{
	MONTHS[ i ] = i.toString().length === 1 ? `0${ i }` : i.toString();
	YEARS.push(YEARS[ 0 ] + i);
}

const CreaditCardForm = ({ classId }) =>
{
	const [ sliderLocation, setSliderLocation ] = useState('');
	const [ cardNumber, setCardNumber ] = useState('');
	const [ cardName, setCardName ] = useState('');
	const [ cardMonth, setCardMonth ] = useState(0);
	const [ cardYear, setCardYear ] = useState(0);
	const [ cardCvv, setCardCvv ] = useState('');
	const [ cardType, setCardType ] = useState('visa');
	const [ toggleMonth, setToggleMonth ] = useState(true);
	const [ toggleYear, setToggleYear ] = useState(true);
	const [ showCard, setShowCard ] = useState(false);
	const [ cardFlipped, setCardFlipped ] = useState(false);

	const navigate = useNavigate();
	const numberInputRef = useRef(null);
	const nameInputRef = useRef(null);
	const cvvInputRef = useRef(null);

	const [ loading, setLoading ] = useState(false);

	const handleChange = (event, type) =>
	{
		let { value } = event.target;
		if (type === 'cardNumber')
		{
			value = value.replace(/ /gi, '');
			if (isNaN(value))
			{
				return;
			} else
			{
				const cardType = getCardType(value);
				setCardNumber(value);
				setCardType(cardType);
			}
		} else if (type === 'cardName')
		{
			var regName = /^[a-zA-Z\s]*$/;
			if (!regName.test(value))
			{
			} else
			{
				setCardName(value);
			}
		} else if (type === 'cardMonth')
		{
			value = Number(value);
			setCardMonth(value);
			setToggleMonth(prevToggleMonth => !prevToggleMonth);
		} else if (type === 'cardYear')
		{
			value = Number(value);
			//   const { cardMonth } = this.state;
			if (value === CURRENT_YEAR && cardMonth <= CURRENT_MONTH)
			{
				setCardMonth(0);
				setCardYear(value);
				setToggleYear(prevToggleYear => !prevToggleYear);
				setToggleMonth(prevToggleMonth => !prevToggleMonth);
			} else
			{
				setCardYear(value);
				setToggleYear(prevToggleYear => !prevToggleYear);
			}
		} else if (type === 'cardCvv')
		{
			value = value.replace(/ /gi, '');
			if (isNaN(value))
			{
				return;
			} else
			{
				setCardCvv(value);
			}
		}
	};

	const handleSubmit = async event =>
	{
		event.preventDefault();
		setLoading(true);
		if (!canSubmit())
		{
			toast.error("Please Fill Form Currectly")
			setLoading(false);
			return "";
		}
		let monthVal = Object.entries(MONTHS).find(([ key, value ]) => parseInt(key) === parseInt(cardMonth))
		let sendMonthVal = monthVal[ 1 ] || cardMonth;
		let sendYearVal = cardYear.toString().slice(-2)

		let send_jb = {
			"card_number": cardNumber,
			"exp_date": sendMonthVal + "" + sendYearVal,
			"cvv": cardCvv,
			"amount": "200",
			"class_id": classId,
		}
		let res = await CallPOSTAPI('auth/paymentAPI', send_jb);
		if (res?.data?.status)
		{
			toast.success("Card Added Successfully");
			navigate('/dashboard')
		} else
		{
			toast.error(res?.data?.msg);
		}
		setLoading(false);
	};

	const [ errorHandle, setErrorHandle ] = useState({
		cardNumber: false,
		cardName: false,
		cardCvv: false,
		cardMonth: false,
		cardYear: false,
	})

	const canSubmit = () =>
	{
		let obj = { cardNumber: false, cardName: false, cardCvv: false, cardMonth: false, cardYear: false, };

		if (cardNumber.length !== 16)
		{
			obj.cardNumber = true;
		}
		if (cardName.length < 3)
		{
			obj.cardName = true;
		}
		if (cardCvv.length != 3)
		{
			obj.cardCvv = true;
		}

		if (cardMonth === 0)
		{
			obj.cardMonth = true;
		}

		if (cardYear === 0)
		{
			obj.cardYear = true;
		}

		setErrorHandle(obj);

		return (
			cardNumber.length === 16 &&
			cardName.length >= 3 &&
			cardCvv.length === 3 &&
			cardMonth !== 0 &&
			cardYear !== 0
		);
	};

	const moveSlider = (event, position) =>
	{
		position = [ 'year', 'month' ].includes(position) ? 'expiration' : position;
		setSliderLocation(position);
	};

	const setFocus = (event, type) =>
	{
		let { sliderLocation } = this.state;

		if (event.target.className.includes('year'))
		{
			event.stopPropagation();
		}

		if (type === 'number')
		{
			numberInputRef.current.focus();
		} else if (type === 'name')
		{
			nameInputRef.current.focus();
		} else if (type === 'cvv')
		{
			cvvInputRef.current.focus();
		}
	};

	const handleClick = event =>
	{
		if (!cvvInputRef.current.contains(event.target))
		{
			setCardFlipped(false);
		}
		if (
			nameCard.contains(event.target) ||
			nameInput.contains(event.target) ||
			numberCard.contains(event.target) ||
			numberInput.contains(event.target) ||
			expirationCard.contains(event.target) ||
			monthInput.contains(event.target) ||
			yearInput.contains(event.target)
		)
			return;
		setSliderLocation('');
	};

	const formatCardNumber = value =>
	{
		let v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
		let matches = v.match(/\d{4,16}/g);
		let match = (matches && matches[ 0 ]) || '';
		let parts = [];
		for (let i = 0, len = match.length; i < len; i += 4)
		{
			parts.push(match.substring(i, i + 4));
		}
		if (parts.length)
		{
			return parts.join(' ');
		} else
		{
			return value;
		}
	};

	const getCardType = number =>
	{
		let re = new RegExp('^4');
		if (number.match(re) != null) return 'visa';
		re = new RegExp('^(34|37)');
		if (number.match(re) != null) return 'amex';
		re = new RegExp('^5[1-5]');
		if (number.match(re) != null) return 'mastercard';
		re = new RegExp('^6011');
		if (number.match(re) != null) return 'discover';
		return 'visa';
	};

	// Render JSX
	let displayNumber = [];

	for (let i = 0; i < 16; i++)
	{
		let displayDigit = '#';
		if (typeof cardNumber[ i ] !== 'undefined')
		{
			displayDigit = i > 3 && i < 12 ? '*' : cardNumber[ i ];
		}
		displayNumber.push(displayDigit);
	}

	return (
		<div id="creadit-card-form-section" >
			<div className="card-form" >

				<div className="card-inputs">
					<form onSubmit={ handleSubmit }>
						<div className="lg-input">
							<label htmlFor="cardNumber"> Card Number</label>
							<input
								className={ `number-input ${ errorHandle?.cardNumber ? 'has-error' : '' }` }
								id="cardNumber"
								type="text"
								onChange={ event => handleChange(event, 'cardNumber') }
								onSelect={ event => moveSlider(event, 'number') }
								value={ formatCardNumber(cardNumber) }
								ref={ numberInputRef }
								maxLength="19"
								placeholder='Enter Card Number...'
								required
							/>
						</div>

						<div className="lg-input">
							<label htmlFor="cardName">Card Holder Name</label>
							<input
								className={ `name-input ${ errorHandle?.cardName ? 'has-error' : '' }` }
								id="cardName"
								type="text"
								onChange={ event => handleChange(event, 'cardName') }
								// onClick={event => setFocus(event, 'name')}
								value={ cardName }
								ref={ nameInputRef }
								placeholder='Enter Card Holder Name...'
								required
							/>
						</div>

						<div className='row' >
							<div className="sm-input col-6  ">
								<label htmlFor="expirationMonth">Expiration Date</label>
								<select
									id="expirationMonth"
									className={ `month-select mr-4 ${ toggleMonth ? 'toggle1' : 'toggle2'
										}  ${ errorHandle?.cardMonth ? 'has-error' : '' } ` }
									onChange={ event => handleChange(event, 'cardMonth') }
									// onClick={event => setFocus(event, 'month')}
									value={ cardMonth }
								>
									<option value="0">Month</option>
									{ Object.entries(MONTHS).map(([ key, value ]) => (
										<option key={ key } value={ Number(key) }>
											{ value }
										</option>
									)) }
								</select>
								<select
									className={ `year-select double-digit ${ toggleYear ? 'toggle1' : 'toggle2'
										} ${ errorHandle?.cardYear ? 'has-error' : '' } ` }
									onChange={ event => handleChange(event, 'cardYear') }
									// onClick={event => setFocus(event, 'year')}
									value={ cardYear }
									required
								>
									<option value="">Year</option>
									{ YEARS.map(year => (
										<option key={ year } value={ year }>
											{ year.toString().slice(-2) }
										</option>
									)) }
								</select>
							</div>
							<div className="sm-input col-6 ml-2">
								<label htmlFor="cvv">CVV</label>
								<input
									className={ `cvv-input ${ errorHandle?.cardCvv ? 'has-error' : '' }` }
									id="cvv"
									type="text"
									onChange={ event => handleChange(event, 'cardCvv') }
									onClick={ () => setCardFlipped(true) }
									value={ cardCvv }
									ref={ cvvInputRef }
									maxLength="3"
									required
								/>
							</div>
						</div>

						<button
							className="submit-button"
							type="submit"
							disabled={ loading }
						>
							{ loading ? 'Loading...' : 'Proceed To Pay' }
						</button>
					</form>
				</div>

			</div>
		</div>
	);
};

export default CreaditCardForm;