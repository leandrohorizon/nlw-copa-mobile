import { VStack, Icon } from "native-base";
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

import { Button } from "../components/Button";
import { Header } from "../components/Header";

export function Pools(){
  const { navigate } = useNavigation();

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />
      <VStack
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
        mt={6}
        mx={5}
      >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={<Icon as={Octicons} name="search" size="md" color="black" />}
          onPress={() => navigate('find')}
        />
      </VStack>
    </VStack>
  )
}