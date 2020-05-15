import styled from 'styled-components/native';
import {RectButton} from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
  /*background: #f5fcff;*/
  padding: 0 40px;
  background: #fff;
`;

export const ButtonsContainer = styled.View`
  flex: 1;
  /* background: #b8c32b; */
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

export const ValuesContainer = styled.View`
  flex: 1;
  /* background: #bbb; */
  flex-direction: column;
  margin: 10px 0;
`;

export const GpsValuesContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  /* background: #f51f5c; */
`;

export const AccelerometerValuesContainer = styled.View`
  flex-direction: column;
  margin: 20px 0;
  /* background: #363dd7; */
`;

export const Divider = styled.View`
  border-bottom-color: #7159c1;
  border-bottom-width: 3px;
  border-style: solid;
  margin-top: 20px;
`;

export const AccelerometerButton = styled(RectButton)`
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  border-radius: 4px;
  background: ${props => (props.isActive ? '#c40f3f' : '#68ed6a')};
`;

export const EventButton = styled(RectButton)`
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  border-radius: 4px;
  background: #7159c1;
`;

export const EventButtonText = styled.Text`
  font-size: 30px;
  text-align: center;
  margin: 10px;
  font-weight: bold;
  color: #fff;
`;

export const AccelerometerButtonText = styled.Text`
  font-size: 30px;
  text-align: center;
  margin: 10px;
  font-weight: bold;
  color: #fff;
`;

export const ValueKey = styled.Text`
  width: 50px;
  font-size: 20px;
  font-weight: bold;
`;
export const Value = styled.Text`
  /* width: 100px; */
  font-size: 15px;
`;

export const AccelerometerLabel = styled.Text`
  font-size: 30px;
  text-align: center;
  margin: 10px;
  margin-top: 50px;
`;
