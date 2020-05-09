import React, {Component} from 'react';
import {withHub} from '../../Hub.js';
import {AsyncStorageHelper} from '../../helpers/AsyncStorageHelper';
import {FileHelper} from '../../helpers/FileHelper';

var RNFS = require('react-native-fs');

import {
  Container,
  DownloadButton,
  DownloadButtonText
} from './styles';

class SettingsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filenameTemplate: 'export_lunar_{date}.csv',
      messages: {
         success:'Dados cadastrados com sucesso!',
         noContent: 'Não há dados a serem salvos!'
      }
    }

    this.handleSaveOnCSVFile = this.handleSaveOnCSVFile.bind(this);
  }

  getCurrentAsyncStorageKey = () => {
    return AsyncStorageHelper.key;
  }

  getAsyncStorageContent = async (key = '') => {
    if (!key) {
      key = this.getCurrentAsyncStorageKey();
    }

    return await AsyncStorageHelper.getContent(key);
  }

  getFullFilePath(filename) {
    return RNFS.ExternalDirectoryPath + '/' + filename;
  }

  handleSaveOnCSVFile = async() => {
    const {filenameTemplate, messages} = this.state;
    
    const dateKey = this.getCurrentAsyncStorageKey();
    
    // Get filename
    const filename = FileHelper.getCsvFilename(filenameTemplate, dateKey);

    // Get filepath
    var fullPath = this.getFullFilePath(filename);

    console.log('fullPath: ', fullPath);

    // Get the content
    const objects = await this.getAsyncStorageContent(dateKey);
    if (objects.length > 0) {
      
      // Get csv content from object (list of string)
      const content = FileHelper.getCsvLines(objects);

      // Save it
      RNFS.appendFile(fullPath, content, 'utf8')
        .then((success) => {
          alert(messages['success'] + '\r\n' + filename);
        })
        .catch((err) => {
          const msg = 'ERROR: ' + err.message;
          console.error(msg);
          alert(msg);
        });      
    }
    else {
      alert(messages['noContent']);
    }
  }

  render() {
    return (
    <Container>
      <DownloadButton onPress={() => {
            this.handleSaveOnCSVFile();
          }}>
        <DownloadButtonText>
          DOWNLOAD
        </DownloadButtonText>
      </DownloadButton>
    </Container>
    );
  }
}

export default withHub(SettingsScreen);