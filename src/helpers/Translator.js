import _  from "lodash-uuid";

const OPENMINDS_VOCAB = "https://openminds.ebrains.eu/vocab/";
const EBRAINS_VOCAB = "https://kg.ebrains.eu/api/instances/";

const createDocument = (documents, type) => {
    const id = `${EBRAINS_VOCAB}/${_.uuid()}`;
    const doc = {
        "@id": id,
        "@type": [type]
    }
    documents[id] = doc;
    return id;
};

const setProperty = (object, name, value) => {
    if (value !== null && value !== undefined && value !== "") {
        object[`${OPENMINDS_VOCAB}/${name}`] = value;
    }
};

const setPropertyWithLinks = (documents, object, name, source, documentGenerator) => {
    if (source === null || source === undefined) {
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
    const id = createDocument(documents, `${OPENMINDS_VOCAB}Accessibility`);
    const target = documents[id];
    setProperty(target, "name", accessibility);
    return id;
};

const createCopyrightDocument = (documents, copyright) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}Copyright`);
  const target = documents[id];
  setProperty(target, "year", copyright.year);
  setProperty(target, "holder", copyright.holder);
  return id;
};

const createPersonDocument = (documents, author) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}Person`);
    const target = documents[id];
    setProperty(target, "familyName", author.familyName);
    setProperty(target, "givenName", author.givenName);
    return id;
};

const createEthicsAssessmentDocument = (documents, ethicsAssessment) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}EthicsAssessment`);
  const target = documents[id];
  setProperty(target, "name", ethicsAssessment);
  return id;
};

const createSpeciesDocument = (documents, species) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}Species`);
    const target = documents[id];
    setProperty(target, "name", species);
    return id;
};

const createStrainDocument = (documents, strain) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}Strain`);
    const target = documents[id];
    setProperty(target, "name", strain);
    return id;
};

const createBiologicalSexDocument = (documents, biologicalSex) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}BiologicalSex`);
    const target = documents[id];
    setProperty(target, "name", biologicalSex);
    return id;
};

const createPhenotypeDocument = (documents, phenotype) => {
    const id = createDocument(documents, `${OPENMINDS_VOCAB}Person`);
    const target = documents[id];
    setProperty(target, "name", phenotype.name);
    return id;
};


const createSubjectDocument = (documents, source) => {
    const id = createDocument(`${OPENMINDS_VOCAB}Subject`);
    const target = documents[id];
    setProperty(target, "lookupLabel", source.lookupLabel);
    setPropertyWithLinks(documents, target, "species", source.species, createSpeciesDocument);
    setPropertyWithLinks(documents, target, "strain", source.strains, createStrainDocument);
    setPropertyWithLinks(documents, target, "biologicalSex", source.biologicalSex, createBiologicalSexDocument);
    return target;
};

const createSubjectGroupDocument = (documents, source) => {
    const id = createDocument(`${OPENMINDS_VOCAB}SubjectGroup`);
    const target = documents[id];
    setProperty(target, "lookupLabel", source.lookupLabel);
    setProperty(target, "quantity", source.quantity);
    setPropertyWithLinks(documents, target, "species", source.species, createSpeciesDocument);
    setPropertyWithLinks(documents, target, "strain", source.strains, createStrainDocument);
    setPropertyWithLinks(documents, target, "biologicalSex", source.biologicalSex, createBiologicalSexDocument);
    setPropertyWithLinks(documents, target, "phenotype", source.phenotype, createPhenotypeDocument);
    return target;
};

const createTissueSampleDocument = (documents, source) => {
    const id = createDocument(`${OPENMINDS_VOCAB}TissueSample`);
    const target = documents[id];
    setProperty(target, "lookupLabel", source.lookupLabel);
    return target;
};

const createTissueSampleGroupDocument = (documents, source) => {
    const id = createDocument(`${OPENMINDS_VOCAB}TissueSampleGroup`);
    const target = documents[id];
    setProperty(target, "lookupLabel", source.lookupLabel);
    setProperty(target, "quantity", source.quantity);
    return target;
};

const createDigitalIdentifierDocument = (documents, doi) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}DigitalIdentifier`);
  const target = documents[id];
  setProperty(target, "identifier", doi);
  return id;
};

const createExperimentalApproachDocument = (documents, experimentalApproach) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}ExperimentalApproach`);
  const target = documents[id];
  setProperty(target, "name", experimentalApproach);
  return id;
};

