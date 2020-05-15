import React, {Component} from 'react';
import {withHub} from '../../Hub.js';
import {DOWNLOAD_DATA} from '../../Events';
import {AsyncStorageHelper} from '../../helpers/AsyncStorageHelper';
import {FileHelper} from '../../helpers/FileHelper';

var RNFS = require('react-native-fs');

import {Container, DownloadButton, DownloadButtonText} from './styles';

class SettingsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filenameTemplate: 'export_lunar_{date}.csv',
      messages: {
        manualSuccess: 'Dados cadastrados manualmente com sucesso!',
        autoSuccess: 'Dados cadastrados automaticamente com sucesso!',
        noContent: 'Não há novos dados a serem salvos!',
      },
    };

    this.handleSaveOnCSVFile = this.handleSaveOnCSVFile.bind(this);
    this.hubSaveMeasurements = this.hubSaveMeasurements.bind(this);

    props.attach(DOWNLOAD_DATA, this.hubSaveMeasurements, false);
  }

  hubSaveMeasurements = async message => {
    const {messages} = this.state;
    // console.log('Starting automatic download data to csv file');
    const dateKey = message ? message : this.getCurrentAsyncStorageKey();

    try {
      await this.sendToCSVFile(dateKey);
      console.log(messages['autoSuccess']);
    } catch (e) {}
  };

  getCurrentAsyncStorageKey = () => {
    return AsyncStorageHelper.key;
  };

  getAsyncStorageContent = async (key = '') => {
    if (!key) {
      key = this.getCurrentAsyncStorageKey();
    }

    return await AsyncStorageHelper.getContent(key);
  };

  handleSaveOnCSVFile = async () => {
    const {messages} = this.state;

    try {
      // Get date key
      const dateKey = this.getCurrentAsyncStorageKey();

      // Call method that sends data to csv file
      await this.sendToCSVFile(dateKey);

      // Clear saved data
      await AsyncStorageHelper.clearContent(dateKey);

      alert(messages['manualSuccess']);
    } catch (e) {
      console.log(e);
      alert(e);
    }
  };

  sendToCSVFile = async dateKey => {
    const {filenameTemplate} = this.state;

    let result;

    // Get filename
    const filename = FileHelper.getCsvFilename(filenameTemplate, dateKey);

    // Get filepath
    var fullPath = FileHelper.getFullFilePath(filename);

    // Get the content from async storage
    const objects = await this.getAsyncStorageContent(dateKey);

    if (objects.length > 0) {
      // Get csv content from object (list of string)
      const content = FileHelper.getCsvLines(objects);

      // Save it
      result = RNFS.appendFile(fullPath, content, 'utf8');
    } else {
      result = Promise.resolve(undefined);
    }

    return result;
  };

  render() {
    return (
      <Container>
        <DownloadButton
          onPress={() => {
            this.handleSaveOnCSVFile();
          }}>
          <DownloadButtonText>DOWNLOAD</DownloadButtonText>
        </DownloadButton>
      </Container>
    );
  }
}

export default withHub(SettingsScreen);
