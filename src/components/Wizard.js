import React from 'react';

import GeneralWizard from './Wizard/GeneralWizard';
import ReferencesAndContributionsWizard from './Wizard/ReferencesAndContributionsWizard';
import ResourcesAndLegalWizard from './Wizard/ResourcesAndLegalWizard';
import ExperimentWizard from './Wizard/ExperimentWizard.js';
import SubjectGroupWizard from './Wizard/SubjectGroupWizard';
import SubjectTemplateWizard from './Wizard/SubjectTemplateWizard';
import SubjectsWizard from './Wizard/SubjectsWizard';
import TissueSampleCollectionWizard from './Wizard/TissueSampleCollectionWizard';
import TissueSampleTemplateWizard from './Wizard/TissueSampleTemplateWizard';
import TissueSamplesWizard from './Wizard/TissueSamplesWizard';
import Result from './Result';

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
  generalSchema,
  experimentSchema,
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
  getTissueSampleCollectionsSchema,
  generateItemsFromTemplate
} from '../helpers/Wizard';

import * as referencesAndContributionsModule from '../schemas/referencesAndContributions.json';
import * as resourcesAndLegalModule from '../schemas/resourcesAndLegal.json';

const referencesAndContributionsSchema = referencesAndContributionsModule.default;
const resourcesAndLegalSchema = resourcesAndLegalModule.default;

const STUDY_TOPIC_SUBJECT_VALUE = "Subject";
const STUDY_TOPIC_TISSUE_SAMPLE_VALUE = "Tissue sample";
const STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE = "Artificial tissue sample";

