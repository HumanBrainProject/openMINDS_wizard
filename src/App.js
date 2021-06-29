import React, { useState } from "react";
import Form from './components/Form';
import './App.css';

const datasetSchema = {
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
      "enum": [
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
      "enum": [
        "derived data",
        "experimental data",
        "raw data",
        "simulated data"
      ]
    },
    "license": {
      "type": "string",
      "title": "License",
      "enum": [
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
      "enum": [
        "EU compliant, non sensitive",
        "EU compliant, sensitive",
        "not required"
      ]
    },
    "experimentalApproach": {
      "type": "string",
      "title": "Experimental approach",
      "enum": [
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
        },
        "conditional": {
          "type": "object",
          "title": "",
          "properties": {
            "studyTopic": {
              "type": "string",
              "title": "What have you been studying?",
              "enum": [
                "",
                "Subject",
                "Tissue sample"
              ],
              "default": ""
            }
          },
          "dependencies": {
            "studyTopic": {
              "oneOf": [
                {
                  "properties": {
                    "studyTopic": {
                      "enum": [
                        ""
                      ]
                    }
                  }
                },
                {
                  "properties": {
                    "studyTopic": {
                      "enum": [
                        "Subject"
                      ]
                    },
                    "numberOfSubjects": {
                      "type": "number",
                      "title": "How many subjects did you study?"
                    },
                    "individualSubjectInfo": {
                      "type": "boolean",
                      "title": "Do you have individual subject information?"
                    },
                    "subjectsAtDifferentStates": {
                      "type": "boolean",
                      "title": "Did you study the subjects at different states?"
                    }
                  }
                },
                {
                  "properties": {
                    "studyTopic": {
                      "enum": [
                        "Tissue sample"
                      ]
                    },
                    "numberOfTissues": {
                      "type": "number",
                      "title": "How many tissue samples did you study?"
                    },
                    "individualSampleInfo": {
                      "type": "boolean",
                      "title": "Do you have individual tissue sample information?"
                    }
                  }
                },
              ]
            }
          }
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

const subjectSchema = {
  "title": "Subject form",
  "type": "array",
  "items": {
    "species": {
      "type": "string",
      "title": "Species",
      "enum": [
        
      ]    
    },
    "strains": {
      "type": "string",
      "title": "Strains",
      "enum": [
        
      ]    
    },
    "biologicalSex": {
      "type": "string",
      "title": "Biological sex",
      "enum": [
        
      ]    
    },
    "phenotype": {
      "type": "string",
      "title": "Phenotype",
      "enum": [
        
      ]    
    }     
  }
};

const subjectGroupSchema = {
  "title": "Subject group form",
  "type": "array"
};

const tissueSampleSchema = {

};

const tissueSampleGroupSchema = {

};

const App = () => {
  const [dataset, setDataset] = useState();
  const [isSubject, toggleSubject] = useState(false);
  const [isGroup, toggleGroup] = useState(false);
  const [isTemplate, toggleTemplate] = useState(false);
  const [schema, setSchema] = useState(datasetSchema);
  const [isWizardComplete, toggleWizardComplete] = useState(false);

  const submitDataset = formData => {
    const group = !!formData.isGroup; //TODO get real properties from formData
    const subject = !!formData.isSubject; //TODO get real properties from formData
    setDataset(formData);
    toggleSubject(subject);
    toggleGroup(group);
    toggleTemplate(true);
    if (subject) {
      if (group) {
        const newSchema = JSON.parse(JSON.stringify(subjectGroupSchema));
        //TODO set the value of "number of subjects" field in newSchema
        setSchema(newSchema);
      } else {
        setSchema(subjectSchema);
      }
    } else {
      if (group) {
        const newSchema = JSON.parse(JSON.stringify(tissueSampleGroupSchema));
        //TODO set the value of "number of tissueSamples" field in newSchema
        setSchema(newSchema);
      } else {
        setSchema(tissueSampleSchema);
      }
    }
  };

  const submitSubjectGroups = formData => {
    //TODO: generate the final jsonld;
    toggleWizardComplete(true);
  };

  const submitSubjectTemplate = formData => {
    //TODO: genereate the new schemas
    const subjectsSchema = {};
    toggleTemplate(false);
    setSchema(subjectsSchema);
  };

  const submitSubjects = formData => {
    //TODO: generate the final jsonld;
    toggleWizardComplete(true);
  };

  const submitTissueSampleGroups = formData => {
     //TODO: generate the final jsonld;
     toggleWizardComplete(true);
  };

  const submitTissueSampleTemplate = formData => {
    //TODO: genereate the new schemas
    const tissueSamplesSchema = {};
    toggleTemplate(false);
    setSchema(tissueSamplesSchema);
  };

  const submitTissueSamples = formData => {
    //TODO: generate the final jsonld;
    toggleWizardComplete(true);
  };
 

  const onSubmit = ({formData}) => {
    if (!dataset) {
      submitDataset(formData);
    } else {  

      if (isSubject) {
        // Subject
        if (isGroup) {
          submitSubjectGroups(formData);
        } else  if (isTemplate) {
            submitSubjectTemplate(formData);
        } else {
          submitSubjects(formData);
        }

      } else {  

        // Tissue sample
        if (isGroup) {
          submitTissueSampleGroups(formData);
          return;
        } else if(isTemplate) {
          submitTissueSampleTemplate(formData);
        } else {
          submitTissueSamples(formData);
        }
      }

    }
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <img src="openMINDS_logo.png" alt="openminds" height="100" />
      </header>
      <div className="form">
        {!isWizardComplete?
          <Form onSubmit={onSubmit} schema={schema} />
          :
          <div>Download</div>
        }
      </div>
    </div>
  );
}

export default App;
