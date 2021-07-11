import _  from "lodash-uuid";

const OPENMINDS_VOCAB = "https://openminds.ebrains.eu/vocab/";
const EBRAINS_VOCAB = "https://kg.ebrains.eu/api/instances/";

const createDocument = (documents, type, key) => {
    if (key && documents.keys[type] && documents.keys[type][key]) {
        return documents.keys[type][key];
    }
    const id = `${EBRAINS_VOCAB}${_.uuid()}`;
    const doc = {
        "@id": id,
        "@type": [type]
    }
    documents.ids[id] = doc;
    if (key) {
        if (!documents.keys[type]) {
            documents.keys[type] = {};
        }
        documents.keys[type][key] = id;
    }
    return id;
};

const createDocuments = (documents, source, documentGenerator) => {
    if (source === null || source === undefined) {
        return [];
    }

    const sourceList = Array.isArray(source)?source:[source];
    if (!sourceList.length) {
        return [];
    }

    const ids = sourceList
        .filter(item => item !== null && item !== undefined)
        .map(item => documentGenerator(documents, item));
    return ids;
};

const setProperty = (object, name, value) => {
    if (Array.isArray(value)) {
        if (value.length) {
            object[`${OPENMINDS_VOCAB}${name}`] = value;
        }
    } else if (value !== null && value !== undefined && value !== "") {
        object[`${OPENMINDS_VOCAB}${name}`] = value;
    }
};

const setPropertyWithLinks = (object, name, value) => {
    if (Array.isArray(value)) {
        const values = value.map(id => ({"@id": id}));
        setProperty(object, name, values);
    } else if (value !== null && value !== undefined && value !== "") {
        setProperty(object, name, {"@id": value})
    }
};

const setPropertyWithLinksCreation = (documents, object, name, source, documentGenerator) => {
    const ids = createDocuments(documents, source, documentGenerator);
    setPropertyWithLinks(documents, object, name, ids);
};

const createCopyrightDocument = (documents, copyright) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}Copyright`, `${copyright.year}-${copyright.holder}`);
  const target = documents.ids[id];
  setProperty(target, "year", copyright.year);
  setProperty(target, "holder", copyright.holder);
  return id;
};

const createPersonDocument = (documents, author) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}Person`, `${author.familyName}-${author.givenName}`);
    const target = documents.ids[id];
    setProperty(target, "familyName", author.familyName);
    setProperty(target, "givenName", author.givenName);
    return id;
};

const createProtocolExecutionDocument = (documents, protocol) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}ProtocolExecution`, `${protocol.input}-${protocol.output}`);
    const target = documents.ids[id];
    setPropertyWithLinks(target, "input", protocol.input);
    setPropertyWithLinks(target, "output", protocol.output);
    return id;
};

const createQuantitativeValueDocument= (documents, quantitativeValue) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}QuantitativeValue`);
    const target = documents.ids[id];
    setProperty(target, "value", quantitativeValue.value);
    setPropertyWithLinks(target, "unit", quantitativeValue.unit);
    return id;
};

const createSubjectStateDocument = (documents, studiedState) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}SubjectState`);
    const target = documents.ids[id];
    setPropertyWithLinksCreation(documents, target, "age", studiedState.ageCategory, createQuantitativeValueDocument);
    setPropertyWithLinksCreation(documents, target, "weight", studiedState.weight, createQuantitativeValueDocument);
    return id;
};

const createSubjectGroupStateDocument = (documents, studiedState) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}SubjectGroupState`);
    const target = documents.ids[id];
    setPropertyWithLinksCreation(documents, target, "age", studiedState.ageCategory, createQuantitativeValueDocument);
    setPropertyWithLinksCreation(documents, target, "weight", studiedState.weight, createQuantitativeValueDocument);
    return id;
};

const createTissueSampleStateDocument = (documents, studiedState) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}TissueSampleState`);
    const target = documents.ids[id];
    setPropertyWithLinksCreation(documents, target, "age", studiedState.ageCategory, createQuantitativeValueDocument);
    setPropertyWithLinksCreation(documents, target, "weight", studiedState.weight, createQuantitativeValueDocument);
    if (studiedState.subjectGroupState) {
        const subjectGroupStateId = `${EBRAINS_VOCAB}${studiedState.subjectGroupState}`;
        if (documents.ids[subjectGroupStateId]) {
            const protocolExecution = {
                input: subjectGroupStateId,
                output: id
            };
            createProtocolExecutionDocument(documents, protocolExecution);
        }
    }
    return id;
};

const createTissueSampleCollectionStateDocument = (documents, studiedState) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}TissueSampleCollectionState`);
    const target = documents.ids[id];
    setPropertyWithLinksCreation(documents, target, "age", studiedState.ageCategory, createQuantitativeValueDocument);
    setPropertyWithLinksCreation(documents, target, "weight", studiedState.weight, createQuantitativeValueDocument);
    if (studiedState.subjectGroupState) {
        const subjectGroupStateId = `${EBRAINS_VOCAB}${studiedState.subjectGroupState}`;
        if (documents.ids[subjectGroupStateId]) {
            const subjectGroupStateId = createDocument(documents, `${OPENMINDS_VOCAB}SubjectGroupState`, studiedState.subjectGroupState);
            const protocolExecution = {
                input: subjectGroupStateId,
                output: id
            };
            createProtocolExecutionDocument(documents, protocolExecution);
        }
    }
    return id;
};