const WIZARD_STEP_GENERAL = "WIZARD_STEP_GENERAL";
const WIZARD_STEP_REFERENCES_AND_CONTRIBUTIONS = "WIZARD_STEP_REFERENCES_AND_CONTRIBUTIONS";
const WIZARD_STEP_RESOURCES_AND_LEGAL = "WIZARD_STEP_RESOURCES_AND_LEGAL";
const WIZARD_STEP_EXPERIMENT = "WIZARD_STEP_EXPERIMENT";
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
      general: undefined,
      referencesAndContributions: undefined,
      resourcesAndLegal: undefined,
      experiment: undefined,
      subjectGroups: undefined,
      subjectTemplate: undefined,
      subjects: [],
      tissueSampleCollections: undefined,
      tissueSampleTemplate: undefined,
      tissueSamples: [],
      wizardStep: WIZARD_STEP_GENERAL,
      schema: generalSchema,
      result: undefined
    }
  }

  handleGeneralSubmit = data => {
    this.setState({
      general: data,
      wizardStep: WIZARD_STEP_REFERENCES_AND_CONTRIBUTIONS,
      schema: referencesAndContributionsSchema
    });
  };

  handleReferencesAndContributionsSubmit = data => {
    this.setState({
      referencesAndContributions: data,
      wizardStep: WIZARD_STEP_RESOURCES_AND_LEGAL,
      schema: resourcesAndLegalSchema
    });
  }

  handleResourcesAndLegalSubmit = data => {
    this.setState({
      resourcesAndLegal: data,
      wizardStep: WIZARD_STEP_EXPERIMENT,
      schema: experimentSchema
    });
  }

  handleExperimentSubmit = data => {
    const studyTopic = getStudyTopic(data);
    const dataset = {...this.state.general, ...this.state.referencesAndContributions, ...this.state.resourcesAndLegal, ...data};
    this.setState(prevState => ({
      dataset: {...prevState.general, ...prevState.referencesAndContributions, ...prevState.resourcesAndLegal, ...data}, 
      experiment: data
    }));
    
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
        const tissueSampleCollectionsSchema = getTissueSampleCollectionsSchema(data);
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
      const res = generateDocumentsFromDataset(dataset);
      this.setState({
        result: res,
        wizardStep: WIZARD_END
      });
    }
  }

  handleSubjectGroupSubmit = data => {
    this.setState({subjectGroups: data});
    const dataset = this.state.dataset;
    const studyTopic = getStudyTopic(dataset);
    if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE) {
      if (areTissueSamplesGrouped(dataset)) {
        const tissueSampleCollectionsSchema = getTissueSampleCollectionsSchema(dataset);
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
    const tissueSamplesSchema = getTissueSamplesSchema();
    this.setState({
      schema: tissueSamplesSchema,
      wizardStep: WIZARD_STEP_TISSUE_SAMPLES
    });
  };

  goBackToGeneralWizard = () => {
    this.setState({
      schema: generalSchema,
      wizardStep: WIZARD_STEP_GENERAL
    });
  }

  goBackToReferencesAndContributions = () => {
    this.setState({
      schema: referencesAndContributionsSchema,
      wizardStep: WIZARD_STEP_REFERENCES_AND_CONTRIBUTIONS
    });
  };

  goBackToResourcesAndLegal = () => {
    this.setState({
      schema: resourcesAndLegalSchema,
      wizardStep: WIZARD_STEP_RESOURCES_AND_LEGAL
    });
  }

  goBackToExperiment = () => {
    this.setState({
      schema: experimentSchema,
      wizardStep: WIZARD_STEP_EXPERIMENT
    });
  }

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
    const tissueSamplesSchema = getTissueSamplesSchema()
    this.setState({
      schema: tissueSamplesSchema,
      result: null,
      wizardStep: WIZARD_STEP_TISSUE_SAMPLES
    });
  };

  goBackToTissueSampleCollectionsWizard = () => {
    const tissueSampleCollectionsSchema = getTissueSampleCollectionsSchema(this.state.dataset)
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
        this.goBackToExperiment();
        break;
      case WIZARD_STEP_REFERENCES_AND_CONTRIBUTIONS:
        this.goBackToGeneralWizard();
        break;
      case WIZARD_STEP_RESOURCES_AND_LEGAL:
        this.goBackToReferencesAndContributions();
        break;
      case WIZARD_STEP_EXPERIMENT:
        this.goBackToResourcesAndLegal();
        break;
      case WIZARD_STEP_TISSUE_SAMPLE_GROUP:
      case WIZARD_STEP_TISSUE_SAMPLE_TEMPLATE:
        if (studyTopic === STUDY_TOPIC_TISSUE_SAMPLE_VALUE) {
          this.goBackToSubjectGroupsWizard();
        } else { // if (studyTopic === STUDY_TOPIC_ARTIFICIAL_TISSUE_SAMPLE_VALUE)
          this.goBackToExperiment();
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
          this.goBackToExperiment();
        }
        break;
      default:
        this.goBackToExperiment();
        break;
    }
  };

  handleReset = () => {
    this.setState({
      dataset: undefined,
      general: undefined,
      referencesAndContributions: undefined,
      resourcesAndLegal: undefined,
      experiment: undefined,
      subjectGroups: null,
      subjectTemplate: null,
      subjects: [],
      tissueSamples: [],
      tissueSampleCollections: [],
      tissueSampleTemplate: null,
      schema: generalSchema,
      result: null,
      wizardStep: WIZARD_STEP_GENERAL
    });
  };

  render() {
    const schema = this.state.schema;
    switch (this.state.wizardStep) {
      case WIZARD_STEP_GENERAL:
        return (
          <GeneralWizard schema={schema} formData={this.state.general} onSubmit={this.handleGeneralSubmit} />
        );
      case WIZARD_STEP_REFERENCES_AND_CONTRIBUTIONS:
        return (
          <ReferencesAndContributionsWizard schema={schema} formData={this.state.referencesAndContributions} onSubmit={this.handleReferencesAndContributionsSubmit} onBack={this.handleGoBackToPreviousStepWizard} />
        );
      case WIZARD_STEP_RESOURCES_AND_LEGAL:
        return (
          <ResourcesAndLegalWizard schema={schema} formData={this.state.resourcesAndLegal} onSubmit={this.handleResourcesAndLegalSubmit} onBack={this.handleGoBackToPreviousStepWizard} />
        );
      case WIZARD_STEP_EXPERIMENT:
        return (
          <ExperimentWizard schema={schema} formData={this.state.experiment} onSubmit={this.handleExperimentSubmit} onBack={this.handleGoBackToPreviousStepWizard} />
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