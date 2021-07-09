import _  from "lodash-uuid";

import * as subjectSchemaModule from '../schema/subjectSchema.json';
import * as tissueSampleSchemaModule from '../schema/tissueSampleSchema.json'; 

const subjectSchema = subjectSchemaModule.default;
const tissueSampleSchema = tissueSampleSchemaModule.default;

const getSubjectEnumList =  subjects => {
  return subjects.reduce((acc, subject) => subject.studiedStates.reduce((acc2, state) => {
    acc2.push({
      id: _.uuid(),
      name: `${subject.lookupLabel} [${state.ageCategory.value}${state.ageCategory.unit} - ${state.weight.value}${state.weight.unit}]`
    });
    return acc2;
  }, acc), []);
};

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

export const getArtificialTissueSampleTemplateSchema = () => ({...tissueSampleSchema, title: "Tissue sample template"});

export const getTissueSampleTemplateSchema = subjects => {
  const subjectEnumList = getSubjectEnumList(subjects);
  const schema =  {
    ...tissueSampleSchema,
    title: "Tissue sample template"
  };
  schema.properties.studiedStates.items.properties.subjectGroupState = {
    type: "string",
    title: "Subject state",
    enum: subjectEnumList.map(e => e.id),
    enumNames: subjectEnumList.map(e => e.name)
  };
  return schema;
};

export const getSubjectGroupsSchema = dataset => {
  const items = JSON.parse(JSON.stringify(subjectSchema));
  items.properties.quantity = {
    type: "number",
    title: "Number of subjects",
    default: getNumberOfSubjects(dataset)
  };
  return {
    title: "Subject groups",
    type: "array",
    minItems: 1,
    items: items
  };
};

export const getSubjectGroupsSchemaForTissueSample = () => {
  const items = JSON.parse(JSON.stringify(subjectSchema));
  return {
    title: "Subject(s) of all your tissue samples",
    type: "array",
    minItems: 1,
    items: items
  };
};

export const getSubjectsSchema = () => {
  const items = JSON.parse(JSON.stringify(subjectSchema));
  return {
    title: "Subjects",
    type: "array",
    minItems: 1,
    items: items
  };
};

export const getArtificialTissueSamplesSchema = () => {
  const items = JSON.parse(JSON.stringify(tissueSampleSchema));
  return {
    title: "Tissue samples",
    type: "array",
    minItems: 1,
    items: items
  };
};

export const getTissueSamplesSchema = subjects => {
  const subjectEnumList = getSubjectEnumList(subjects);
  const schema = getArtificialTissueSamplesSchema();
  schema.items.properties.subject = {
    type: "string",
    title: "Subject",
    enum: subjectEnumList.map(e => e.id),
    enumNames: subjectEnumList.map(e => e.name)
  };
  return schema;
};

export const getTissueSampleCollectionsSchema = dataset => {
  const items = JSON.parse(JSON.stringify(tissueSampleSchema))
  items.properties.quantity = {
    type: "number",
    title: "Number of tissue samples",
    default: getNumberOfTissueSamples(dataset)
  };
  return {
    title: "Tissue sample collections",
    type: "array",
    minItems: 1,
    items: items
  };
};

export const generateItemsFromTemplate = (template, size) => [...Array(size).keys()].map(() => JSON.parse(JSON.stringify(template)));
