
export interface ContactData {
  fullName: string;
  firstName: string;
  lastName: string;
  prefix: string;
  organization: string;
  title: string;
  address: string;
  workPhone: string;
  mobilePhone: string;
  email: string;
  website: string;
}

export type MessageType = 'success' | 'error' | 'info';

export interface Message {
    text: string;
    type: MessageType;
}
