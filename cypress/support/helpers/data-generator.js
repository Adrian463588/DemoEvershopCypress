import { faker } from '@faker-js/faker'

export const generateRandomUser = () => ({
  email: faker.internet.email(),
  password: faker.internet.password() + 'A1!', // Ensure complexity
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phone: faker.phone.number(),
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  zipCode: faker.location.zipCode()
})