const createSubjectDocument = (documents, source) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}Subject`, source.lookupLabel);
    const target = documents.ids[id];
    setProperty(target, "lookupLabel", source.lookupLabel);
    setPropertyWithLinks(target, "species", source.species);
    setPropertyWithLinks(target, "strain", source.strains);
    setPropertyWithLinks(target, "biologicalSex", source.biologicalSex);
    setPropertyWithLinksCreation(documents, target, "studiedState", source.studiedStates, createSubjectStateDocument);
    return id;
};

const createSubjectGroupDocument = (documents, source) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}SubjectGroup`, source.lookupLabel);
    const target = documents.ids[id];
    setProperty(target, "lookupLabel", source.lookupLabel);
    setProperty(target, "quantity", source.quantity);
    setPropertyWithLinks(target, "species", source.species);
    setPropertyWithLinks(target, "strain", source.strains);
    setPropertyWithLinks(target, "biologicalSex", source.biologicalSex);
    setPropertyWithLinks(target, "phenotype", source.phenotype);
    setPropertyWithLinksCreation(documents, target, "studiedState", source.studiedStates, createSubjectGroupStateDocument);
    return id;
};

const createTissueSampleDocument = (documents, source) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}TissueSample`, source.lookupLabel);
    const target = documents.ids[id];
    setProperty(target, "lookupLabel", source.lookupLabel);
    setPropertyWithLinks(target, "type", source.typesOfTheTissue);
    setPropertyWithLinks(target, "species", source.species);
    setPropertyWithLinks(target, "strain", source.strains);
    setPropertyWithLinks(target, "biologicalSex", source.biologicalSex);
    setPropertyWithLinks(target, "origin", source.origin);
    setPropertyWithLinksCreation(documents, target, "studiedState", source.studiedStates, createTissueSampleStateDocument);
    return id;
};

const createTissueSampleCollectionDocument = (documents, source) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}TissueSampleCollection`, source.lookupLabel);
    const target = documents.ids[id];
    setProperty(target, "lookupLabel", source.lookupLabel);
    setProperty(target, "quantity", source.quantity);
    setPropertyWithLinks(target, "type", source.typesOfTheTissue);
    setPropertyWithLinks(target, "species", source.species);
    setPropertyWithLinks(target, "strain", source.strains);
    setPropertyWithLinks(target, "biologicalSex", source.biologicalSex);
    setPropertyWithLinks(target, "origin", source.origin);
    setPropertyWithLinksCreation(documents, target, "studiedState", source.studiedStates, createTissueSampleCollectionStateDocument);
    return id;
};

const createDigitalIdentifierDocument = (documents, doi) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}DigitalIdentifier`, doi);
  const target = documents.ids[id];
  setProperty(target, "identifier", doi);
  return id;
};

const createFullDocumentationDocument = (documents, fullDocumentation) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}FullDocumentation`, fullDocumentation);
  const target = documents.ids[id];
  setProperty(target, "name", fullDocumentation);
  return id;  
}

const createFundingDocument = (documents, funding) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}Funding`, funding);
  const target = documents.ids[id];
  setProperty(target, "awardTitle", funding);
  return id;  
}

const createRepositoryDocument = (documents, repository) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}FileRepository`, repository);
  const target = documents.ids[id];
  setProperty(target, "IRI", repository);
  return id;
};

const createRelatedPublicationDocument = (documents, relatedPublication) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}DOI`, relatedPublication);
  const target = documents.ids[id];
  setProperty(target, "identifier", relatedPublication);
  return id;
};

const createContributionTypeDocument = (documents, contributionType) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}ContributionType`, contributionType);
  const target = documents.ids[id];
  setProperty(target, "name", contributionType);
  return id;
};

const createOtherContributionDocument = (documents, otherContribution) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}OtherContribution`);
  const target = documents.ids[id];
  setPropertyWithLinksCreation(documents, target, "contributionType", otherContribution.contributionType, createContributionTypeDocument);
  setPropertyWithLinksCreation(documents, target, "contributor", otherContribution.contributor, createPersonDocument);
  return id;
};


//TODO: Check which is the most generic type 
const createInputDataDocument = (documents, inputData) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}InputData`, inputData);
    const target = documents.ids[id];
    setProperty(target, "identifier", inputData);
    return id;
  };


