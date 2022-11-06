import { VStack, Icon, useToast, FlatList } from "native-base";
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

import { Button } from "../components/Button";
import { Header } from "../components/Header";

import { api } from "../services/api";
import { useCallback, useEffect, useState } from "react";
import { PoolCard, PoolCardsProps } from "../components/PoolCard";
import { EmptyPoolList } from "../components/EmptyPoolList";
import { Loading } from "../components/Loading";

export function Pools(){
  const [isLoading, setIsLoading] = useState(true);
  const [pools, setPools] = useState<PoolCardsProps[]>([]);

  const { navigate } = useNavigation();
  const toast = useToast();

  async function fetch_pools(){
    try {
      setIsLoading(true);
      const response = await api.get('/pools');

      setPools(response.data.pools);

    } catch (error) {
      toast.show({
        title: 'Não foi possível carregar os bolões',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetch_pools();
  }, []))

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
    {
      isLoading ? <Loading /> :
        <FlatList
          data={pools}
          keyExtractor={item => item.id}
          renderItem={({ item })=> <PoolCard data={item} />}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={() => <EmptyPoolList />}
        />
    }
    </VStack>
  )
}
