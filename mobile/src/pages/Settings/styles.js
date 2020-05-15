import styled from 'styled-components/native';
import {RectButton} from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: #fff;
`;

export const DownloadButton = styled(RectButton)`
  justify-content: center;
  align-items: center;
  width: 240px;
  height: 120px;
  border-radius: 4px;
  margin: 10px;
  background: #7159c1;
`;

export const DownloadButtonText = styled.Text`
  font-size: 30px;
  text-align: center;
  margin: 10px;
  font-weight: bold;
  color: #fff;
`;
