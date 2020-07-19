import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './styles';

interface Veiculo {
  Codigo: number;
  Marca: string;
  Modelo: string;
  Cor: string;
  Combustivel: string;
  Quilometragem: string;
  AnoFabricacao: string;
  PrecoVenda: string;
  Opcional: [];
}

// function Dashboard() {}   -fica mais chato setar typagem da function
const Dashboard: React.FC = () => {
  const [newCar, setNewCar] = useState('');
  const [inputError, setInputError] = useState('');
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  async function buscarDados(): Promise<void> {
    const response = await api.get<Veiculo[]>('/veiculos.json');

    const listaVeiculos = response.data;

    // Se variavel estiver presente
    if (response) {
      setVeiculos([...listaVeiculos]);
    }
  }

  useEffect(() => {
    buscarDados();
  }, []);

  // UseEffect serve para dispara funcao que gente envia como primeiro parametro, sempre que uma variavel mudar que enviamos como segundo parametros como um arry
  // useEffect(() => {
  //   localStorage.setItem(
  //     '@GithubExplorer:repositories',
  //     JSON.stringify(repositories), // Coverte para formato JSON
  //   );
  // }, [repositories]);

  // Adicao de um novo repository
  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    // Verifica se o conteudo da variavel ta vazil
    if (!newCar) {
      setInputError('Digite a marca ou modelo do veículo');
      buscarDados();
      return;
    }

    try {
      const pesquisa = veiculos.filter((veiculo) => {
        if (newCar.includes(veiculo.Marca)) {
          return veiculo;
        }

        if (veiculo.Marca.includes(newCar)) {
          return veiculo;
        }

        if (newCar.includes(veiculo.Modelo)) {
          return veiculo;
        }

        if (veiculo.Modelo.includes(newCar)) {
          return veiculo;
        }
        return null;
      });

      // console.log(pesquisa.length);
      if (pesquisa.length <= 0) {
        setInputError('Nem um veículo encontrado');
        return;
      }

      console.log(pesquisa);

      setVeiculos([...pesquisa]); // Colocando Repository no final da lista, sem perder os dados que ja tinha nela.
      setNewCar('');
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca por esse veículo');
    }
  }

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Listagem de Veículos</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newCar}
          onChange={(e) => setNewCar(e.target.value.toUpperCase())}
          placeholder="Digite a marca ou modelo do veículo"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {/* Outra forma de fazer um if no react. Caso variavel esteja preenchida vai exibir o erro. */}
      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {veiculos.map((veiculo) => (
          <Link key={veiculo.Codigo} to={`/informacao/${veiculo.Codigo}`}>
            <img
              src={`http://upper.noip.me/veiculos/1/${veiculo.Codigo}/imagem1.png`}
              alt={veiculo.Modelo}
            />

            <div>
              <strong>{veiculo.Marca}</strong>
              <p>{veiculo.Modelo}</p>
              <p>
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(Number(veiculo.PrecoVenda))}
              </p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
