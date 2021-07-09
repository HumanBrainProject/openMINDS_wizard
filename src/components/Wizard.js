import React from 'react';

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
class Wizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataset: undefined,
      subjectGroups: undefined,
      subjectTemplate: undefined,
      subjects: [],
      tissueSampleCollections: undefined,
      tissueSampleTemplate: undefined,
      tissueSamples: [],
      wizardStep: WIZARD_STEP_DATASET,
      schema: datasetSchema,
      result: undefined
    }
  }

  handleDatasetSubmit =data => {
    const studyTopic = getStudyTopic(data);
    this.setState({dataset: data});
    
    if (studyTopic === STUDY_TOPIC_SUBJECT_VALUE) {
      if (areSubjectsGrouped(data)) {
        const subjectGroupsSchema = getSubjectGroupsSchema(data);
        this.setState({
          schema: subjectGroupsSchema,
          wizardStep: WIZARD_STEP_SUBJECT_GROUP
        });
      } else {
        const subjectTemplateSchema = getSubjectTemplateSchema();
        this.setState({
          schema: subjectTemplateSchema,
          wizardStep: WIZARD_STEP_SUBJECT_TEMPLATE
        });
      }
    } else if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE) {
      const subjectGroupsSchema = getSubjectGroupsSchemaForTissueSample();
      this.setState({
        schema: subjectGroupsSchema,
        wizardStep: WIZARD_STEP_SUBJECT_GROUP
      });
    } else if (studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE) {
      if (areTissueSamplesGrouped(data)) {
        const tissueSampleCollectionsSchema = getArtificialTissueSampleCollectionsSchema(data);
        this.setState({
          schema: tissueSampleCollectionsSchema,
          wizardStep: WIZARD_STEP_TISSUE_SAMPLE_GROUP
        });
      } else {
        const tissueSampleTemplateSchema = getArtificialTissueSampleTemplateSchema();
        this.setState({
          schema: tissueSampleTemplateSchema,
          wizardStep: WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE
        });
      }
    } else {
      const res = generateDocumentsFromDataset(data);
      this.setState({
        result: res,
        wizardStep: WIZARD_END
      });
    }
  };

  handleSubjectGroupSubmit = data => {
    this.setState({subjectGroups: data});
    const dataset = this.state.dataset;
    const studyTopic = getStudyTopic(dataset);
    if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE) {
      if (areTissueSamplesGrouped(dataset)) {
        const tissueSampleCollectionsSchema = getTissueSampleCollectionsSchema(dataset, data);
        this.setState({
          schema: tissueSampleCollectionsSchema,
          wizardStep: WIZARD_STEP_TISSUE_SAMPLE_GROUP
        });
      } else {
        const tissueSampleTemplateSchema = getTissueSampleTemplateSchema(data);
        this.setState({
          schema: tissueSampleTemplateSchema,
          wizardStep: WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE
        });        
      }
    } else { //studyTopic === STUDY_TOPIC_SUBJECT_VALUE
      const res = generateDocumentsFromDatasetAndSubjectGroups(dataset, data);
      this.setState({
        result: res,
        wizardStep: WIZARD_END
      });
    }
  };

  handleSubjectsSubmit = data => {
    const res = generateDocumentsFromDatasetAndSubjects(this.state.dataset, data);
    this.setState({
      subjects: data,
      result: res,
      wizardStep: WIZARD_END
    });
  };

  handleTissueSampleCollectionsSubmit = data => {
    const dataset = this.state.dataset;
    const studyTopic = getStudyTopic(dataset);
    const res = (studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE)?
      generateDocumentsFromDatasetAndArtificialTissueSampleCollections(dataset, data):
      generateDocumentsFromDatasetAndTissueSampleCollections(dataset, this.state.subjectGroups, data);
    this.setState({
      tissueSampleCollections: data,
      result: res,
      wizardStep: WIZARD_END
    });
  };

  handleTissueSamplesSubmit = data => {
    const dataset = this.state.dataset;
    const studyTopic = getStudyTopic(dataset);
    const res = (studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE)?
      generateDocumentsFromDatasetAndArtificialTissueSamples(dataset, data):
      generateDocumentsFromDatasetAndTissueSamples(dataset, this.state.subjectGroups, data);
    this.setState({
      tissueSamples: data,
      result: res,
      wizardStep: WIZARD_END
    });
  };

  handleSubjectTemplateSubmit = data => {
    if (JSON.stringify(data) !== JSON.stringify(this.state.subjectTemplate)) {
      const size = getNumberOfSubjects(this.state.dataset);
      const newSubjects = generateItemsFromTemplate(data, size);
      newSubjects.forEach((subject, index) => {
        if(subject.lookupLabel) {
          subject.lookupLabel = `${subject.lookupLabel} ${index + 1}`;
        }
      });
      this.setState({
        subjectTemplate: data,
        subjects: newSubjects
      });
    }
    const subjectsSchema = getSubjectsSchema();
    this.setState({
      schema: subjectsSchema,
      wizardStep: WIZARD_STEP_SUBJECTS
    });
  };

  handleTissueSampleTemplateSubmit = data => {
    const dataset = this.state.dataset;
    if (JSON.stringify(data) !== JSON.stringify(this.state.tissueSampleTemplate)) {
      const size = getNumberOfTissueSamples(dataset);
      const newTissueSamples = generateItemsFromTemplate(data, size);
      newTissueSamples.forEach((sample, index) => {
        if(sample.lookupLabel) {
          sample.lookupLabel = `${sample.lookupLabel} ${index + 1}`;
        }
      });
      this.setState({
        tissueSampleTemplate: data,
        tissueSamples: newTissueSamples
      });
    }
    const studyTopic = getStudyTopic(dataset);
    const tissueSamplesSchema = (studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE)?getArtificialTissueSamplesSchema():getTissueSamplesSchema(this.state.subjectGroups);
    this.setState({
      schema: tissueSamplesSchema,
      wizardStep: WIZARD_STEP_TISSUE_SAMPLES
    });
  };
 
  goBackToDatasetWizard = () => {
    this.setState({
      schema: datasetSchema,
      result: null,
      wizardStep: WIZARD_STEP_DATASET
    });
  };


  goBackToSubjectTemplateWizard = () => {  
    const subjectTemplateSchema = getSubjectTemplateSchema();
    this.setState({
      schema: subjectTemplateSchema,
      result: null,
      wizardStep: WIZARD_STEP_SUBJECT_TEMPLATE
    });
  };

  goBackToSubjectsWizard = () => {
    const subjectsSchema = getSubjectsSchema();
    this.setState({
      schema: subjectsSchema,
      result: null,
      wizardStep: WIZARD_STEP_SUBJECTS
    });
  };

  goBackToSubjectGroupsWizard = () => {
    const studyTopic = getStudyTopic(this.state.dataset);
    const subjectGroupsSchema = (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE)?getSubjectGroupsSchemaForTissueSample():getSubjectGroupsSchema();
    this.setState({
      schema: subjectGroupsSchema,
      result: null,
      wizardStep: WIZARD_STEP_SUBJECT_GROUP
    });
  };

  goBackToTissueSampleTemplateWizard = () => {
    const tissueSampleTemplateSchema = getArtificialTissueSampleTemplateSchema();
    this.setState({
      schema: tissueSampleTemplateSchema,
      result: null,
      wizardStep: WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE
    });
  };

  goBackToTissueSamplesWizard = () => {
    const studyTopic = getStudyTopic(this.state.dataset);
    const tissueSamplesSchema = (studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE)?getArtificialTissueSamplesSchema():getTissueSamplesSchema(this.state.subjectGroups)
    this.setState({
      schema: tissueSamplesSchema,
      result: null,
      wizardStep: WIZARD_STEP_TISSUE_SAMPLES
    });
  };

  goBackToTissueSampleCollectionsWizard = () => {
    const studyTopic = getStudyTopic(this.state.dataset);
    const tissueSampleCollectionsSchema = (studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE)?getArtificialTissueSampleCollectionsSchema():getTissueSampleCollectionsSchema(this.state.subjectGroups)
    this.setState({
      schema: tissueSampleCollectionsSchema,
      result: null,
      wizardStep: WIZARD_STEP_TISSUE_SAMPLE_GROUP
    });
  };

  handleGoBackToPreviousStepWizard = () => {
    const dataset = this.state.dataset;
    const studyTopic = getStudyTopic(dataset);
    switch (this.state.wizardStep) {
      case WIZARD_STEP_SUBJECT_GROUP:
      case WIZARD_STEP_SUBJECT_TEMPLATE:
        this.goBackToDatasetWizard();
        break;
      case WIZARD_STEP_TISSUE_SAMPLE_GROUP:
      case WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE:
        if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE) {
          this.goBackToSubjectGroupsWizard();
        } else { // if (studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE)
          this.goBackToDatasetWizard();
        }
        break;
      case WIZARD_STEP_SUBJECTS:
        this.goBackToSubjectTemplateWizard();
        break;
      case WIZARD_STEP_TISSUE_SAMPLES:
        this.goBackToTissueSampleTemplateWizard();
        break;
      case WIZARD_END:
        if (studyTopic === STUDY_TOPIC_SUBJECT_VALUE) {
          if (areSubjectsGrouped(dataset)) {
            this.goBackToSubjectGroupsWizard();
          } else {
            this.goBackToSubjectsWizard();
          }
        } else if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE || studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE) {
          if (areTissueSamplesGrouped(dataset)) {
            this.goBackToTissueSampleCollectionsWizard();  
          } else {
            this.goBackToTissueSamplesWizard();  
          }
        } else {
          this.goBackToDatasetWizard();
        }
        break;
      default:
        this.goBackToDatasetWizard();
        break;
    }
  };

  handleReset = () => {
    this.setState({
      dataset: undefined,
      subjectGroups: null,
      subjectTemplate: null,
      subjects: [],
      tissueSamples: [],
      tissueSampleCollections: [],
      tissueSampleTemplate: null,
      schema: datasetSchema,
      result: null,
      wizardStep: WIZARD_STEP_DATASET
    });
  };

  render() {
    const schema = this.state.schema;
    switch (this.state.wizardStep) {
      case WIZARD_STEP_DATASET:
        return (
          <DatasetWizard schema={schema} formData={this.state.dataset} onSubmit={this.handleDatasetSubmit} />
        );
      case WIZARD_STEP_SUBJECT_GROUP:
        return (
          <SubjectGroupWizard schema={schema} formData={this.state.subjectGroups} onSubmit={this.handleSubjectGroupSubmit} onBack={this.handleGoBackToPreviousStepWizard} />
        );
      case WIZARD_STEP_SUBJECT_TEMPLATE:
        return (
          <SubjectTemplateWizard schema={schema} formData={this.state.subjectTemplate} onSubmit={this.handleSubjectTemplateSubmit} onBack={this.handleGoBackToPreviousStepWizard} />
        );
      case WIZARD_STEP_SUBJECTS:
        return (
          <SubjectsWizard schema={schema} formData={this.state.subjects} onSubmit={this.handleSubjectsSubmit} onBack={this.handleGoBackToPreviousStepWizard} />
        );
      case WIZARD_STEP_TISSUE_SAMPLE_GROUP:
        return (
          <TissueSampleCollectionWizard schema={schema} formData={this.state.tissueSampleCollections} onSubmit={this.handleTissueSampleCollectionsSubmit} onBack={this.handleGoBackToPreviousStepWizard} />
        );
      case WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE:
        return (
          <TissueSampleTemplateWizard schema={schema} formData={this.state.tissueSampleTemplate} onSubmit={this.handleTissueSampleTemplateSubmit} onBack={this.handleGoBackToPreviousStepWizard} />
        );
      case WIZARD_STEP_TISSUE_SAMPLES:
        return (
          <TissueSamplesWizard schema={schema} formData={this.state.tissueSamples} onSubmit={this.handleTissueSamplesSubmit} onBack={this.handleGoBackToPreviousStepWizard} />
        );
      default:
        return (
          <Result result={this.state.result} onBack={this.handleGoBackToPreviousStepWizard} onReset={this.handleReset} />
        );
    }
  }
};

export default Wizard;