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
import * as subjectGroupSchemaModule from '../schema/subjectGroupSchema.json';
import * as subjectSchemaModule from '../schema/subjectSchema.json';
import * as tissueSampleGroupSchemaModule from '../schema/tissueSampleGroupSchema.json';
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
const subjectGroupSchema = subjectGroupSchemaModule.default;
const tissueSampleSchema = tissueSampleSchemaModule.default;
const tissueSampleGroupSchema = tissueSampleGroupSchemaModule.default;

const STUDY_TOPIC_SUBJECT_VALUE = "Subject";
const STUDY_TOPIC_TISSUE_SAMPLE_VALUE = "Tissue sample";

const WIZARD_STEP_DATASET = "WIZARD_STEP_DATASET";
const WIZARD_STEP_SUBJECT_GROUP = "WIZARD_STEP_SUBJECT_GROUP";
const WIZARD_STEP_SUBJECT_TEMPLATE = "WIZARD_STEP_SUBJECT_TEMPLATE";
const WIZARD_STEP_SUBJECTS = "WIZARD_STEP_SUBJECTS";
const WIZARD_STEP_TISSUE_SAMPLE_GROUP = "WIZARD_STEP_TISSUE_SAMPLE_GROUP";
const WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE = "WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE";
const WIZARD_STEP_TISSUE_SAMPLES = "WIZARD_STEP_TISSUE_SAMPLES";

