import './App.css';
import Form from '@rjsf/bootstrap-4';

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
        "Free access",
        "Embargo"
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
        "type1",
        "type2"
      ]
    },
    "license": {
      "type": "string",
      "title": "License",
      "examples": [
        "apache",
        "mit"
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
        "type1",
        "type2"
      ]
    },
    "experimentalApproach": {
      "type": "string",
      "title": "Experimental approach",
      "examples": [
        "type1",
        "type2"
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
