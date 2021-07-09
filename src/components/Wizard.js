import React, { useState, useCallback } from 'react';

import DatasetWizard from './Wizard/DatasetWizard';
import SubjectGroupWizard from './Wizard/SubjectGroupWizard';
import SubjectTemplateWizard from './Wizard/SubjectTemplateWizard';
import SubjectsWizard from './Wizard/SubjectsWizard';
import TissueSampleCollectionWizard from './Wizard/TissueSampleCollectionWizard';
import TissueSampleTemplateWizard from './Wizard/TissueSampleTemplateWizard';
import TissueSamplesWizard from './Wizard/TissueSamplesWizard';
import Result from './Result';

import * as datasetSchemaModule from '../schema/datasetSchema.json';

import { 
  generateDocumentsFromDataset, 
  generateDocumentsFromDatasetAndSubjectGroups, 
  generateDocumentsFromDatasetAndSubjects, 
  generateDocumentsFromDatasetAndTissueSampleCollections,
  generateDocumentsFromDatasetAndArtificialTissueSampleCollections,
  generateDocumentsFromDatasetAndTissueSamples,
  generateDocumentsFromDatasetAndArtificialTissueSamples
}  from '../helpers/Translator';

import {
  areSubjectsGrouped,
  areTissueSamplesGrouped,
  getNumberOfSubjects,
  getNumberOfTissueSamples,
  getStudyTopic,
  getSubjectTemplateSchema,
  getSubjectGroupsSchemaForTissueSample,
  getTissueSampleTemplateSchema,
  getArtificialTissueSampleTemplateSchema,
  getSubjectGroupsSchema,
  getSubjectsSchema,
  getTissueSamplesSchema,
  getArtificialTissueSamplesSchema,
  getTissueSampleCollectionsSchema,
  getArtificialTissueSampleCollectionsSchema,
  generateItemsFromTemplate
} from '../helpers/Wizard';

const datasetSchema = datasetSchemaModule.default;

const STUDY_TOPIC_SUBJECT_VALUE = "Subject";
const STUDY_TOPIC_TISSUE_SAMPLE_VALUE = "Tissue sample";
const STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE = "Artificial tissue sample";

const WIZARD_STEP_DATASET = "WIZARD_STEP_DATASET";
const WIZARD_STEP_SUBJECT_GROUP = "WIZARD_STEP_SUBJECT_GROUP";
const WIZARD_STEP_SUBJECT_TEMPLATE = "WIZARD_STEP_SUBJECT_TEMPLATE";
const WIZARD_STEP_SUBJECTS = "WIZARD_STEP_SUBJECTS";
const WIZARD_STEP_TISSUE_SAMPLE_GROUP = "WIZARD_STEP_TISSUE_SAMPLE_GROUP";
const WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE = "WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE";
const WIZARD_STEP_TISSUE_SAMPLES = "WIZARD_STEP_TISSUE_SAMPLES";
const WIZARD_END = "WIZARD_END";

