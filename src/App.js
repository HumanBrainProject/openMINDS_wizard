import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Form from './components/Form';
import './App.css';
import * as datasetSchemaModule from './schema/datasetSchema.json';
import * as subjectGroupSchemaModule from './schema/subjectGroupSchema.json';
import * as subjectSchemaModule from './schema/subjectSchema.json';
import * as tissueSampleGroupSchemaModule from './schema/tissueSampleGroupSchema.json';
import * as tissueSampleSchemaModule from './schema/tissueSampleSchema.json'; 
import { 
  generateDocumentsFromDataset, 
  generateDocumentsFromDatasetAndSubjectGroups, 
  generateDocumentsFromDatasetAndSubjects, 
  generateDocumentsFromDatasetAndTissueSampleGroups, 
  generateDocumentsFromDatasetAndTissueSamples
}  from './helpers/Translator';

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
    const dataset = {...formData};
    delete dataset.studiedSpecimen;
    const type = formData.studiedSpecimen.conditional.studyTopic;
    const sizeAsNumber = type === STUDY_TOPIC_SUBJECT_VALUE ? Number(formData.studiedSpecimen.conditional.numberOfSubjects):(type === STUDY_TOPIC_TISSUE_SAMPLE_VALUE)?Number(formData.studiedSpecimen.conditional.numberOfTissues):NaN;
    const size = (isNaN(sizeAsNumber) || sizeAsNumber < 0)?0:sizeAsNumber;
    const grouped = !formData.studiedSpecimen.conditional.individualSubjectInfo && !formData.studiedSpecimen.conditional.individualTissueSampleInfo;
    
    setDataset(dataset);
    setStudyTopicType(type);
    setStudyTopicSize(size);
    groupStudyTopic(grouped);
    
    if (type === STUDY_TOPIC_SUBJECT_VALUE) {
      if (grouped) {
        let newSchema = JSON.parse(JSON.stringify(subjectGroupSchema));
        const items = JSON.parse(JSON.stringify(subjectSchema));
        items.properties.quantity = {
          type: "number",
          title: "How many subjects did you study?",
          default: size
        }
        newSchema.properties.minItemsList.items = items;
        setSchema(newSchema);
      } else {
        setSchema(subjectSchema);
      }
    } else if (type === STUDY_TOPIC_TISSUE_SAMPLE_VALUE) {
      if (grouped) {
        let newSchema = JSON.parse(JSON.stringify(tissueSampleGroupSchema));
        const items = JSON.parse(JSON.stringify(tissueSampleSchema))
        items.properties.quantity = {
          type: "number",
          title: "How many tissue samples did you study?",
          default: size
        }
        newSchema.properties.minItemsList.items = items;
        setSchema(newSchema);
      } else {
        setSchema(tissueSampleSchema);
      }
    } else {  
      const res = generateDocumentsFromDataset(dataset);
      setResult(res);
    }
  };

  const submitSubjectGroups = subjectsGroups => {
    const res = generateDocumentsFromDatasetAndSubjectGroups(dataset, subjectsGroups);
    setResult(res);
  };

  const submitSubjects = subjects => {
    const res = generateDocumentsFromDatasetAndSubjects(dataset, subjects);
    setResult(res);
  };

  const submitTissueSampleGroups = tissueSampleGroups => {
    const res = generateDocumentsFromDatasetAndTissueSampleGroups(dataset, tissueSampleGroups);
    setResult(res);
  };

  const submitTissueSamples = tissueSamples => {
    const res = generateDocumentsFromDatasetAndTissueSamples(dataset, tissueSamples);
    setResult(res);
  };

  const submitSubjectTemplate = formData => {
    let newSchema = JSON.parse(JSON.stringify(subjectGroupSchema));
    const item = JSON.parse(JSON.stringify(subjectSchema));
    item.default = formData;
    newSchema.properties.minItemsList.items = item;
    newSchema.properties.minItemsList.minItems = studyTopicSize;
    setSchema(newSchema);
    toggleStudyTemplate(true);
  };

  const submitTissueSampleTemplate = formData => {
    let newSchema = JSON.parse(JSON.stringify(tissueSampleGroupSchema));
    const item = JSON.parse(JSON.stringify(tissueSampleSchema));
    item.default = formData;
    newSchema.properties.minItemsList.items = item;
    newSchema.properties.minItemsList.minItems = studyTopicSize;
    setSchema(newSchema);
    toggleStudyTemplate(true);
  };
 
  const onSubmit = ({formData}) => {
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
      }
    }
  }

  const downloadZip = () => {
    const zip = new JSZip();
    zip.file("result.json", JSON.stringify(result));
    zip.generateAsync({type:"blob"}).then(content => saveAs(content, "result.zip"));
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
          <div className="result">
              <ReactJson collapsed={2} name={false} src={result} />
              <button className="btn btn-info" onClick={downloadZip}>Download</button>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
