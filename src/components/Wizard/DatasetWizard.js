import React from 'react';
import Form from '@rjsf/core';

const DatasetWizard = React.memo(({ schema, formData, onSubmit }) => {

  const handleOnSubmit = ({ formData }) => onSubmit(formData);

  return (
    <Form schema={schema} formData={formData} omitExtraData={true} onSubmit={handleOnSubmit} >
      <div className="footer">
        <div className="col-xs-5 back-panel">
        </div>
        <div className="col-xs-5 col-xs-offset-2 submit-panel">
          <button type="submit" className="btn btn-info">Next</button></div>
      </div>
    </Form>
  );
});

export default DatasetWizard;
