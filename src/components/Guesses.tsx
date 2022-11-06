import { Box, FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

import { Game, GameProps } from '../components/Game';

interface Props {
  poolId: string;
}

export function Guesses({ poolId }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [first_team_points, set_first_team_points] = useState('');
  const [second_team_points, set_second_team_points] = useState('');

  const toast = useToast();

  async function fetch_games() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${poolId}/games`);
      console.log(response.data.games);

      setGames(response.data.games);

    } catch (error) {
      toast.show({
        title: 'Não foi possível carregar os jogos',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handle_guess_confirm(game_id: string) {
    try {
      setIsLoading(true);

      if(!first_team_points.trim() || !second_team_points.trim()) {
        toast.show({
          title: 'Preencha todos os campos',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      await api.post(`/pools/${poolId}/games/${game_id}/guesses`, {
        first_team_points: Number(first_team_points),
        second_team_points: Number(second_team_points)
      });

      toast.show({
        title: 'Palpite enviado com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      })

      fetch_games()

    } catch (error) {
      toast.show({
        title: 'Não foi possível enviar o palpite',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetch_games();
  }, [poolId])

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={set_first_team_points}
          setSecondTeamPoints={set_second_team_points}
          onGuessConfirm={()=> handle_guess_confirm(item.id)}
        />
      )}
    />
  )
}
