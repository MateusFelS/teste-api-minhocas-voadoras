# Minhocas Voadoras - Serviços Literários
Este repositório contém os testes automatizados da API do site **Minhocas Voadoras - Serviços Literários**. Os testes foram desenvolvidos utilizando o **Cypress** e estão integrados ao **GitHub Actions** para execução contínua.

## Descrição do Projeto
O projeto visa garantir a qualidade e a confiabilidade das funcionalidades da API do site, proporcionando uma experiência estável para os usuários. Com os testes automatizados, conseguimos identificar e corrigir bugs de forma eficiente, reduzindo o tempo de validação e melhorando a entrega de novas funcionalidades.

## Testes Automatizados
- **Ferramenta Utilizada:** [Cypress](https://www.cypress.io/)
- **Tipo de Testes:** Testes automatizados de API
- **Funcionalidades Testadas:** Vários endpoints da API do site

## Integração Contínua
Os testes estão configurados para serem executados automaticamente sempre que houver uma nova alteração no código, utilizando **GitHub Actions**. Isso garante que qualquer nova implementação seja testada antes de ser mesclada ao código principal, aumentando a confiança na qualidade do software.

## Como Instalar e Executar os Testes Automatizados

### Pré-requisitos

Antes de começar, certifique-se de que você tem instalado:

- [Node.js](https://nodejs.org/) (versão recomendada: LTS)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Git (para clonar o repositório)
  
### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/minhocas-voadoras-testes.git
cd minhocas-voadoras-testes
```

2. Instale as dependências:

```bash
npm install
```

### Executando os Testes

1. Para rodar os testes via Cypress no modo headless (modo contínuo):

```bash
npx cypress run
```

2. Rodas os testes na interface interativa do Cypress:

```bash
npx cypress open
```
