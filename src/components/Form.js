import Form from '@rjsf/core';

const RjsfForm = ({schema, onSubmit, submitLabel, onBack, backLabel}) => {
  return(
      <Form schema={schema} omitExtraData={true} onSubmit={onSubmit} >
        <div className="footer">
          <div className="col-xs-5 back-panel">
            {onBack && backLabel && (
              <button type="button" className="btn btn-info" onClick={onBack}>{backLabel}</button>
            )}
          </div>
          <div className="col-xs-5 col-xs-offset-2 submit-panel"><button type="submit" className="btn btn-info">{submitLabel}</button></div>
        </div>
      </Form>
  )
}

export default RjsfForm;
  