import React, { useState, useCallback } from 'react';

import DatasetWizard from './Wizard/DatasetWizard';
import SubjectGroupWizard from './Wizard/SubjectGroupWizard';
import SubjectTemplateWizard from './Wizard/SubjectTemplateWizard';
import SubjectsWizard from './Wizard/SubjectsWizard';
import TissueSampleGroupWizard from './Wizard/TissueSampleGroupWizard';
import TissueSampleTemplateWizard from './Wizard/TissueSampleTemplateWizard';
import TissueSamplesWizard from './Wizard/TissueSamplesWizard';
import Result from './Result';

import * as datasetSchemaModule from '../schema/datasetSchema.json';
import * as subjectSchemaModule from '../schema/subjectSchema.json';
import * as tissueSampleSchemaModule from '../schema/tissueSampleSchema.json'; 
import { 
  generateDocumentsFromDataset, 
  generateDocumentsFromDatasetAndSubjectGroups, 
  generateDocumentsFromDatasetAndSubjects, 
  generateDocumentsFromDatasetAndTissueSampleGroups, 
  generateDocumentsFromDatasetAndTissueSamples
}  from '../helpers/Translator';

const datasetSchema = datasetSchemaModule.default;
const subjectSchema = subjectSchemaModule.default;
const tissueSampleSchema = tissueSampleSchemaModule.default;

const STUDY_TOPIC_SUBJECT_VALUE = "Subject";
const STUDY_TOPIC_TISSUE_SAMPLE_VALUE = "Tissue sample";

const WIZARD_STEP_DATASET = "WIZARD_STEP_DATASET";
const WIZARD_STEP_SUBJECT_GROUP = "WIZARD_STEP_SUBJECT_GROUP";
const WIZARD_STEP_SUBJECT_TEMPLATE = "WIZARD_STEP_SUBJECT_TEMPLATE";
const WIZARD_STEP_SUBJECTS = "WIZARD_STEP_SUBJECTS";
const WIZARD_STEP_TISSUE_SAMPLE_GROUP = "WIZARD_STEP_TISSUE_SAMPLE_GROUP";
const WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE = "WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE";
const WIZARD_STEP_TISSUE_SAMPLES = "WIZARD_STEP_TISSUE_SAMPLES";
const WIZARD_END = "WIZARD_END";

const areSubjectsGrouped = dataset => !dataset || !dataset.individualSubjects;

const areTissueSamplesGrouped = dataset => !dataset || !dataset.individualTissueSamples;

const getNumberOfSubjects = dataset => {
  const number = dataset?Number(dataset.numberOfSubjects):NaN;
  return isNaN(number)?0:number;
};

const getNumberOfTissueSamples = dataset => {
  const number = dataset?Number(dataset.numberOfTissueSamples):NaN;
  return isNaN(number)?0:number;
};

const getStudyTopic = dataset => dataset?dataset.studyTopic:undefined;

const getSubjectTemplateSchema = () => ({...subjectSchema, title: "Subject template"});

const getTissueSampleTemplateSchema = () => ({...tissueSampleSchema, title: "Tissue sample template"});

const getSubjectGroupsSchema = dataset => {
  const items = JSON.parse(JSON.stringify(subjectSchema));
  items.properties.quantity = {
    type: "number",
    title: "Number of subjects",
    default: getNumberOfSubjects(dataset)
  };
  return {
    "title": "Subject groups",
    "type": "array",
    "minItems": 1,
    "items": items
  };
};

const getSubjectsSchema = () => {
  const items = JSON.parse(JSON.stringify(subjectSchema));
  return {
    "title": "Subjects",
    "type": "array",
    "minItems": 1,
    "items": items
  };
};

const getTissueSamplesSchema = () => {
  const items = JSON.parse(JSON.stringify(tissueSampleSchema));
  return {
    "title": "Tissue samples",
    "type": "array",
    "minItems": 1,
    "items": items
  };
};

const getTissueSampleGroupsSchema = dataset => {
  const items = JSON.parse(JSON.stringify(tissueSampleSchema))
  items.properties.quantity = {
    type: "number",
    title: "Number of tissue samples",
    default: getNumberOfTissueSamples(dataset)
  };
  return {
    "title": "Tissue sample groups",
    "type": "array",
    "minItems": 1,
    "items": items
  };
};

