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

const setProperty = (object, name, value) => {
    if (value !== null && value !== undefined && value !== "") {
        object[`${OPENMINDS_VOCAB}${name}`] = value;
    }
};

const setPropertyWithLinks = (documents, object, name, source, documentGenerator) => {
    if (source === null || source === undefined || typeof object !== "object") {
        return;
    }
    const sourceList = Array.isArray(source)?source:[source];
    if (sourceList.length) {
        const ids = sourceList
            .filter(item => item !== null && item !== undefined)
            .map(item => ({
                "@id": documentGenerator(documents, item)
            }));
        setProperty(object, name, ids);
    }
};

const createAccessibilityDocument = (documents, accessibility) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}Accessibility`, accessibility);
    const target = documents.ids[id];
    setProperty(target, "name", accessibility);
    return id;
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

const createEthicsAssessmentDocument = (documents, ethicsAssessment) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}EthicsAssessment`, ethicsAssessment);
  const target = documents.ids[id];
  setProperty(target, "name", ethicsAssessment);
  return id;
};

const createSpeciesDocument = (documents, species) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}Species`, species);
    const target = documents.ids[id];
    setProperty(target, "name", species);
    return id;
};

const createStrainDocument = (documents, strain) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}Strain`, strain);
    const target = documents.ids[id];
    setProperty(target, "name", strain);
    return id;
};

const createBiologicalSexDocument = (documents, biologicalSex) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}BiologicalSex`, biologicalSex);
    const target = documents.ids[id];
    setProperty(target, "name", biologicalSex);
    return id;
};

const createProtocol = (documents, protocol) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}Protocol`, protocol.name);
    const target = documents.ids[id];
    setProperty(target, "name", protocol.name);
    setProperty(target, "description", protocol.description);
    return id;
};

const createPhenotypeDocument = (documents, phenotype) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}Phenotype`, phenotype);
    const target = documents.ids[id];
    setProperty(target, "name", phenotype);
    return id;
};

const createTypeDocument = (documents, type) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}Type`, type);
    const target = documents.ids[id];
    setProperty(target, "name", type);
    return id;
};

const createCellTypeDocument = (documents, cellType) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}CellType`, cellType);
    const target = documents.ids[id];
    setProperty(target, "name", cellType);
    return id;
};

const createUnitDocument = (documents, unit) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}Unit`, unit);
    const target = documents.ids[id];
    setProperty(target, "name", unit);
    return id;
};

const createQuantitativeValueDocument= (documents, quantitativeValue) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}QuantitativeValue`);
    const target = documents.ids[id];
    setProperty(target, "value", quantitativeValue.value);
    setPropertyWithLinks(documents, target, "unit", quantitativeValue.unit, createUnitDocument);
    return id;
};

const createStudiedStateDocument = (documents, studiedState) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}StudiedState`);
    const target = documents.ids[id];
    setPropertyWithLinks(documents, target, "age", studiedState.ageCategory, createQuantitativeValueDocument);
    setPropertyWithLinks(documents, target, "weight", studiedState.weight, createQuantitativeValueDocument);
    return id;
};

const createSubjectDocument = (documents, source) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}Subject`, source.lookupLabel);
    const target = documents.ids[id];
    setProperty(target, "lookupLabel", source.lookupLabel);
    setPropertyWithLinks(documents, target, "species", source.species, createSpeciesDocument);
    setPropertyWithLinks(documents, target, "strain", source.strains, createStrainDocument);
    setPropertyWithLinks(documents, target, "biologicalSex", source.biologicalSex, createBiologicalSexDocument);
    setPropertyWithLinks(documents, target, "studiedState", source.studyState?.state, createStudiedStateDocument);
    return id;
};

const createSubjectGroupDocument = (documents, source) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}SubjectGroup`, source.lookupLabel);
    const target = documents.ids[id];
    setProperty(target, "lookupLabel", source.lookupLabel);
    setProperty(target, "quantity", source.quantity);
    setPropertyWithLinks(documents, target, "species", source.species, createSpeciesDocument);
    setPropertyWithLinks(documents, target, "strain", source.strains, createStrainDocument);
    setPropertyWithLinks(documents, target, "biologicalSex", source.biologicalSex, createBiologicalSexDocument);
    setPropertyWithLinks(documents, target, "phenotype", source.phenotype, createPhenotypeDocument);
    setPropertyWithLinks(documents, target, "studiedState", source.studyState?.state, createStudiedStateDocument);
    return id;
};

const createTissueSampleDocument = (documents, source) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}TissueSample`, source.lookupLabel);
    const target = documents.ids[id];
    setProperty(target, "lookupLabel", source.lookupLabel);
    setPropertyWithLinks(documents, target, "type", source.typesOfTheTissue, createTypeDocument);
    setPropertyWithLinks(documents, target, "species", source.species, createSpeciesDocument);
    setPropertyWithLinks(documents, target, "strain", source.strains, createStrainDocument);
    setPropertyWithLinks(documents, target, "biologicalSex", source.biologicalSex, createBiologicalSexDocument);
    setPropertyWithLinks(documents, target, "origin", source.origin, createCellTypeDocument);
    setPropertyWithLinks(documents, target, "studiedState", source.studyState?.state, createStudiedStateDocument);
    return id;
};

const createTissueSampleGroupDocument = (documents, source) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}TissueSampleGroup`, source.lookupLabel);
    const target = documents.ids[id];
    setProperty(target, "lookupLabel", source.lookupLabel);
    setProperty(target, "quantity", source.quantity);
    setPropertyWithLinks(documents, target, "type", source.typesOfTheTissue, createTypeDocument);
    setPropertyWithLinks(documents, target, "species", source.species, createSpeciesDocument);
    setPropertyWithLinks(documents, target, "strain", source.strains, createStrainDocument);
    setPropertyWithLinks(documents, target, "biologicalSex", source.biologicalSex, createBiologicalSexDocument);
    setPropertyWithLinks(documents, target, "origin", source.origin, createCellTypeDocument);
    setPropertyWithLinks(documents, target, "studiedState", source.studyState?.state, createStudiedStateDocument);
    return id;
};

