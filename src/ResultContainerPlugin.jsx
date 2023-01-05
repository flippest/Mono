import React from 'react';

class ResultContainerTable extends React.Component {
  render() {
    var decodedTexts = this.props.results.map(result => {
      // Split the decodedText string by the '=' delimiter
      var splitDecodedText = result.decodedText.split('=');

      // Return the second column of data
      return splitDecodedText[1];
    });

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
          {decodedTexts.reverse().map((decodedText, i) => (
            <tr key={i}>
              <td>{this.props.eventName}</td>
              <td>{decodedText}</td>
              <td>{this.props.radioGroup}</td>
             </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

class ResultContainerPlugin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      eventName: '',
      radioGroup: '',
    };
  }

  handleEventChange = (event) => {
    this.setState({ eventName: event.target.value });
  };

  handleRadioGroupChange = (event) => {
    this.setState({ radioGroup: event.target.value });
  };

  render() {
    let filteredResults = [];

    for (var i = 0; i < this.props.results.length; ++i) {
        if (i === 0) {
            filteredResults.push(this.props.results[i]);
            continue;
        }

        if (this.props.results[i].decodedText !== this.props.results[i-1].decodedText) {
            filteredResults.push(this.props.results[i]);
        }
    }
    
    return (
      <div className='Result-container'>
        <div className='Result-header'>Badges Scanned: ({filteredResults.length})</div>
        <div className='Result-section'>
          <div>
            <form>
              <input type="text" name="event" placeholder="Input Event Name Here" style={{ textAlign: 'center' }} onChange={this.handleEventChange}/>
              <br />
              <label>
                <input type="radio" name="radio-group" value="checkin" onChange={this.handleRadioGroupChange} />
                Check In
              </label>
              <label>
                <input type="radio" name="radio-group" value="checkout" onChange={this.handleRadioGroupChange} />
                Check Out
              </label>
            </form>
          </div>
          <ResultContainerTable
            results={filteredResults}
            eventName={this.state.eventName}
            radioGroup={this.state.radioGroup}
            />
        </div>
      </div>
    );
  }
}

export default ResultContainerPlugin;
