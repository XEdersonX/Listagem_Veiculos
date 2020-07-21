// PAGINAÇÃO
// https://react-bootstrap.github.io/components/pagination/

import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories, Error, ButtonLimpar, ContainerPagination } from './styles';
import Pagination from 'react-bootstrap/Pagination';

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

interface Paginacao {
  page: number;
}

// function Dashboard() {}   -fica mais chato setar typagem da function
const Dashboard: React.FC = () => {
  const [newCar, setNewCar] = useState('');
  const [inputError, setInputError] = useState('');
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [pesquisa, setPesquisa] = useState<Veiculo[]>([]);
  const [filtro, setFiltro] = useState(false);

  const [active1, setActive] = useState(2);
  const [items, setItems] = useState<Paginacao[]>([]);

  /*
    Todos os veículos -> veiculos
    Lista de veículos se o usuário tiver feito pesquisa -> pesquisa
  */

  async function buscarDados(): Promise<void> {
    const response = await api.get<Veiculo[]>('/veiculos.json');

    const listaVeiculos = response.data;

    // Se variavel estiver presente
    if (response) {
      setVeiculos([...listaVeiculos]);
      setFiltro(false);
    }

    const arrayRetorno: Paginacao[] = [];
    for (let number = 1; number <= 5; number++) {
      arrayRetorno.push(
        {page: number}
      );
    }

    setItems(arrayRetorno);
  }

  async function buscarDadosFiltro(): Promise<void> {
    const response = await api.get<Veiculo[]>('/veiculos.json');

    const listaVeiculos = response.data;

    // Se variavel estiver presente
    if (response) {
      setPesquisa([...listaVeiculos]);
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
    // console.log(filtro);
    if (filtro === false) {
      setPesquisa(veiculos);
    }

    // Verifica se o conteudo da variavel ta vazil
    if (!newCar) {
      setInputError('Digite a marca ou modelo do veículo');
      buscarDados();
      return;
    }

    try {
      //https://pt.stackoverflow.com/questions/309907/busca-array-com-variavel-case-insensitive-javascript
      const pesquisa = veiculos.filter((veiculo) => {

        if (newCar.toLowerCase().includes(veiculo.Marca.toLowerCase())) {
          setFiltro(true);
          return veiculo;
        }

        //if (veiculo.Marca.includes(newCar)) {
        if (veiculo.Marca.toLowerCase().includes(newCar.toLowerCase())) {
          setFiltro(true);
          return veiculo;
        }

        //if (newCar.includes(veiculo.Modelo)) {
        if (newCar.toLowerCase().includes(veiculo.Modelo.toLowerCase())) {
          setFiltro(true);
          return veiculo;
        }

        //if (veiculo.Modelo.includes(newCar)) {
        if (veiculo.Modelo.toLowerCase().includes(newCar.toLowerCase())) {
          setFiltro(true);
          return veiculo;
        }
        return null;
      });

      if (pesquisa.length <= 0) {
        setInputError('Nem um veículo encontrado');
        return;
      }

      console.log('Pesquisa:')
      console.log(pesquisa.length);
      console.log(pesquisa);

      setPesquisa(pesquisa); // Colocando Repository no final da lista, sem perder os dados que ja tinha nela.
      setNewCar('');
      setInputError('');
    } catch (err) {
      console.log('???')
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

      { filtro && ( <ButtonLimpar onClick={buscarDados}>Filtrar Todos os Veículos</ButtonLimpar> )}

      <Repositories>
        { filtro === true ?
        pesquisa.map((veiculo) => (
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
        ))

      : //else

      veiculos.map((veiculo) => (
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
      ))
      }
      </Repositories>

      <ContainerPagination>
          {
            items.map((item) => (
              // <Pagination.Item key={item.page} active={item.page === active1}>   onClick={}
              <Pagination.Item key={item.page} active={item.page === active1}>
                {item.page}
              </Pagination.Item>
            ))
          }
      </ContainerPagination>
    </>
  );
};

export default Dashboard;
