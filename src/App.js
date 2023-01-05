import "./App.css";

import React, { useState } from 'react';
import Html5QrcodePlugin from "./Html5QrcodePlugin.jsx";
// import ResultContainerPlugin from "./ResultContainerPlugin.jsx";

function App() {
	const [eventName, setEventName] = useState('');
	const [scans, setScans] = useState([]);
	const [checkType, setCheckType] = useState('');
	const [start, setStart] = useState(false);

	// debounce function
	const debounce = (callback, delay) => {
		let timeoutId;
		return (...args) => {
		  clearTimeout(timeoutId);
		  timeoutId = setTimeout(() => {
			callback(...args);
		  }, delay);
		};
	  };
	  
	
	const onNewScanResult = async (text, scanResult) => {
		console.log("App [result]", scanResult);

		if (text != null) {
			const parts = text.split('=');
			if (parts.length !== 2) {
				alert('bad scan');
			}

			try {
				await postScan({ badgeID: parts[1], eventName, checkType });
			} catch (err) {
				alert(err);
			}

			setScans(old => [...old, parts[1]]);
		}
	};

	// add debounce
	const debouncedOnNewScanResult = debounce(onNewScanResult, 1000); // 1000 ms delay


	return (
		<div className="App">
			<section className="App-section">
				<div className="App-section-title"> Angelbotics Attendance</div>
				<br />

				{start ?
					<Html5QrcodePlugin
						fps={10}
						qrbox={250}
						disableFlip={false}
						zoom={20}
						//qrCodeSuccessCallback={onNewScanResult}
						qrCodeSuccessCallback={debouncedOnNewScanResult}
					/>
					: ''
				}
				<ResultsContainer scans={scans} eventName={eventName} setEventName={setEventName} checkType={checkType} setCheckType={setCheckType} start={start} setStart={setStart} />
			</section>
		</div>
	);
}

function ResultsContainer({ scans, eventName, setEventName, checkType, setCheckType, start, setStart }) {
	return (
		<div className='Result-container'>
			<div className='Result-header'>Badges Scanned: ({scans.length})</div>
			<div className='Result-section'>
				{start ?
					'' :
					<div>
						<form>
							<input type="text" name="event" placeholder="Input Event Name Here" style={{ textAlign: 'center' }} onChange={e => setEventName(e.target.value.trim())} />
							<br />
							<label>
								<input type="radio" name="radio-group" value="checkin" onChange={e => setCheckType(e.target.value)} />
								Check In
							</label>
							<label>
								<input type="radio" name="radio-group" value="checkout" onChange={e => setCheckType(e.target.value)} />
								Check Out
							</label>
							<div>
								<button onClick={(e) => {
									e.preventDefault();
									setStart(true);
								}
								}>Start</button>
							</div>
						</form>
					</div>
				}
				<ResultsTable
					scans={scans}
					eventName={eventName}
					checkType={checkType}
				/>
			</div>
		</div>
	)
}

function ResultsTable({ scans, eventName, checkType }) {
	return (
		<table className={'Qrcode-result-table'}>
			<thead>
				<tr>
					<td>Event Name</td>
					<td>Badge ID</td>
					<td>Check In/Out</td>
				</tr>
			</thead>
			<tbody>
				{scans.reverse().map((scan, i) => (
					<tr key={i}>
						<td>{eventName}</td>
						<td>{scan}</td>
						<td>{checkType}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

async function postScan({ badgeID, eventName, checkType }) {
	const res = await fetch('/write', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ badgeID, eventName, checkType }),
	});

	if (res.status !== 201) {
		const body = await res.text()
		throw new Error(`error posting: code: ${res.status} body: ${body}`);
	}
}

export default App;
