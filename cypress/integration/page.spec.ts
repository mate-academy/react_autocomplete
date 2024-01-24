/* eslint-disable max-len */
import { faker } from '@faker-js/faker';
import { peopleFromServer } from '../../src/data/people';
import { Person } from '../../src/types/Person';

const page = {
  title: () => cy.getByDataCy('title'),
  searchInput: () => cy.getByDataCy('search-input'),
  suggestionsList: () => cy.getByDataCy('suggestions-list'),
  suggestionItem: () => cy.getByDataCy('suggestion-item'),
  noSuggestionsMessage: () => cy.getByDataCy('no-suggestions-message'),
  debounce: (delay = 300) => {
    cy.clock().then((clock) => {
      clock.tick(delay);
      clock.restore();
    });
  },
  getPageTitle: (person: Person) => (
    `${person.name} (${person.born} - ${person.died})`
  ),
};

describe('Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the initial page title', () => {
    page.title()
      .should('contain', 'No selected person');
  });

  it('should display the input', () => {
    page.searchInput()
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Enter a part of the name')
      .and('have.value', '');
  });

  it('should not render "No matching suggestions" notification for empty input', () => {
    page.noSuggestionsMessage()
      .should('not.exist');
  });

  it('should not display suggestions with empty focused input', () => {
    page.searchInput()
      .focus();
    page.suggestionsList()
      .should('not.be.visible');
  });

  it('should display "No matching suggestions" for non-matching input', () => {
    page.searchInput()
      .type('non-matching');

    page.debounce();

    page.noSuggestionsMessage()
      .should('be.visible')
      .and('contain', 'No matching suggestions');
  });

  it('should display suggestions for matching input', () => {
    const person = faker.helpers.arrayElement(peopleFromServer);
    const typedName = person.name.substring(
      0,
      faker.number.int({ min: 1, max: 2 }),
    );

    page.searchInput()
      .type(typedName);

    page.debounce();

    page.suggestionsList()
      .should('be.visible');

    page.suggestionItem()
      .should('have.have.length.gte', 1)
      .and('contain', person.name);
  });

  it('should hide suggestions after input is cleared', () => {
    const person = faker.helpers.arrayElement(peopleFromServer);
    const typedName = person.name.substring(
      0,
      faker.number.int({ min: 1, max: 2 }),
    );

    page.searchInput()
      .type(typedName);

    page.debounce();

    page
      .suggestionsList()
      .should('be.visible');

    page.searchInput()
      .clear();

    page.suggestionsList()
      .should('not.be.visible');
  });

  it('should update the title with selected person', () => {
    const person = faker.helpers.arrayElement(peopleFromServer);

    page.searchInput()
      .type(person.name);

    page.debounce();

    page.suggestionItem()
      .contains(person.name)
      .click();

    page.title()
      .should('contain', page.getPageTitle(person));
  });

  it('should update the title after another person is selected', () => {
    const person1 = faker.helpers.arrayElement(peopleFromServer.slice(0, 10));
    const person2 = faker.helpers.arrayElement(peopleFromServer.slice(10));

    page.searchInput()
      .type(person1.name);

    page.debounce();

    page.suggestionItem()
      .contains(person1.name)
      .click();

    page.title()
      .should('contain', page.getPageTitle(person1));

    page.searchInput()
      .clear();

    page.searchInput()
      .type(person2.name);

    page.debounce();

    page.suggestionItem()
      .contains(person2.name)
      .click();

    page.title()
      .should('contain', page.getPageTitle(person2));
  });

  it('should update the title after input is cleared', () => {
    const person = faker.helpers.arrayElement(peopleFromServer);

    page.searchInput()
      .type(person.name);

    page.debounce();

    page.suggestionItem()
      .contains(person.name)
      .click();

    page.title()
      .should('contain', page.getPageTitle(person));

    page.searchInput()
      .clear();

    page.title()
      .should('contain', 'No selected person');
  });
});
