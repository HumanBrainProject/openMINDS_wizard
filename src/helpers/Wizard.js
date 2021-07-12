import * as datasetSchemaModule from '../schemas/datasetSchema.json';
import * as generalSchemaModule from '../schemas/generalSchema.json';
import * as experimentSchemaModule from '../schemas/experimentSchema.json';
import * as subjectSchemaModule from '../schemas/subjectSchema.json';
import * as tissueSampleSchemaModule from '../schemas/tissueSampleSchema.json'; 

import * as biologicalSexModule from '../controlledTerms/biologicalSex.json'; 
import * as cellTypeModule from '../controlledTerms/cellType.json'; 
import * as ethicsAssessmentModule from '../controlledTerms/ethicsAssessment.json'; 
import * as experimentalApproachModule from '../controlledTerms/experimentalApproach.json'; 
import * as licenseModule from '../controlledTerms/license.json'; 
import * as phenotypeModule from '../controlledTerms/phenotype.json'; 
import * as productAccessibilityModule from '../controlledTerms/productAccessibility.json'; 
import * as semanticDataTypeModule from '../controlledTerms/semanticDataType.json'; 
import * as speciesModule from '../controlledTerms/species.json'; 
import * as strainModule from '../controlledTerms/strain.json'; 
import * as tissueSampleTypeModule from '../controlledTerms/tissueSampleType.json'; 
import * as unitOfMeasurementModule from '../controlledTerms/unitOfMeasurement.json'; 

const controlledTerms = {
  biologicalSex: biologicalSexModule.default,
	cellType: cellTypeModule.default,
	ethicsAssessment: ethicsAssessmentModule.default,
	experimentalApproach: experimentalApproachModule.default,
	license: licenseModule.default,
	phenotype: phenotypeModule.default,
	productAccessibility: productAccessibilityModule.default,
	semanticDataType: semanticDataTypeModule.default,
	species: speciesModule.default,
	strain: strainModule.default,
	tissueSampleType: tissueSampleTypeModule.default,
  unitOfMeasurement: unitOfMeasurementModule.default
};

const getUnitOfMeasurementLabel = identifier => {
  const item = controlledTerms.unitOfMeasurement.find(e => e.identifier === identifier);
  return item?item.name:"";
};

const populateSchemaWithControlledTerms = schema => {
  if (typeof schema === "object") {
    switch (schema.type) {
      case "object":
        typeof schema.definitions === "object" && Object.values(schema.definitions).forEach(element => populateSchemaWithControlledTerms(element));
        typeof schema.properties === "object" && Object.values(schema.properties).forEach(element => populateSchemaWithControlledTerms(element));
        typeof schema.dependencies === "object" && Object.entries(schema.dependencies).forEach(([dependency, object]) => {
          Array.isArray(object.oneOf) && object.oneOf.forEach(dependent => {
            dependent.properties === "object" && Object.entries(dependent.properties)
              .filter(([key]) => key !== dependency)
              .forEach(([, element]) => populateSchemaWithControlledTerms(element));
          });
        });
        break;
      case "array":
        populateSchemaWithControlledTerms(schema.items);
        break;
      case "string":
        const controlledTerm = schema.controlledTerm && controlledTerms[schema.controlledTerm];
        if (controlledTerm) {
          schema.enum = controlledTerm.map(term => term.identifier);
          schema.enumNames = controlledTerm.map(term => term.name);
        }
        break;
      default:
        break;
    }
  }
  return schema;
};

export const getSubjectStateEnum = (subject, subjectState) => `${subject.lookupLabel} [${subjectState.age.value}${getUnitOfMeasurementLabel(subjectState.age.unit)} - ${subjectState.weight.value}${getUnitOfMeasurementLabel(subjectState.weight.unit)}]`;

const getSubjectEnumList =  subjects => {
  return subjects.reduce((acc, subject) => subject.studiedStates.reduce((acc2, state) => {
    acc2.push(getSubjectStateEnum(subject, state));
    return acc2;
  }, acc), []);
};

export const datasetSchema = populateSchemaWithControlledTerms(datasetSchemaModule.default);
export const generalSchema = populateSchemaWithControlledTerms(generalSchemaModule.default);
export const experimentSchema = populateSchemaWithControlledTerms(experimentSchemaModule.default);
export const subjectSchema = populateSchemaWithControlledTerms(subjectSchemaModule.default);
export const tissueSampleSchema = populateSchemaWithControlledTerms(tissueSampleSchemaModule.default);

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
    enum: subjectEnumList
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

export const getTissueSamplesSchema = () => {
  const items = JSON.parse(JSON.stringify(tissueSampleSchema));
  return {
    title: "Tissue samples",
    type: "array",
    minItems: 1,
    items: items
  };
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
