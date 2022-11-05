import { StyleSheet } from 'react-native';
import { NativeBaseProvider, Center, Text } from 'native-base';

import { useFonts,
         Roboto_400Regular,
         Roboto_500Medium,
         Roboto_700Bold } from '@expo-google-fonts/roboto';

import { Loading } from './src/components/Loading';

import { THEME } from './src/styles/theme';
import { SignIn } from './src/screens/Signin';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_500Medium, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      <Center flex={1} bgColor="gray.900">
        {fontsLoaded ? <SignIn /> : <Loading />}
      </Center>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: '#fff',
  }
});
