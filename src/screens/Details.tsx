import { useRoute } from "@react-navigation/native";
import { HStack, Toast, useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../services/api";

import { PoolCardsProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Share } from "react-native";

interface RouteParams {
  id: string;
}

export function Details() {
  const [option_selected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses');
  const [isLoading, setIsLoading] = useState(true);
  const [pool_details, setPoolDetails] = useState<PoolCardsProps>({} as PoolCardsProps);

  const route = useRoute();
  const { id } = route.params as RouteParams;

  const toast = useToast()

  async function fetch_pool_details() {
    try {
      const response = await api.get(`/pools/${id}`);
      setPoolDetails(response.data.pool);

    } catch (error) {
      toast.show({
        title: 'Não foi possível carregar os detalhes do bolão',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handle_code_share() {
    try {
      await Share.share({ message: pool_details.code });
    } catch (error) {
      toast.show({
        title: 'Não foi possível compartilhar o código',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  useEffect(() => {
    fetch_pool_details();
  }, [id])

  if(isLoading){
    return <Loading />
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={pool_details.title}
        showBackButton
        showShareButton
        onShare={handle_code_share}
      />
      {
        pool_details._count?.participants > 0 ? (
          <VStack px={5} flex={1}>
            <PoolHeader data={pool_details} />

            <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
              <Option
                title="Seus palpites"
                isSelected={option_selected === 'guesses'}
                onPress={() => setOptionSelected('guesses')}
              />

              <Option
                title="Ranking do grupo"
                isSelected={option_selected === 'ranking'}
                onPress={() => setOptionSelected('ranking')}
              />
            </HStack>
          </VStack>
        ) : <EmptyMyPoolList code={pool_details.code}/>
      }
    </VStack>
  )
}
