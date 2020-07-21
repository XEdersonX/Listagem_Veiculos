// DICAS PARA USAR BOOTSTRAP
// https://www.bootstrapcdn.com/?fbclid=IwAR2mXfREKIzuMuGx6H0TkPwQkHyBPh8wWHo0AUR6jjqnEHwhvOruSmRDuSo
// yarn add react-bootstrap bootstrap
// https://react-bootstrap.github.io/getting-started/introduction/
// https://getbootstrap.com/docs/4.5/getting-started/download/?fbclid=IwAR0fsxzcE7WEkX1Ytep4R7Fz5QgvgSFvVH9ytDh-f87MPv-Cd82J7OtkTCw#npm
// https://react-bootstrap.github.io/components/carousel/

// LOADING EXEMPLOS
// https://reactjsexample.com/build-a-smooth-and-lightweight-react-component-loading-with-css/

// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_loader
// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_loader
// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_loader2

// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_loader5

import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';

import { FiChevronsLeft, FiChevronRight } from 'react-icons/fi'; // Fidericons
import Carousel from 'react-bootstrap/Carousel';
import { error } from 'console';
import { promises } from 'dns';
import total from '../../assets/total.svg';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';

import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import {
  Header,
  RepositoryInfo,
  Issues,
  Fotos,
  CardContainer,
  Card,
  Loading,
} from './styles';

interface InfoParams {
  codigo: string;
}

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

interface Imagem {
  url: string;
}

// function Dashboard() {}   -fica mais chato setar typagem da function
const Repository: React.FC = () => {
  const [dadosVeiculo, setDadosVeiculo] = useState<Veiculo>();
  const [veiculosImagens, setVeiculoImagens] = useState<Imagem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFoundPhoto, setIsFoundPhoto] = useState(true);
  let displayFoto = 'none';

  const { params } = useRouteMatch<InfoParams>();

  async function verificaImagem(): Promise<Imagem[]> {
    const arrayImagens: Imagem[] = [];
    for (let i = 1; i <= 8; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(
        `https://cors-anywhere.herokuapp.com/http://upper.noip.me/veiculos/1/${params.codigo}/imagem${i}.png`,
      ); // eslint-disable-line
      if (res.status !== 404) {
        const imgRes = `http://upper.noip.me/veiculos/1/${params.codigo}/imagem${i}.png`;

        arrayImagens.push({ url: imgRes });
      }
    }

    return arrayImagens;
  }

  useEffect(() => {
    api.get<Veiculo[]>('/veiculos.json').then((response) => {
      const findVeiculo = response.data.find(
        (veiculo) => veiculo.Codigo === Number(params.codigo),
      );
      console.log(findVeiculo);

      if (findVeiculo) {
        setDadosVeiculo(findVeiculo);
        verificaImagem().then((responseImagens) => {
          setVeiculoImagens(responseImagens);
          // console.log('vai porra')
          setIsLoading(false);
          displayFoto = 'block';
          if (responseImagens.length <= 0) {
            setIsFoundPhoto(false);
          }
        });
      }
    });
  }, [params.codigo]); //eslint-disable-line

  // console.log(veiculosImagens.length);

  return (
    <>
      <Header>
        <img src={logoImg} alt="Github Explorer" />
        <Link to="/">
          <FiChevronsLeft size={16} />
          Voltar
        </Link>
      </Header>

      {/* Se meu repository existir     && - ? */}
      {dadosVeiculo && (
        <RepositoryInfo>
          <header>
            {/* No maximo dois niveis de estilizacao. Por Exemplo header e a div que tem neste caso. */}

            <img
              src={`http://upper.noip.me/veiculos/1/${dadosVeiculo.Codigo}/imagem1.png`}
              alt={dadosVeiculo.Modelo}
            />
            <div>
              <strong>{dadosVeiculo.Marca}</strong>
              <p>{dadosVeiculo.Modelo}</p>
            </div>
          </header>

          <CardContainer>
            <Card>
              <header>
                <p>Cor: </p>
                {/* <img src={income} alt="Income" /> */}
              </header>
              <h1 data-testid="balance-income">{dadosVeiculo.Cor}</h1>
            </Card>
            <Card>
              <header>
                <p>Combustível: </p>
                {/* <img src={outcome} alt="Outcome" /> */}
              </header>
              <h1 data-testid="balance-outcome">{dadosVeiculo.Combustivel}</h1>
            </Card>
            <Card>
              <header>
                <p>Quilometragem: </p>
                {/* <img src={outcome} alt="Outcome" /> */}
              </header>
              <h1 data-testid="balance-outcome">
                {dadosVeiculo.Quilometragem}
              </h1>
            </Card>
            <Card>
              <header>
                <p>Ano Fabricação: </p>
                {/* <img src={outcome} alt="Outcome" /> */}
              </header>
              <h1 data-testid="balance-outcome">
                {dadosVeiculo.AnoFabricacao}
              </h1>
            </Card>
            <Card total>
              <header>
                <p>Valor: </p>
                <img src={total} alt="Total" />
              </header>
              <h1 data-testid="balance-total">
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(Number(dadosVeiculo.PrecoVenda))}
              </h1>
            </Card>
          </CardContainer>
        </RepositoryInfo>
      )}

      {/* ) : (
        <p>Carregando</p>
      )} */}

      <Issues>
        {dadosVeiculo?.Opcional && dadosVeiculo?.Opcional.length > 0 && (
          <strong>Opcionais: </strong>
        )}

        {dadosVeiculo?.Opcional.map((opcinal) => (
          <span key={opcinal}>
            <div>
              <strong>{opcinal}</strong>
              {/* <p>{issue.user.login}</p> */}
            </div>

            {/* <FiChevronRight size={20} /> */}
          </span>
        ))}
      </Issues>

      <Fotos>
      {isFoundPhoto && ( <strong>Fotos: </strong> )}

        {isLoading && (
          <Loading>
            <div id="loader" />
          </Loading>
        )}

      {isFoundPhoto && (
      <Carousel>
        {/* <div
          style={{ display: displayFoto }}
          id="myDiv"
          className="animate-bottom"
        /> */}
        {veiculosImagens.map((imagem) => (
          <Carousel.Item key={imagem.url}>
            <img
              className="d-block w-100"
              src={imagem.url}
              alt="First slide"
            />
            <Carousel.Caption>
              {/* <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p> */}
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
      )}
      </Fotos>
    </>
  );
};

export default Repository;
