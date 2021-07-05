import Form from '@rjsf/core';

const SubjectGroupWizard = ({ schema, onSubmit, onBack }) => {

  const handleOnSubmit = ({ formData }) => {
    return onSubmit(formData);
  };

  return (
    <Form schema={schema} omitExtraData={true} onSubmit={handleOnSubmit} >
      <div className="footer">
        <div className="col-xs-5 back-panel">
          <button type="button" className="btn btn-info" onClick={onBack}>Back</button>
        </div>
        <div className="col-xs-5 col-xs-offset-2 submit-panel">
          <button type="submit" className="btn btn-info">Next</button></div>
      </div>
    </Form>
  );
};

export default SubjectGroupWizard;
