const BASE_URL = Cypress.env('BASE_URL');
const MANAGEMENT_TOKEN = Cypress.env('MANAGEMENT_TOKEN');
const INVALID_TOKEN = Cypress.env('INVALID_TOKEN');

describe('API - Notícias', () => {
    let entryId; 

    it('Deve obter a lista de notícias', () => {
        cy.request({
            method: 'GET',
            url: `${BASE_URL}/entries?content_type=noticias`, 
            headers: {
                Authorization: `Bearer ${MANAGEMENT_TOKEN}` 
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.items).to.be.an('array');
            expect(response.body.items.length).to.be.greaterThan(0);

            const news = response.body.items[0].fields; 
            expect(news).to.have.property('title');
            expect(news).to.have.property('content'); 
            expect(news).to.have.property('image');
        });
    });

    it('Deve criar uma nova notícia', () => {
        cy.request({
            method: 'POST',
            url: `${BASE_URL}/entries`,
            headers: {
                Authorization: `Bearer ${MANAGEMENT_TOKEN}`,
                'Content-Type': 'application/vnd.contentful.management.v1+json',
                'X-Contentful-Content-Type': 'noticias' 
            },
            body: {
                fields: {
                    id: { 'en-US': 1 }, // ID como inteiro
                    title: { 'en-US': 'Nova Descoberta Científica' }, 
                    content: { 'en-US': 'Hoje anunciamos uma nova descoberta no campo da ciência.' }, 
                    image: { 'en-US': 'https://example.com/noticia.jpg' } 
                }
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.fields.title['en-US']).to.eq('Nova Descoberta Científica');
            expect(response.body.fields.content['en-US']).to.eq('Hoje anunciamos uma nova descoberta no campo da ciência.'); 
            expect(response.body.fields.image['en-US']).to.eq('https://example.com/noticia.jpg');
            
            entryId = response.body.sys.id; 
        });
    });

    it('Deve deletar a notícia criada', () => {
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

describe('API - Testes Negativos - Notícias', () => {
    it('Não deve obter a lista de notícias sem token de autenticação', () => {
        cy.request({
            method: 'GET',
            url: `${BASE_URL}/entries?content_type=noticias`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401); 
        });
    });

    it('Não deve obter a lista de notícias com token inválido', () => {
        cy.request({
            method: 'GET',
            url: `${BASE_URL}/entries?content_type=noticias`,
            headers: {
                Authorization: `Bearer ${INVALID_TOKEN}` 
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401); 
        });
    });

    it('Não deve criar uma nova notícia sem token de autenticação', () => {
        cy.request({
            method: 'POST',
            url: `${BASE_URL}/entries`,
            headers: {
                'Content-Type': 'application/vnd.contentful.management.v1+json',
                'X-Contentful-Content-Type': 'noticias'
            },
            body: {
                fields: {
                    title: { 'en-US': 'Notícia Sem Autenticação' },
                    content: { 'en-US': 'Essa notícia não deve ser criada.' },
                    image: { 'en-US': 'https://example.com/noticia.jpg' }
                }
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401); 
        });
    });

    it('Não deve deletar uma notícia inexistente', () => {
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
