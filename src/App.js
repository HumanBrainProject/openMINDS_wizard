import './App.css';
import Form from '@rjsf/core';

const schema = {
  "title": "Dataset form",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "title": "Name"
    },
    "description": {
      "type": "string",
      "title": "Description"
    },
    "doi": {
      "type": "string",
      "title": "DOI"
    },
    "homepage" : {
      "type": "string",
      "title": "Homepage"
    },
    "versionNumber" : {
      "type": "string",
      "title": "Version number"
    },
    "authors" : {
      "type": "array",
      "title": "Authors",
      "items": {
        "type": "string" 
      }
    },
    "custodian" : {
      "type": "array",
      "title": "Custodian",
      "items": {
        "type": "string" 
      }
    },
    "otherContributions" : {
      "type": "string",
      "title": "Other contributions"
    },
    "accessibility": {
      "type": "string",
      "title": "Accessibility",
      "examples": [
        "controlled access",
        "free access",
        "restricted access",
        "under embargo"
      ]
    },
    "repositoryUrl" : {
      "type": "string",
      "title": "Repository URL"
    },
    "type": {
      "type": "string",
      "title": "Type",
      "examples": [
        "derived data",
        "experimental data",
        "raw data",
        "simulated data"
      ]
    },
    "license": {
      "type": "string",
      "title": "License",
      "examples": [
        "AGPL-3.0-only",
        "Apache-2.0",
        "BSD-2-Clause",
        "BSD-3-Clause",
        "BSD-4-Clause",
        "CC BY 4.0",
        "CC BY-NC 4.0",
        "CC BY-NC-ND 4.0",
        "CC BY-NC-SA 4.0",
        "CC BY-ND 4.0",
        "CC BY-SA 4.0",
        "CC0 1.0",
        "CECILL-2.1",
        "EUPL-1.2",
        "GPL-1.0-only",
        "GPL-1.0-or-later",
        "GPL-2.0-only",
        "GPL-2.0-or-later",
        "GPL-3.0-only",
        "GPL-3.0-or-later",
        "LGPL-2.0-only",
        "LGPL-2.1-only",
        "LGPL-2.1-or-later",
        "LGPL-3.0-only",
        "LGPL-3.0-or-later",
        "MIT",
        "MPL-2.0"
      ]
    },
    "fullDocumentation" : {
      "type": "string",
      "title": "Full documentation"
    },
    "keyword" : {
      "type": "array",
      "title": "Keyword",
      "items": {
        "type": "string" 
      }
    },
    "copyrightHolderAndYear" : {
      "type": "string",
      "title": "Copyright holder & year"
    },
    "releasedDate":{
      "type": "string",
      "format": "date",
      "title": "Released date"
    },
    "ethicsAssessment": {
      "type": "string",
      "title": "Ethics assessment",
      "examples": [
        "EU compliant, non sensitive",
        "EU compliant, sensitive",
        "not required"
      ]
    },
    "experimentalApproach": {
      "type": "string",
      "title": "Experimental approach",
      "examples": [
        "anatomy",
        "behavior",
        "cell biology",
        "cell morphology",
        "cell population characterization",
        "cell population imaging",
        "cell population manipulation",
        "chemogenetics",
        "clinical research",
        "computational modeling",
        "developmental biology",
        "ecology",
        "electrophysiology",
        "epidemiology",
        "epigenomics",
        "ethology",
        "evolutionary biology",
        "expression",
        "expression characterization",
        "genetics",
        "genomics",
        "histology",
        "informatics",
        "metabolomics",
        "microscopy",
        "morphology",
        "multimodal research",
        "multiomics",
        "neural connectivity",
        "neuroimaging",
        "omics",
        "optogenetics",
        "physiology",
        "proteomics",
        "radiology",
        "spatial transcriptomics",
        "transcriptomics"
      ]
    },
    "funding" : {
      "type": "string",
      "title": "Funding"
    },
    "relatedPublication": {
      "type": "array",
      "title": "Related publication",
      "items": {
        "type": "string" 
      }
    },
    "supportChannel": {
      "type": "array",
      "title": "Support channel",
      "items": {
        "type": "string" 
      }
    },
    "inputData" : {
      "type": "string",
      "title": "Input data"
    },
    "studiedSpecimen": {
      "type": "object",
      "title": "Studied specimen",
      "properties": {
        "lookupLabel": {
          "type": "string",
          "title": "Lookup label"
        }
      }
    },
    "protocol": {
      "type": "object",
      "title": "Protocol",
      "properties": {
        "name": {
          "type": "string",
          "title": "Name"
        },
        "description": {
          "type": "string",
          "title": "Description"
        }
      }
    }
  }
};

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src="openMINDS_logo.png" alt="openminds" height="100" />
      </header>
      <div className="form">
        <Form schema={schema} />
      </div>
    </div>
  );
}

export default App;
