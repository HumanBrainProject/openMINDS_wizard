import Form from '@rjsf/core';

const RjsfForm = ({schema, onSubmit}) => {
  return(
      <Form schema={schema} omitExtraData={true} onSubmit={onSubmit}/>
  )
}

export default RjsfForm;
  