const createDatasetDocument = (documents, source) => {
    const datasetId = createDocument(documents, `${OPENMINDS_VOCAB}DatasetVersion`, source.name);
    const dataset = documents.ids[datasetId];

    setPropertyWithLinks(dataset, "accessibility", [source.accessibility]);
    setProperty(dataset, "description", source.description);
    setProperty(dataset, "name", source.name);
    setProperty(dataset, "keyword", source.keyword);
    setProperty(dataset, "homepage", source.homepage);
    setProperty(dataset, "releasedDate", source.releasedDate);
    setProperty(dataset, "versionIdentifier", source.versionNumber);
    setProperty(dataset, "supportChannel", source.supportChannel);
    
    if(source.doi) {
      if(source.doi.doi === "No") {
        setPropertyWithLinksCreation(documents, dataset, "author", source.doi.authors, createPersonDocument);
      }
      if(source.doi.doi === "Yes") {
        setPropertyWithLinksCreation(documents, dataset, "digitalIdentifier", source.doi.value, createDigitalIdentifierDocument);
      }
    }
    setPropertyWithLinksCreation(documents, dataset, "custodian", source.custodian, createPersonDocument);
    setPropertyWithLinksCreation(documents, dataset, "copyright", source.copyrightHolderAndYear, createCopyrightDocument);
    setPropertyWithLinks(dataset, "ethicsAssessment", source.ethicsAssessment);
    setPropertyWithLinks(dataset, "experimentalApproach", source.experimentalApproach);
    setPropertyWithLinksCreation(documents, dataset, "fullDocumentation", source.fullDocumentation, createFullDocumentationDocument);
    setPropertyWithLinksCreation(documents, dataset, "funding", source.funding, createFundingDocument);
    setPropertyWithLinks(dataset, "license", source.license);
    setPropertyWithLinksCreation(documents, dataset, "repository", source.repositoryUrl, createRepositoryDocument);
    setPropertyWithLinksCreation(documents, dataset, "relatedPublication", source.relatedPublication, createRelatedPublicationDocument);
    setPropertyWithLinks(dataset, "type", source.type);
    setPropertyWithLinksCreation(documents, dataset, "otherContribution", source.otherContribution, createOtherContributionDocument);
    setPropertyWithLinksCreation(documents, dataset, "inputData", source.inputData, createInputDataDocument);

    return datasetId;
};

const generateDocuments = (documents, dataset, studiedSpecimen, studiedSpecimenDocumentGenerator) =>  {
    const datasetDocId = createDatasetDocument(documents, dataset);
    const datasetDoc = documents.ids[datasetDocId];
    setPropertyWithLinksCreation(documents, datasetDoc, "studiedSpecimen", studiedSpecimen, studiedSpecimenDocumentGenerator);
};
    
export const generateDocumentsFromDataset = dataset => {
    const documents = {ids: {}, keys: {}};
    generateDocuments(documents, dataset, null, () => null);
    return Object.values(documents.ids);
};
    
export const generateDocumentsFromDatasetAndSubjectGroups = (dataset, subjectsGroups) => {
    const documents = {ids: {}, keys: {}};
    generateDocuments(documents, dataset, subjectsGroups, createSubjectGroupDocument);
    return Object.values(documents.ids);
};
    
export const generateDocumentsFromDatasetAndSubjects = (dataset, subjects) => {
    const documents = {ids: {}, keys: {}};
    generateDocuments(documents, dataset, subjects, createSubjectDocument);
    return Object.values(documents.ids);
};
    
export const generateDocumentsFromDatasetAndTissueSampleCollections = (dataset, subjectGroups, tissueSampleCollections) => {
    const documents = {ids: {}, keys: {}};
    createDocuments(documents, subjectGroups, createSubjectDocument);
    generateDocuments(documents, dataset, tissueSampleCollections, createTissueSampleCollectionDocument);
    return Object.values(documents.ids);
}; 

export const generateDocumentsFromDatasetAndArtificialTissueSampleCollections = (dataset, tissueSampleCollections) => {
    const documents = {ids: {}, keys: {}};
    generateDocuments(documents, dataset, tissueSampleCollections, createTissueSampleCollectionDocument);
    return Object.values(documents.ids);
};

export const generateDocumentsFromDatasetAndTissueSamples = (dataset, subjectGroups, tissueSamples) => {
    const documents = {ids: {}, keys: {}};
    createDocuments(documents, subjectGroups, createSubjectDocument);
    generateDocuments(documents, dataset, tissueSamples, createTissueSampleDocument);
    return Object.values(documents.ids);
};

export const generateDocumentsFromDatasetAndArtificialTissueSamples = (dataset, tissueSamples) => {
    const documents = {ids: {}, keys: {}};
    generateDocuments(documents, dataset, tissueSamples, createTissueSampleDocument);
    return Object.values(documents.ids);
};