const createFullDocumentationDocument = (documents, fullDocumentation) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}FullDocumentation`);
  const target = documents[id];
  setProperty(target, "name", fullDocumentation);
  return id;  
}

const createFundingDocument = (documents, funding) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}Funding`);
  const target = documents[id];
  setProperty(target, "awardTitle", funding);
  return id;  
}

const createLicenseDocument = (documents, license) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}License`);
  const target = documents[id];
  setProperty(target, "shortName", license);
  return id;
};

const createRepositoryDocument = (documents, repository) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}FileRepository`);
  const target = documents[id];
  setProperty(target, "IRI", repository);
  return id;
};

const createRelatedPublicationDocument = (documents, relatedPublication) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}DOI`);
  const target = documents[id];
  setProperty(target, "identifier", relatedPublication);
  return id;
};

const createContributionTypeDocument = (documents, contributionType) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}ContributionType`);
  const target = documents[id];
  setProperty(target, "name", contributionType);
  return id;
};

const createOtherContributionDocument = (documents, otherContribution) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}OtherContribution`);
  const target = documents[id];
  setPropertyWithLinks(documents, target, "contributionType", otherContribution.contributionType, createContributionTypeDocument);
  setPropertyWithLinks(documents, target, "contributor", otherContribution.contributor, createPersonDocument);
  return id;
};

const createTypeDocument = (documents, type) => {
  const id = createDocument(documents, `${OPENMINDS_VOCAB}SemanticDataType`);
  const target = documents[id];
  setProperty(target, "name", type);
  return id;
}

const createDatasetDocument = (documents, source) => {
    // inputData: "tetete"
    // protocol: {}

    const datasetId = createDocument(documents, `${OPENMINDS_VOCAB}DatasetVersion`);
    const dataset = documents[datasetId];

    setPropertyWithLinks(documents, dataset, "accessibility", [source.accessibility], createAccessibilityDocument);
    setProperty(dataset, "description", source.description);
    setProperty(dataset, "name", source.name);
    setProperty(dataset, "keyword", source.keyword);
    setProperty(dataset, "homepage", source.homepage);
    setProperty(dataset, "releasedDate", source.releasedDate);
    setProperty(dataset, "versionIdentifier", source.versionNumber);
    setProperty(dataset, "supportChannel", source.supportChannel);
    
    setPropertyWithLinks(documents, dataset, "author", source.authors, createPersonDocument);
    setPropertyWithLinks(documents, dataset, "custodian", source.custodian, createPersonDocument);
    setPropertyWithLinks(documents, dataset, "copyright", source.copyrightHolderAndYear, createCopyrightDocument);
    setPropertyWithLinks(documents, dataset, "ethicsAssessment", source.ethicsAssessment, createEthicsAssessmentDocument);
    setPropertyWithLinks(documents, dataset, "digitalIdentifier", source.doi, createDigitalIdentifierDocument);
    setPropertyWithLinks(documents, dataset, "modality", source.experimentalApproach, createExperimentalApproachDocument);
    setPropertyWithLinks(documents, dataset, "fullDocumentation", source.fullDocumentation, createFullDocumentationDocument);
    setPropertyWithLinks(documents, dataset, "funding", source.funding, createFundingDocument);
    setPropertyWithLinks(documents, dataset, "license", source.license, createLicenseDocument);
    setPropertyWithLinks(documents, dataset, "repository", source.repositoryUrl, createRepositoryDocument);
    setPropertyWithLinks(documents, dataset, "relatedPublication", source.relatedPublication, createRelatedPublicationDocument);
    setPropertyWithLinks(documents, dataset, "type", source.type, createTypeDocument);
    setPropertyWithLinks(documents, dataset, "otherContribution", source.otherContribution, createOtherContributionDocument);
};

const generateDocuments = (dataset, studiedSpecimen, studiedSpecimenDocumentGenerator) =>  {
    const documents = [];
    const datasetDocId = createDatasetDocument(documents, dataset);
    const datasetDoc = documents[datasetDocId];
    setPropertyWithLinks(documents, datasetDoc, "studiedSpecimen", studiedSpecimen, studiedSpecimenDocumentGenerator);
    return Object.values(documents);
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