const Wizard = () => {

  const [dataset, setDataset] = useState();
  const [subjectGroups, setSubjectGroups] = useState([]);
  const [subjectTemplate, setSubjectTemplate] = useState();
  const [subjects, setSubjects] = useState([]);
  const [tissueSampleGroups, setTissueSampleGroups] = useState([]);
  const [tissueSampleTemplate, setTissueSampleTemplate] = useState();
  const [tissueSamples, setTissueSamples] = useState([]);
  const [wizardStep, setWizardStep] = useState(WIZARD_STEP_DATASET);

  const [schema, setSchema] = useState(datasetSchema);
  const [result, setResult] = useState();

  const handleDatasetSubmit = useCallback(data => {
    const studyTopic = getStudyTopic(data);
    setDataset(data);
    
    if (studyTopic === STUDY_TOPIC_SUBJECT_VALUE) {
      if (areSubjectsGrouped(data)) {
        const subjectGroupsSchema = getSubjectGroupsSchema(data);
        setSchema(subjectGroupsSchema);
        setWizardStep(WIZARD_STEP_SUBJECT_GROUP);
      } else {
        const subjectTemplateSchema = getSubjectTemplateSchema();
        setSchema(subjectTemplateSchema);
        setWizardStep(WIZARD_STEP_SUBJECT_TEMPLATE);
      }
    } else if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE) {
      if (areTissueSamplesGrouped(data)) {
        const tissueSampleGroupsSchema = getTissueSampleGroupsSchema(data);
        setSchema(tissueSampleGroupsSchema);
        setWizardStep(WIZARD_STEP_TISSUE_SAMPLE_GROUP);
      } else {
        const tissueSampleTemplateSchema = getTissueSampleTemplateSchema();
        setSchema(tissueSampleTemplateSchema);
        setWizardStep(WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE);
      }
    } else {
      const res = generateDocumentsFromDataset(data);
      setResult(res);
      setWizardStep(WIZARD_END);
    }
  }, []);

  const handleSubjectGroupSubmit = useCallback(data => {
    setSubjectGroups(data);
    const res = generateDocumentsFromDatasetAndSubjectGroups(dataset, data);
    setResult(res);
    setWizardStep(WIZARD_END);
  }, [dataset]);

  const handleSubjectsSubmit = useCallback(data => {
    setSubjects(data);
    const res = generateDocumentsFromDatasetAndSubjects(dataset, data);
    setResult(res);
    setWizardStep(WIZARD_END);
  }, [dataset]);

  const handleTissueSampleGroupsSubmit = useCallback(data => {
    setTissueSampleGroups(data);
    const res = generateDocumentsFromDatasetAndTissueSampleGroups(dataset, data);
    setResult(res);
    setWizardStep(WIZARD_END);
  }, [dataset]);

  const handleTissueSamplesSubmit = useCallback(data => {
    setTissueSamples(data);
    const res = generateDocumentsFromDatasetAndTissueSamples(dataset, data);
    setResult(res);
    setWizardStep(WIZARD_END);
  }, [dataset]);

  const handleSubjectTemplateSubmit = useCallback(data => {
    if (JSON.stringify(data) !== JSON.stringify(subjectTemplate)) {
      setSubjectTemplate(data);
      const newSubjects = [...Array(getNumberOfSubjects(dataset)).keys()].map(() => JSON.parse(JSON.stringify(data)));
      setSubjects(newSubjects);
    }
    const subjectsSchema = getSubjectsSchema();
    setSchema(subjectsSchema);
    setWizardStep(WIZARD_STEP_SUBJECTS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, subjectTemplate]);

  const handleTissueSampleTemplateSubmit = useCallback(data => {
    if (JSON.stringify(data) !== JSON.stringify(tissueSampleTemplate)) {
      setTissueSampleTemplate(data);
      const newTissueSamples = [...Array(getNumberOfTissueSamples(dataset)).keys()].map(() => JSON.parse(JSON.stringify(data)));
      setTissueSamples(newTissueSamples);
    }
    const tissueSamplesSchema = getTissueSamplesSchema();
    setSchema(tissueSamplesSchema);
    setWizardStep(WIZARD_STEP_TISSUE_SAMPLES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, tissueSampleTemplate]);
 
  const goBackToDatasetWizard = useCallback(() => {
    setSchema(datasetSchema);
    setResult(null);
    setWizardStep(WIZARD_STEP_DATASET);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const goBackToSubjectTemplateWizard = useCallback(() => {  
    const subjectTemplateSchema = getSubjectTemplateSchema();
    setSchema(subjectTemplateSchema);
    setResult(null);
    setWizardStep(WIZARD_STEP_SUBJECT_TEMPLATE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBackToSubjectsWizard = useCallback(() => {
    const subjectsSchema = getSubjectsSchema();
    setSchema(subjectsSchema);
    setResult(null);
    setWizardStep(WIZARD_STEP_SUBJECTS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBackToSubjectGroupsWizard = useCallback(() => {
    const subjectGroupsSchema = getSubjectGroupsSchema();
    setSchema(subjectGroupsSchema);
    setResult(null);
    setWizardStep(WIZARD_STEP_SUBJECT_GROUP);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBackToTissueSampleTemplateWizard = useCallback(() => {
    const tissueSampleTemplateSchema = getTissueSampleTemplateSchema();
    setSchema(tissueSampleTemplateSchema);
    setResult(null);
    setWizardStep(WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBackToTissueSamplesWizard = useCallback(() => {
    const tissueSamplesSchema = getTissueSamplesSchema();
    setSchema(tissueSamplesSchema);
    setResult(null);
    setWizardStep(WIZARD_STEP_TISSUE_SAMPLES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBackToTissueSampleGroupsWizard = useCallback(() => {
    const tissueSampleGroupsSchema = getTissueSampleGroupsSchema();
    setSchema(tissueSampleGroupsSchema);
    setResult(null);
    setWizardStep(WIZARD_STEP_TISSUE_SAMPLE_GROUP);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoBackToPreviousStepWizard = useCallback(() => {
    switch (wizardStep) {
      case WIZARD_STEP_SUBJECT_GROUP:
      case WIZARD_STEP_SUBJECT_TEMPLATE:
      case WIZARD_STEP_TISSUE_SAMPLE_GROUP:
      case WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE:
        goBackToDatasetWizard();
        break;
      case WIZARD_STEP_SUBJECTS:
        goBackToSubjectTemplateWizard();
        break;
      case WIZARD_STEP_TISSUE_SAMPLES:
        goBackToTissueSampleTemplateWizard();
        break;
      case WIZARD_END:
        const studyTopic = getStudyTopic(dataset);
        if (studyTopic === STUDY_TOPIC_SUBJECT_VALUE) {
          if (areSubjectsGrouped(dataset)) {
            goBackToSubjectGroupsWizard();
          } else {
            goBackToSubjectsWizard();
          }
        } else if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE) {
          if (areTissueSamplesGrouped(dataset)) {
            goBackToTissueSampleGroupsWizard();  
          } else {
            goBackToTissueSamplesWizard();  
          }
        } else {
          goBackToDatasetWizard();
        }
        break;
      default:
        goBackToDatasetWizard();
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizardStep]);

  const handleReset = useCallback(() => {
    setDataset(undefined);
    setSubjectGroups(null);
    setSubjectTemplate(null);
    setSubjects([]);
    setTissueSamples([]);
    setTissueSampleGroups([])
    setTissueSampleTemplate(null);
    setSchema(datasetSchema);
    setResult(null);
    setWizardStep(WIZARD_STEP_DATASET);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  switch (wizardStep) {
    case WIZARD_STEP_DATASET:
      console.log(dataset);
      return (
        <DatasetWizard schema={schema} formData={dataset} onSubmit={handleDatasetSubmit} />
      );
    case WIZARD_STEP_SUBJECT_GROUP:
      return (
        <SubjectGroupWizard schema={schema} formData={subjectGroups} onSubmit={handleSubjectGroupSubmit} onBack={handleGoBackToPreviousStepWizard} />
      );
    case WIZARD_STEP_SUBJECT_TEMPLATE:
      return (
        <SubjectTemplateWizard schema={schema} formData={subjectTemplate} onSubmit={handleSubjectTemplateSubmit} onBack={handleGoBackToPreviousStepWizard} />
      );
    case WIZARD_STEP_SUBJECTS:
      return (
        <SubjectsWizard schema={schema} formData={subjects} onSubmit={handleSubjectsSubmit} onBack={handleGoBackToPreviousStepWizard} />
      );
    case WIZARD_STEP_TISSUE_SAMPLE_GROUP:
      return (
        <TissueSampleGroupWizard schema={schema} formData={tissueSampleGroups} onSubmit={handleTissueSampleGroupsSubmit} onBack={handleGoBackToPreviousStepWizard} />
      );
    case WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE:
      return (
        <TissueSampleTemplateWizard schema={schema} formData={tissueSampleTemplate} onSubmit={handleTissueSampleTemplateSubmit} onBack={handleGoBackToPreviousStepWizard} />
      );
    case WIZARD_STEP_TISSUE_SAMPLES:
      return (
        <TissueSamplesWizard schema={schema} formData={tissueSamples} onSubmit={handleTissueSamplesSubmit} onBack={handleGoBackToPreviousStepWizard} />
      );
    default:
      return (
        <Result result={result} onBack={handleGoBackToPreviousStepWizard} onReset={handleReset} />
      );
  }
};

export default Wizard;