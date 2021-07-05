import Form from '@rjsf/core';

const DatasetWizard = ({ schema, onSubmit }) => {

  const handleOnSubmit = ({ formData }) => {
    return onSubmit(formData);
  };

  return (
    <Form schema={schema} omitExtraData={true} onSubmit={handleOnSubmit} >
      <div className="footer">
        <div className="col-xs-5 back-panel">
        </div>
        <div className="col-xs-5 col-xs-offset-2 submit-panel">
          <button type="submit" className="btn btn-info">Next</button></div>
      </div>
    </Form>
  );
};

export default DatasetWizard;
