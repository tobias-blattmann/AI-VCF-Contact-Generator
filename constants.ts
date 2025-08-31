
import { ContactData } from './types';

export const INITIAL_CONTACT_DATA: ContactData = {
  fullName: 'Max Mustermann',
  firstName: 'Max',
  lastName: 'Mustermann',
  prefix: 'Dr.',
  organization: 'Musterfirma GmbH',
  title: 'Muster-Position',
  address: 'Musterstr. 1, Musterstadt, 12345',
  workPhone: '+49123456789',
  mobilePhone: '+4917698765432',
  email: 'max.mustermann@musterfirma.de',
  website: 'www.musterfirma.de',
};

export const EMPTY_CONTACT_DATA: ContactData = {
  fullName: '',
  firstName: '',
  lastName: '',
  prefix: '',
  organization: '',
  title: '',
  address: '',
  workPhone: '',
  mobilePhone: '',
  email: '',
  website: '',
};
