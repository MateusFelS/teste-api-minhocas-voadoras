const BASE_URL = Cypress.env('BASE_URL');
const MANAGEMENT_TOKEN = Cypress.env('MANAGEMENT_TOKEN');
const INVALID_TOKEN = Cypress.env('INVALID_TOKEN');

describe('API - Livros', () => {
    let entryId; 

    it('Deve obter a lista de livros', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/entries?content_type=livros`,
        headers: {
          Authorization: `Bearer ${MANAGEMENT_TOKEN}` 
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.items).to.be.an('array');
        expect(response.body.items.length).to.be.greaterThan(0);
  
        const book = response.body.items[0].fields;
        expect(book).to.have.property('title');
        expect(book).to.have.property('author');
        expect(book).to.have.property('price');
        expect(book).to.have.property('image');
      });
    });

    it('Deve criar um novo livro', () => {
      cy.request({
        method: 'POST',
        url: `${BASE_URL}/entries`,
        headers: {
          Authorization: `Bearer ${MANAGEMENT_TOKEN}`,
          'Content-Type': 'application/vnd.contentful.management.v1+json',
          'X-Contentful-Content-Type': 'livros' 
        },
        body: {
          fields: {
            id: { 'en-US': 1 },
            title: { 'en-US': 'O Senhor dos Anéis' },
            author: { 'en-US': 'J.R.R. Tolkien' },
            price: { 'en-US': '39.90' },
            image: { 'en-US': 'https://example.com/livro.jpg' }
          }
        }
      }).then((response) => {
        expect(response.status).to.eq(201);
        entryId = response.body.sys.id; 
      });
    });

    it('Deve deletar o livro criado', () => {
      cy.request({
        method: 'DELETE',
        url: `${BASE_URL}/entries/${entryId}`,
        headers: {
          Authorization: `Bearer ${MANAGEMENT_TOKEN}`
        }
      }).then((response) => {
        expect(response.status).to.eq(204); 
      });
    });
});

describe('API - Testes Negativos - Livros', () => {
    it('Não deve obter a lista de livros sem token de autenticação', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/entries?content_type=livros`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('Não deve obter a lista de livros com token inválido', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/entries?content_type=livros`,
        headers: {
          Authorization: `Bearer ${INVALID_TOKEN}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('Não deve deletar um livro inexistente', () => {
      const fakeEntryId = 'invalidEntry123';

      cy.request({
        method: 'DELETE',
        url: `${BASE_URL}/entries/${fakeEntryId}`,
        headers: {
          Authorization: `Bearer ${MANAGEMENT_TOKEN}` // Agora acessível
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404); 
      });
    });
});