const createDigitalIdentifierDocument = (documents, doi) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}DigitalIdentifier`, doi);
  const target = documents.ids[id];
  setProperty(target, "identifier", doi);
  return id;
};

const createExperimentalApproachDocument = (documents, experimentalApproach) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}ExperimentalApproach`, experimentalApproach);
  const target = documents.ids[id];
  setProperty(target, "name", experimentalApproach);
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

const createLicenseDocument = (documents, license) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}License`, license);
  const target = documents.ids[id];
  setProperty(target, "shortName", license);
  return id;
};

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
  setPropertyWithLinks(documents, target, "contributionType", otherContribution.contributionType, createContributionTypeDocument);
  setPropertyWithLinks(documents, target, "contributor", otherContribution.contributor, createPersonDocument);
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

    setPropertyWithLinks(documents, dataset, "accessibility", [source.accessibility], createAccessibilityDocument);
    setProperty(dataset, "description", source.description);
    setProperty(dataset, "name", source.name);
    setProperty(dataset, "keyword", source.keyword);
    setProperty(dataset, "homepage", source.homepage);
    setProperty(dataset, "releasedDate", source.releasedDate);
    setProperty(dataset, "versionIdentifier", source.versionNumber);
    setProperty(dataset, "supportChannel", source.supportChannel);
    
    if(source.doi) {
      if(source.doi.doi === "No") {
        setPropertyWithLinks(documents, dataset, "author", source.doi.authors, createPersonDocument);
      }
      if(source.doi.doi === "Yes") {
        setPropertyWithLinks(documents, dataset, "digitalIdentifier", source.doi.value, createDigitalIdentifierDocument);
      }
    }
    setPropertyWithLinks(documents, dataset, "custodian", source.custodian, createPersonDocument);
    setPropertyWithLinks(documents, dataset, "copyright", source.copyrightHolderAndYear, createCopyrightDocument);
    setPropertyWithLinks(documents, dataset, "ethicsAssessment", source.ethicsAssessment, createEthicsAssessmentDocument);
    setPropertyWithLinks(documents, dataset, "modality", source.experimentalApproach, createExperimentalApproachDocument);
    setPropertyWithLinks(documents, dataset, "fullDocumentation", source.fullDocumentation, createFullDocumentationDocument);
    setPropertyWithLinks(documents, dataset, "funding", source.funding, createFundingDocument);
    setPropertyWithLinks(documents, dataset, "license", source.license, createLicenseDocument);
    setPropertyWithLinks(documents, dataset, "repository", source.repositoryUrl, createRepositoryDocument);
    setPropertyWithLinks(documents, dataset, "relatedPublication", source.relatedPublication, createRelatedPublicationDocument);
    setPropertyWithLinks(documents, dataset, "type", source.type, createTypeDocument);
    setPropertyWithLinks(documents, dataset, "otherContribution", source.otherContribution, createOtherContributionDocument);
    setPropertyWithLinks(documents, dataset, "inputData", source.inputData, createInputDataDocument);
    setPropertyWithLinks(documents, dataset, "protocol", source.protocol, createProtocol);

    return datasetId;
};

const generateDocuments = (dataset, studiedSpecimen, studiedSpecimenDocumentGenerator) =>  {
    const documents = {ids: {}, keys: {}};
    const datasetDocId = createDatasetDocument(documents, dataset);
    const datasetDoc = documents.ids[datasetDocId];
    setPropertyWithLinks(documents, datasetDoc, "studiedSpecimen", studiedSpecimen, studiedSpecimenDocumentGenerator);
    return Object.values(documents.ids);
};
    
export const generateDocumentsFromDataset = dataset =>  {
    return generateDocuments(dataset, null, () => null);
};
    
export const generateDocumentsFromDatasetAndSubjectGroups = (dataset, subjectsGroups) => {
    return generateDocuments(dataset, subjectsGroups, createSubjectGroupDocument);
};
    
export const generateDocumentsFromDatasetAndSubjects = (dataset, subjects) => {
    return generateDocuments(dataset, subjects, createSubjectDocument);
}
    
export const generateDocumentsFromDatasetAndTissueSampleGroups = (dataset, tissueSampleGroups) => {
    return generateDocuments(dataset, tissueSampleGroups, createTissueSampleGroupDocument);
}
    
export const generateDocumentsFromDatasetAndTissueSamples = (dataset, tissueSamples) => {
    return generateDocuments(dataset, tissueSamples, createTissueSampleDocument);
}
