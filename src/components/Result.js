import React from 'react';
import ReactJson from 'react-json-view';
import { saveAs } from 'file-saver';

const Result = React.memo(({ result, onBack, onReset}) => {

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(result)], {type: "data:text/json;charset=utf-8"});
    saveAs(blob, "result.json")
  };
      
  return (
    <div className="result">
      <ReactJson collapsed={1} name={false} src={result} />
      <div className="footer">
        <div className="col-xs-5 back-panel">
          <button type="button" className="btn btn-info" onClick={onBack}>Back</button>
        </div>
        <div className="col-xs-5 col-xs-offset-2 submit-panel">
          <button className="btn btn-success download-btn" onClick={downloadJson}>Download</button>
          <button type="button" className="btn btn-info" onClick={onReset}>Create another Dataset</button>
        </div>
      </div>
    </div>
  );
});

export default Result;