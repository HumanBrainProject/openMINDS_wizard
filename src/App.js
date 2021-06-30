import React, { useState } from "react";
import Form from './components/Form';
import './App.css';
import * as datasetSchemaModule from './schema/datasetSchema.json';
import * as subjectGroupSchemaModule from './schema/subjectGroupSchema.json';
import * as subjectSchemaModule from './schema/subjectSchema.json';
import * as tissueSampleGroupSchemaModule from './schema/tissueSampleGroupSchema.json';
import * as tissueSampleSchemaModule from './schema/tissueSampleSchema.json';

const datasetSchema = datasetSchemaModule.default;
const subjectSchema = subjectSchemaModule.default;
const subjectGroupSchema = subjectGroupSchemaModule.default;
const tissueSampleSchema = tissueSampleSchemaModule.default;
const tissueSampleGroupSchema = tissueSampleGroupSchemaModule.default;

const STUDY_TOPIC_SUBJECT_VALUE = "Subject";
const STUDY_TOPIC_TISSUE_SAMPLE_VALUE = "Tissue sample";

const App = () => {

  const [dataset, setDataset] = useState();
  const [isStudyTopicGrouped, groupStudyTopic] = useState(false);
  const [studyTopicType, setStudyTopicType] = useState();
  const [studyTopicSize, setStudyTopicSize] = useState(0);
  const [hasStudyTemplate, toggleStudyTemplate] = useState(false);
  const [schema, setSchema] = useState(datasetSchema);
  const [result, setResult] = useState();

  const submitDataset = formData => {
  
    const type = formData.studiedSpecimen.conditional.studyTopic;
    const sizeAsNumber = Number(formData.studiedSpecimen.conditional.numberOfSubjects);
    const size = (isNaN(sizeAsNumber) || sizeAsNumber < 0)?0:sizeAsNumber;
    const grouped = !formData.studiedSpecimen.conditional.individualSubjectInfo;
    
    setDataset(formData);
    setStudyTopicType(type);
    setStudyTopicSize(size);
    groupStudyTopic(grouped);
    
    if (type === STUDY_TOPIC_SUBJECT_VALUE) {
      
      if (grouped) {
        let newSchema = JSON.parse(JSON.stringify(subjectGroupSchema));
        newSchema.properties.minItemsList.items = JSON.parse(JSON.stringify(subjectSchema))
        //TODO set the value of "number of subjects" field in newSchema
        setSchema(newSchema);
      } else {
        setSchema(subjectSchema);
      }

    } else if (type === STUDY_TOPIC_TISSUE_SAMPLE_VALUE) {

      if (grouped) {
        const newSchema = JSON.parse(JSON.stringify(tissueSampleGroupSchema));
        //TODO set the value of "number of tissueSamples" field in newSchema
        setSchema(newSchema);
      } else {
        setSchema(tissueSampleSchema);
      }

    } else {  
      //TODO: generate the final jsonld;
      const res = {};
      setResult(res);
    }
  };

  const submitSubjectGroups = formData => {
    //TODO: generate the final jsonld;
    const res = {};
    setResult(res);
  };

  const submitSubjectTemplate = formData => {
    let newSchema = JSON.parse(JSON.stringify(subjectGroupSchema));
    const item = JSON.parse(JSON.stringify(subjectSchema));
    debugger;
    Object.entries(formData).forEach(([key, value]) => {
      if (item.properties[key]) {
        item.properties[key].default = value;
      }
    });
    newSchema.properties.minItemsList.items = item;
    newSchema.properties.minItemsList.minItems = studyTopicSize;
    setSchema(newSchema);
    toggleStudyTemplate(true);
  };

  const submitSubjects = formData => {
    //TODO: generate the final jsonld;
    const res = {};
    setResult(res);
  };

  const submitTissueSampleGroups = formData => {
    //TODO: generate the final jsonld;
    const res = {};
    setResult(res);
  };

  const submitTissueSampleTemplate = formData => {
    //TODO: genereate the new schemas
    const tissueSamplesSchema = {};
    // for studyTopicSize copy tissueSampleSchema
    setSchema(tissueSamplesSchema);
    toggleStudyTemplate(true);
  };

  const submitTissueSamples = formData => {
    //TODO: generate the final jsonld;
    const res = {};
    setResult(res);
  };
 
  const onSubmit = ({formData}) => {
    console.log(formData);
    if (!dataset) {
      submitDataset(formData);
    } else {  

      if (studyTopicType === STUDY_TOPIC_SUBJECT_VALUE) {

        // Subject
        if (isStudyTopicGrouped) {
          submitSubjectGroups(formData);
        } else  if (!hasStudyTemplate) {
            submitSubjectTemplate(formData);
        } else {
          submitSubjects(formData);
        }

      } else if (studyTopicType === STUDY_TOPIC_TISSUE_SAMPLE_VALUE) {  

        // Tissue sample
        if (isStudyTopicGrouped) {
          submitTissueSampleGroups(formData);
          return;
        } else if(!hasStudyTemplate) {
          submitTissueSampleTemplate(formData);
        } else {
          submitTissueSamples(formData);
        }

      } else {
        //TODO: generate the final jsonld;
        const res = {};
        setResult(res);
      }
    }
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <img src="openMINDS_logo.png" alt="openminds" height="100" />
      </header>
      <div className="form">
        {!result?
          <Form onSubmit={onSubmit} schema={schema} />
          :
          <div>Download</div>
        }
      </div>
    </div>
  );
}

export default App;
