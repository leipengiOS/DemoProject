// App.js
import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, Text, Modal, Button, Alert } from 'react-native';
import WebView from 'react-native-webview';

const App = () => {
  const webViewRef = React.useRef(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [webViewVisible, setWebViewVisible] = React.useState(true);

  const generateRandomKey = () => parseInt((Math.random() * 100000).toString(), 10);
  const [key, setKey] = React.useState(generateRandomKey());

  const showMessageModal = (msg) => {
    setMessage(msg);
    setModalVisible(true);
  };

  const sendMessageToH5 = () => {
    webViewRef.current?.injectJavaScript('receiveMessage("react-native send this message to H5: MSG COMFIRMED!")');
    setModalVisible(false);
  };

  const loadPage = () => {
    setWebViewVisible(true); // show WebView
    setKey(generateRandomKey());
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <Text style={styles.modalText}>{message}</Text>
          <Button
            title="confirm"
            onPress={sendMessageToH5}
          />
        </View>
      </Modal>
      {webViewVisible && (
        <WebView
          source={{ uri: 'https://demo.ipolyv.cn/tanglianghong/test/v3/ReactNativeWebView/?channelId=5005175&lang=en&console=1' }}  
          key={key}
          ref={webViewRef}
          scalesPageToFit={true}
          style={{ flex: 1, backgroundColor: 'white' }}
          startInLoadingState={true}
          limitsNavigationsToAppBoundDomains={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsLinkPreview={true}
          setSupportMultipleWindows={false}
          onShouldStartLoadWithRequest={(r) => {
            return true;
          }}
          onNavigationStateChange={(navState) => {
            console.log(navState.url);
            console.log(navState.loading);
          }}
          onContentProcessDidTerminate={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log('Content process terminated, reloading', nativeEvent);
          }}
          originWhitelist={['*']}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
          onMessage={(event) => {
            showMessageModal(event.nativeEvent.data);
          }}
          onLoadEnd={data => {
            const { nativeEvent } = data;
            const { title } = nativeEvent;
          }}
        />
      )}
      <Button
        title="reloadpage"
        style={styles.loadPageButton}
        onPress={loadPage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
    backgroundColor: 'white',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  loadPageButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
});

export default App;