const Wizard = () => {

  const [dataset, setDataset] = useState();
  const [subjectGroups, setSubjectGroups] = useState();
  const [subjectTemplate, setSubjectTemplate] = useState();
  const [subjects, setSubjects] = useState([]);
  const [tissueSampleCollections, setTissueSampleCollections] = useState();
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
      const subjectGroupsSchema = getSubjectGroupsSchemaForTissueSample();
      setSchema(subjectGroupsSchema);
      setWizardStep(WIZARD_STEP_SUBJECT_GROUP);
    } else if (studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE) {
      if (areTissueSamplesGrouped(data)) {
        const tissueSampleCollectionsSchema = getArtificialTissueSampleCollectionsSchema(data);
        setSchema(tissueSampleCollectionsSchema);
        setWizardStep(WIZARD_STEP_TISSUE_SAMPLE_GROUP);
      } else {
        const tissueSampleTemplateSchema = getArtificialTissueSampleTemplateSchema();
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
    const studyTopic = getStudyTopic(dataset);
    if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE) {
      if (areTissueSamplesGrouped(dataset)) {
        const tissueSampleCollectionsSchema = getTissueSampleCollectionsSchema(dataset, data);
        setSchema(tissueSampleCollectionsSchema);
        setWizardStep(WIZARD_STEP_TISSUE_SAMPLE_GROUP);
      } else {
        const tissueSampleTemplateSchema = getTissueSampleTemplateSchema(data);
        setSchema(tissueSampleTemplateSchema);
        setWizardStep(WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE);
      }
    } else { //studyTopic === STUDY_TOPIC_SUBJECT_VALUE
      const res = generateDocumentsFromDatasetAndSubjectGroups(dataset, data);
      setResult(res);
      setWizardStep(WIZARD_END);
    }
  }, [dataset]);

  const handleSubjectsSubmit = useCallback(data => {
    setSubjects(data);
    const res = generateDocumentsFromDatasetAndSubjects(dataset, data);
    setResult(res);
    setWizardStep(WIZARD_END);
  }, [dataset]);

  const handleTissueSampleCollectionsSubmit = useCallback(data => {
    setTissueSampleCollections(data);
    const studyTopic = getStudyTopic(dataset);
    if (studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE) {
      const res = generateDocumentsFromDatasetAndArtificialTissueSampleCollections(dataset, data);
      setResult(res);
    } else {
      const res = generateDocumentsFromDatasetAndTissueSampleCollections(dataset, subjectGroups, data);
      setResult(res);
    }
    setWizardStep(WIZARD_END);
  }, [dataset, subjectGroups]);

  const handleTissueSamplesSubmit = useCallback(data => {
    setTissueSamples(data);
    const studyTopic = getStudyTopic(dataset);
    if (studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE) {
      const res = generateDocumentsFromDatasetAndArtificialTissueSamples(dataset, data);
      setResult(res);
    } else {
      const res = generateDocumentsFromDatasetAndTissueSamples(dataset, subjectGroups, data);
      setResult(res);
    }
    setWizardStep(WIZARD_END);
  }, [dataset, subjectGroups]);

  const handleSubjectTemplateSubmit = useCallback(data => {
    if (JSON.stringify(data) !== JSON.stringify(subjectTemplate)) {
      setSubjectTemplate(data);
      const size = getNumberOfSubjects(dataset);
      const newSubjects = generateItemsFromTemplate(data, size);
      newSubjects.forEach((subject, index) => {
        if(subject.lookupLabel) {
          subject.lookupLabel = `${subject.lookupLabel} ${index + 1}`;
        }
      });
      setSubjects(newSubjects);
    }
    const subjectsSchema = getSubjectsSchema();
    setSchema(subjectsSchema);
    setWizardStep(WIZARD_STEP_SUBJECTS);
  }, [dataset, subjectTemplate]);

  const handleTissueSampleTemplateSubmit = useCallback(data => {
    if (JSON.stringify(data) !== JSON.stringify(tissueSampleTemplate)) {
      setTissueSampleTemplate(data);
      const size = getNumberOfTissueSamples(dataset);
      const newTissueSamples = generateItemsFromTemplate(data, size);
      newTissueSamples.forEach((sample, index) => {
        if(sample.lookupLabel) {
          sample.lookupLabel = `${sample.lookupLabel} ${index + 1}`;
        }
      });
      setTissueSamples(newTissueSamples);
    }
    const studyTopic = getStudyTopic(dataset);
    if (studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE) {
      const tissueSamplesSchema = getArtificialTissueSamplesSchema();
      setSchema(tissueSamplesSchema);
    } else { // if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE)
      const tissueSamplesSchema = getTissueSamplesSchema(subjectGroups);
      setSchema(tissueSamplesSchema);
    }
    setWizardStep(WIZARD_STEP_TISSUE_SAMPLES);
  }, [dataset, subjectGroups, tissueSampleTemplate]);
 
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
    const studyTopic = getStudyTopic(dataset);
    if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE) {
      const subjectGroupsSchema = getSubjectGroupsSchemaForTissueSample();
      setSchema(subjectGroupsSchema);
    } else { // if (studyTopic === STUDY_TOPIC_SUBJECT_VALUE)
      const subjectGroupsSchema = getSubjectGroupsSchema();
      setSchema(subjectGroupsSchema);
    }
    setResult(null);
    setWizardStep(WIZARD_STEP_SUBJECT_GROUP);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset]);

  const goBackToTissueSampleTemplateWizard = useCallback(() => {
    const tissueSampleTemplateSchema = getArtificialTissueSampleTemplateSchema();
    setSchema(tissueSampleTemplateSchema);
    setResult(null);
    setWizardStep(WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBackToTissueSamplesWizard = useCallback(() => {
    const studyTopic = getStudyTopic(dataset);
    if (studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE) {
      const tissueSamplesSchema = getArtificialTissueSamplesSchema();
      setSchema(tissueSamplesSchema);
    } else { // if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE)
      const tissueSamplesSchema = getTissueSamplesSchema(subjectGroups);
      setSchema(tissueSamplesSchema);
    }
    setResult(null);
    setWizardStep(WIZARD_STEP_TISSUE_SAMPLES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, subjectGroups]);

  const goBackToTissueSampleCollectionsWizard = useCallback(() => {
    const studyTopic = getStudyTopic(dataset);
    if (studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE) {
      const tissueSampleCollectionsSchema = getArtificialTissueSampleCollectionsSchema();
      setSchema(tissueSampleCollectionsSchema);
    } else { // if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE)
      const tissueSampleCollectionsSchema = getTissueSampleCollectionsSchema(subjectGroups);
      setSchema(tissueSampleCollectionsSchema);
    }
    setResult(null);
    setWizardStep(WIZARD_STEP_TISSUE_SAMPLE_GROUP);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, subjectGroups]);

  const handleGoBackToPreviousStepWizard = useCallback(() => {
    const studyTopic = getStudyTopic(dataset);
    switch (wizardStep) {
      case WIZARD_STEP_SUBJECT_GROUP:
      case WIZARD_STEP_SUBJECT_TEMPLATE:
        goBackToDatasetWizard();
        break;
      case WIZARD_STEP_TISSUE_SAMPLE_GROUP:
      case WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE:
        if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE) {
          goBackToSubjectGroupsWizard();
        } else { // if (studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE)
          goBackToDatasetWizard();
        }
        break;
      case WIZARD_STEP_SUBJECTS:
        goBackToSubjectTemplateWizard();
        break;
      case WIZARD_STEP_TISSUE_SAMPLES:
        goBackToTissueSampleTemplateWizard();
        break;
      case WIZARD_END:
        if (studyTopic === STUDY_TOPIC_SUBJECT_VALUE) {
          if (areSubjectsGrouped(dataset)) {
            goBackToSubjectGroupsWizard();
          } else {
            goBackToSubjectsWizard();
          }
        } else if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE || studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE) {
          if (areTissueSamplesGrouped(dataset)) {
            goBackToTissueSampleCollectionsWizard();  
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
  }, [wizardStep, dataset, goBackToDatasetWizard, goBackToSubjectTemplateWizard, goBackToTissueSampleTemplateWizard, goBackToSubjectGroupsWizard, goBackToSubjectsWizard, goBackToTissueSampleCollectionsWizard, goBackToTissueSamplesWizard]);

  const handleReset = useCallback(() => {
    setDataset(undefined);
    setSubjectGroups(null);
    setSubjectTemplate(null);
    setSubjects([]);
    setTissueSamples([]);
    setTissueSampleCollections([])
    setTissueSampleTemplate(null);
    setSchema(datasetSchema);
    setResult(null);
    setWizardStep(WIZARD_STEP_DATASET);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  switch (wizardStep) {
    case WIZARD_STEP_DATASET:
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
        <TissueSampleCollectionWizard schema={schema} formData={tissueSampleCollections} onSubmit={handleTissueSampleCollectionsSubmit} onBack={handleGoBackToPreviousStepWizard} />
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