const Wizard = () => {

  const [dataset, setDataset] = useState();
  const [areStudiedSpecimenGrouped, groupStudiedSpecimen] = useState(false);
  const [studyTopic, setstudyTopic] = useState();
  const [numberOfSpecimen, setnumberOfSpecimen] = useState(0);
  const [hasStudiedSpecimenTemplate, toggleStudiedSpecimenTemplate] = useState(false);
  const [schema, setSchema] = useState(datasetSchema);
  const [result, setResult] = useState();

  const getWizardStep = () => {
    if (!dataset) {
      return WIZARD_STEP_DATASET;
    }  

    if (result) {
      return null;
    }

    if (studyTopic === STUDY_TOPIC_SUBJECT_VALUE) {
      // Subject
      if (areStudiedSpecimenGrouped) {
        return WIZARD_STEP_SUBJECT_GROUP;
      } else  if (!hasStudiedSpecimenTemplate) {
          return WIZARD_STEP_SUBJECT_TEMPLATE;
      } else {
        return WIZARD_STEP_SUBJECTS;
      }
      
    } else if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE) {  
      // Tissue sample
      if (areStudiedSpecimenGrouped) {
        return WIZARD_STEP_TISSUE_SAMPLE_GROUP;
      } else if(!hasStudiedSpecimenTemplate) {
        return WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE;
      } else {
        return WIZARD_STEP_TISSUE_SAMPLES;
      }
    }
  }

  const handleDatasetSubmit = useCallback(dataset => {
    const type = dataset.studiedSpecimen.conditional.studyTopic;
    const sizeAsNumber = Number(dataset.studiedSpecimen.conditional.numberOfSpecimen);
    const size = (isNaN(sizeAsNumber) || sizeAsNumber < 0)?0:sizeAsNumber;
    const grouped = !dataset.studiedSpecimen.conditional.individualSpecimen;
    
    setDataset(dataset);
    setstudyTopic(type);
    setnumberOfSpecimen(size);
    groupStudiedSpecimen(grouped);
    
    if (type === STUDY_TOPIC_SUBJECT_VALUE) {
      if (grouped) {
        let newSchema = JSON.parse(JSON.stringify(subjectGroupSchema));
        const items = JSON.parse(JSON.stringify(subjectSchema));
        items.properties.quantity = {
          type: "number",
          title: "Number of subjects",
          default: size
        }
        newSchema.items = items;
        setSchema(newSchema);
      } else {
        setSchema({...subjectSchema, title: "Subject template"});
      }
    } else if (type === STUDY_TOPIC_TISSUE_SAMPLE_VALUE) {
      if (grouped) {
        let newSchema = JSON.parse(JSON.stringify(tissueSampleGroupSchema));
        const items = JSON.parse(JSON.stringify(tissueSampleSchema))
        items.properties.quantity = {
          type: "number",
          title: "Number of tissue samples",
          default: size
        }
        newSchema.items = items;
        setSchema(newSchema);
      } else {
        setSchema({...tissueSampleSchema, title: "Tissue sample template"});
      }
    } else {  
      const res = generateDocumentsFromDataset(dataset);
      setResult(res);
    }
  });

  const handleSubjectGroupSubmit = useCallback(subjectGroups => {
    const res = generateDocumentsFromDatasetAndSubjectGroups(dataset, subjectGroups);
    setResult(res);
  });

  const handleSubjectsSubmit = useCallback(subjects => {
    const res = generateDocumentsFromDatasetAndSubjects(dataset, subjects);
    setResult(res);
  });

  const handleTissueSampleGroupsSubmit = useCallback(tissueSampleGroups => {
    const res = generateDocumentsFromDatasetAndTissueSampleGroups(dataset, tissueSampleGroups);
    setResult(res);
  });

  const handleTissueSamplesSubmit = useCallback(tissueSamples => {
    const res = generateDocumentsFromDatasetAndTissueSamples(dataset, tissueSamples);
    setResult(res);
  });

  const handleSubjectTemplateSubmit = useCallback(subjectTemplate => {
    let newSchema = JSON.parse(JSON.stringify(subjectGroupSchema));
    const item = JSON.parse(JSON.stringify(subjectSchema));
    item.default = subjectTemplate;
    newSchema.items = item;
    newSchema.minItems = numberOfSpecimen;
    setSchema(newSchema);
    toggleStudiedSpecimenTemplate(true);
  });

  const handleTissueSampleTemplateSubmit = useCallback(tissueSampleTemplate => {
    let newSchema = JSON.parse(JSON.stringify(tissueSampleGroupSchema));
    const item = JSON.parse(JSON.stringify(tissueSampleSchema));
    item.default = tissueSampleTemplate;
    newSchema.items = item;
    newSchema.minItems = numberOfSpecimen;
    setSchema(newSchema);
    toggleStudiedSpecimenTemplate(true);
  });
 
  const handleGoBackToDatasetWizzard = useCallback(() => {
    //TODO
  });

  const handleGoBackToSubjectTemplateWizzard = useCallback(() => {
    //TODO
  });

  const handleGoBackToTissueSampleTemplateWizzard = useCallback(() => {
    //TODO
  });


  const handleGoBackToLastStepWizzard= useCallback(() => {
    if (studyTopic === STUDY_TOPIC_SUBJECT_VALUE) {

      // Subject
      if (areStudiedSpecimenGrouped) {

        return;
      } else  if (!hasStudiedSpecimenTemplate) {

          return;
      } else {

        return;
      }
      
    } else if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE) { 

      // Tissue sample
      if (areStudiedSpecimenGrouped) {

        return;
      } else if(!hasStudiedSpecimenTemplate) {

        return;
      } else {

        return;
      }
    }
    return;
  });

  const handleReset = useCallback(() => {
    setDataset(null);
    groupStudiedSpecimen(false);
    setstudyTopic(null);
    setnumberOfSpecimen(0);
    toggleStudiedSpecimenTemplate(false);
    setSchema(datasetSchema);
    setResult(null);
  });

  const wizardStep = getWizardStep();

  switch (wizardStep) {
    case WIZARD_STEP_DATASET:
      return (
        <DatasetWizard schema={schema} onSubmit={handleDatasetSubmit} />
      );
      case WIZARD_STEP_SUBJECT_GROUP:
        return (
          <SubjectGroupWizard schema={schema} onSubmit={handleSubjectGroupSubmit} onBack={handleGoBackToDatasetWizzard} />
        );
      case WIZARD_STEP_SUBJECT_TEMPLATE:
        return (
          <SubjectTemplateWizard schema={schema} onSubmit={handleSubjectTemplateSubmit} onBack={handleGoBackToDatasetWizzard} />
        );
      case WIZARD_STEP_SUBJECTS:
        return (
          <SubjectsWizard schema={schema} onSubmit={handleSubjectsSubmit} onBack={handleGoBackToSubjectTemplateWizzard} />
        );
      case WIZARD_STEP_TISSUE_SAMPLE_GROUP:
        return (
          <TissueSampleGroupWizard schema={schema} onSubmit={handleTissueSampleGroupsSubmit} onBack={handleGoBackToDatasetWizzard} />
        );
      case WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE:
        return (
          <TissueSampleTemplateWizard schema={schema} onSubmit={handleTissueSampleTemplateSubmit} onBack={handleGoBackToDatasetWizzard} />
        );
      case WIZARD_STEP_TISSUE_SAMPLES:
        return (
          <TissueSamplesWizard schema={schema} onSubmit={handleTissueSamplesSubmit} onBack={handleGoBackToTissueSampleTemplateWizzard} />
        );
      default:
        return (
          <Result result={result} onBack={handleGoBackToLastStepWizzard} onReset={handleReset} />
        );
  }
};

export default Wizard;