import axios from 'axios';

const api = axios.create({
  baseURL:
    'https://cors-anywhere.herokuapp.com/http://upper.noip.me/veiculos/1', // onde fica pedaco do endereco que vai ser utilizado em todas as requisicoes
});

export default api;
