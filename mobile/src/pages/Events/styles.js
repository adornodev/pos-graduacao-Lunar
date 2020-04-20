import styled from 'styled-components/native';
import {FlatList} from 'react-native';

export const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
  background: #7159c1;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
`;

export const Item = styled.View`
  background: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.133916);
  border-radius: 10px;
  width: 90%;
  margin-top: 20px;
  margin-left: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Content = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

export const Header = styled.View`
  flex: 1;
  align-items: center;
`;

export const GPSContent = styled.View``;

export const AccelerometerContent = styled.View``;

export const AccelerometerValues = styled.Text`
  font-size: 16px;
  font-weight: normal;
  font-family: 'Arial, Helvetica, sans-serif';
`;

export const GPSValues = styled.Text`
  font-size: 16px;
  font-family: 'Arial, Helvetica, sans-serif';
`;

export const Timestamp = styled.Text`
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  font-family: 'Arial, Helvetica, sans-serif';
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const EmptyText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-top: 18px;
  color: #fff;
`;

export const MeasurementsList = styled.FlatList`
  flex: 1;
  width: 90%;
  margin-left: 10px;
`;
