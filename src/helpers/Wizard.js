import * as subjectSchemaModule from '../schema/subjectSchema.json';
import * as tissueSampleSchemaModule from '../schema/tissueSampleSchema.json'; 

const subjectSchema = subjectSchemaModule.default;
const tissueSampleSchema = tissueSampleSchemaModule.default;

export const areSubjectsGrouped = dataset => !dataset || !dataset.individualSubjects;

export const areTissueSamplesGrouped = dataset => !dataset || !dataset.individualTissueSamples;

export const getNumberOfSubjects = dataset => {
  const number = dataset?Number(dataset.numberOfSubjects):NaN;
  return isNaN(number)?0:number;
};

export const getNumberOfTissueSamples = dataset => {
  const number = dataset?Number(dataset.numberOfTissueSamples):NaN;
  return isNaN(number)?0:number;
};

export const getStudyTopic = dataset => dataset?dataset.studyTopic:undefined;

export const getSubjectTemplateSchema = () => ({...subjectSchema, title: "Subject template"});

export const getTissueSampleTemplateSchema = () => ({...tissueSampleSchema, title: "Tissue sample template"});

export const getSubjectGroupsSchema = dataset => {
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

export const getSubjectsSchema = () => {
  const items = JSON.parse(JSON.stringify(subjectSchema));
  return {
    "title": "Subjects",
    "type": "array",
    "minItems": 1,
    "items": items
  };
};

export const getTissueSamplesSchema = () => {
  const items = JSON.parse(JSON.stringify(tissueSampleSchema));
  return {
    "title": "Tissue samples",
    "type": "array",
    "minItems": 1,
    "items": items
  };
};

export const getTissueSampleGroupsSchema = dataset => {
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