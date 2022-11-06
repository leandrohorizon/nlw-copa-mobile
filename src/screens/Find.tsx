import { Heading, useToast, VStack } from "native-base";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { api } from "../services/api";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export function Find(){
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');

  const toast = useToast();
  const { navigate } = useNavigation();

  async function handle_join_pool(){
    try {
      setIsLoading(true);

      if(!code.trim()){
        return toast.show({
          title: 'Informe o código do bolão',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      await api.post('/pools/join', { code })

      toast.show({
        title: 'Bolão encontrado com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      });

      navigate('pools');

    } catch (error) {
      setIsLoading(false);

      if(error.response?.data?.error === 'Pool not found'){
        return toast.show({
          title: 'Bolão não encontrado',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      if(error.response?.data?.error === 'User already joined this pool'){
        return toast.show({
          title: 'Você já está participando deste bolão',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      toast.show({
        title: 'Não foi possível encontrar o bolão',
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontrar um bolão através de {'\n'}
          seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          autoCapitalize="characters"
          onChangeText={setCode}
          value={code}
        />

        <Button
          title="BUSCAR BOLÃO"
          onPress={handle_join_pool}
        />

      </VStack>
    </VStack>
  )
}
