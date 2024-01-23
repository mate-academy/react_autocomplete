/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable max-len */
import { faker } from '@faker-js/faker';
import { peopleFromServer } from '../../src/data/people';
import { Person } from '../../src/types/Person';

enum DataQa {
  Title = 'title',
  SearchInput = 'search-input',
  SuggestionsList = 'suggestions-list',
  SuggestionItem = 'suggestion-item',
  NoSuggestionsMessage = 'no-suggestions-message',
}

const getByDataQa = (id: DataQa) => cy.get(`[data-qa="${id}"]`);
const getPageTitle = (person?: Person | null) => {
  if (person) {
    return `${person.name} (${person.born} - ${person.died})`;
  }

  return 'No selected person';
};

describe('Autocomplete page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the initial page title', () => {
    getByDataQa(DataQa.Title)
      .should('contain', getPageTitle());
  });

  it('should display the input', () => {
    getByDataQa(DataQa.SearchInput)
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Enter a part of the name')
      .and('have.value', '');
  });

  it('should not render "No matching suggestions" notification for empty input', () => {
    getByDataQa(DataQa.NoSuggestionsMessage)
      .should('not.exist');
  });

  it('should not display suggestions with empty focused input', () => {
    getByDataQa(DataQa.SearchInput)
      .focus();
    getByDataQa(DataQa.SuggestionsList)
      .should('not.be.visible');
  });

  it('should display "No matching suggestions" for non-matching input', () => {
    getByDataQa(DataQa.SearchInput)
      .type(faker.lorem.word());

    cy.wait(300);

    getByDataQa(DataQa.NoSuggestionsMessage)
      .should('be.visible')
      .and('contain', 'No matching suggestions');
  });

  it('should display suggestions for matching input', () => {
    const person = faker.helpers.arrayElement(peopleFromServer);
    const typedName = person.name.substring(
      0,
      faker.number.int({ min: 1, max: 2 }),
    );

    getByDataQa(DataQa.SearchInput)
      .type(typedName);

    cy.wait(300);

    getByDataQa(DataQa.SuggestionsList)
      .should('be.visible');

    getByDataQa(DataQa.SuggestionItem)
      .should('have.have.length.gte', 1)
      .and('contain', person.name);
  });

  it('should hide suggestions after input is cleared', () => {
    const person = faker.helpers.arrayElement(peopleFromServer);
    const typedName = person.name.substring(
      0,
      faker.number.int({ min: 1, max: 2 }),
    );

    getByDataQa(DataQa.SearchInput)
      .type(typedName);

    cy.wait(300);

    getByDataQa(DataQa.SuggestionsList)
      .should('be.visible');

    getByDataQa(DataQa.SearchInput)
      .clear();

    getByDataQa(DataQa.SuggestionsList)
      .should('not.be.visible');
  });

  it('should update the title with selected person', () => {
    const person = faker.helpers.arrayElement(peopleFromServer);

    getByDataQa(DataQa.SearchInput)
      .type(person.name);

    cy.wait(300);

    getByDataQa(DataQa.SuggestionItem)
      .contains(person.name)
      .click();

    getByDataQa(DataQa.Title)
      .should('contain', getPageTitle(person));
  });

  it('should update the title after another person is selected', () => {
    const person1 = faker.helpers.arrayElement(peopleFromServer.slice(0, 10));
    const person2 = faker.helpers.arrayElement(peopleFromServer.slice(10));

    getByDataQa(DataQa.SearchInput)
      .type(person1.name);

    cy.wait(300);

    getByDataQa(DataQa.SuggestionItem)
      .contains(person1.name)
      .click();

    getByDataQa(DataQa.Title)
      .should('contain', getPageTitle(person1));

    getByDataQa(DataQa.SearchInput)
      .clear();

    getByDataQa(DataQa.SearchInput)
      .type(person2.name);

    cy.wait(300);

    getByDataQa(DataQa.SuggestionItem)
      .contains(person2.name)
      .click();

    getByDataQa(DataQa.Title)
      .should('contain', getPageTitle(person2));
  });

  it('should update the title after input is cleared', () => {
    const person = faker.helpers.arrayElement(peopleFromServer);

    getByDataQa(DataQa.SearchInput)
      .type(person.name);

    cy.wait(300);

    getByDataQa(DataQa.SuggestionItem)
      .contains(person.name)
      .click();

    getByDataQa(DataQa.Title)
      .should('contain', getPageTitle(person));

    getByDataQa(DataQa.SearchInput)
      .clear();

    getByDataQa(DataQa.Title)
      .should('contain', getPageTitle());
  });
});
