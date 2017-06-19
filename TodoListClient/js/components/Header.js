import React from 'react';
import { Text, View, StyleSheet, StatusBar } from 'react-native';
import NavigationBar from 'react-native-navbar';


export default (params) => (function (props) {
  let leftButton = params.leftButton;
  let rightButton = params.rightButton;
  if (typeof params.leftButton === 'function') {
    leftButton = params.leftButton(props);
  }
  if (typeof params.rightButton === 'function') {
    rightButton = params.rightButton(props);
  }

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#00000033"
        translucent
      />
      <NavigationBar
        title={{ title: params.title }}
        leftButton={leftButton}
        rightButton={rightButton}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
  },
});
