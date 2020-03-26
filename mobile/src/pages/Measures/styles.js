import styled from 'styled-components/native';
import {RectButton} from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: #f5fcff;
`;

export const AccelerometerButton = styled(RectButton)`
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  border-radius: 4px;
  margin: 10px;
  background: ${props => (props.isActive ? '#c40f3f' : '#2ebe0f')};
`;

export const AccelerometerButtonText = styled.Text`
  font-size: 30px;
  text-align: center;
  margin: 10px;
  font-weight: bold;
  color: #fff;
`;

export const AccelerometerValuesContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const AccelerometerAxisKey = styled.Text`
  width: 50px;
  font-size: 20px;
  font-weight: bold;
`;
export const AccelerometerAxisValue = styled.Text`
  width: 200px;
  font-size: 20px;
`;

export const AccelerometerLabel = styled.Text`
  font-size: 30px;
  text-align: center;
  margin: 10px;
  margin-top: 50px;
`;
