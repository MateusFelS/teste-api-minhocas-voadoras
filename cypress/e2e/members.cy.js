const BASE_URL = Cypress.env('BASE_URL');
const MANAGEMENT_TOKEN = Cypress.env('MANAGEMENT_TOKEN');
const INVALID_TOKEN = Cypress.env('INVALID_TOKEN');

describe('Contentful API - Equipe', () => {
  let entryId; 

  it('Deve obter a lista de membros da equipe', () => {
    cy.request({
      method: 'GET',
      url: `${BASE_URL}/entries?content_type=equipe`,
      headers: {
        Authorization: `Bearer ${MANAGEMENT_TOKEN}` 
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.items).to.be.an('array');
      expect(response.body.items.length).to.be.greaterThan(0);

      const member = response.body.items[0].fields;
      expect(member).to.have.property('name');
      expect(member).to.have.property('whatsapp');
      expect(member).to.have.property('image');
    });
  });

  it('Deve criar um novo membro da equipe', () => {
    cy.request({
      method: 'POST',
      url: `${BASE_URL}/entries`,
      headers: {
        Authorization: `Bearer ${MANAGEMENT_TOKEN}`,
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        'X-Contentful-Content-Type': 'equipe' 
      },
      body: {
        fields: {
          name: { 'en-US': 'João Silva' },            
          whatsapp: { 'en-US': '+55 11 98765-4321' },  
          image: { 'en-US': 'https://example.com/foto.jpg' } 
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      entryId = response.body.sys.id;
    });
  });

  it('Deve deletar o membro da equipe', () => {
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

describe('Contentful API - Testes Negativos', () => {
  it('Não deve obter membros da equipe sem token de autenticação', () => {
    cy.request({
      method: 'GET',
      url: `${BASE_URL}/entries?content_type=equipe`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401); 
    });
  });

  it('Não deve obter membros da equipe com token inválido', () => {
    cy.request({
      method: 'GET',
      url: `${BASE_URL}/entries?content_type=equipe`,
      headers: {
        Authorization: `Bearer ${INVALID_TOKEN}`
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401); 
    });
  });

  it('Não deve criar um novo membro sem token de autenticação', () => {
    cy.request({
      method: 'POST',
      url: `${BASE_URL}/entries`,
      headers: {
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        'X-Contentful-Content-Type': 'equipe'
      },
      body: {
        fields: {
          name: { 'en-US': 'Maria Oliveira' },
          whatsapp: { 'en-US': '+55 21 99999-1234' },
          image: { 'en-US': 'https://example.com/maria.jpg' }
        }
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('Não deve deletar um membro inexistente', () => {
    const fakeEntryId = 'invalidEntry123';

    cy.request({
      method: 'DELETE',
      url: `${BASE_URL}/entries/${fakeEntryId}`,
      headers: {
        Authorization: `Bearer ${MANAGEMENT_TOKEN}` 
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404); 
    });
  });
});
