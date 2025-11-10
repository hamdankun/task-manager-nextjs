import { User } from '@domain/entities'

describe('User Entity', () => {
  const userId = 'user-1'
  const email = 'john@example.com'
  const password = 'hashed_password_123'
  const firstName = 'John'
  const lastName = 'Doe'

  describe('constructor', () => {
    it('should create a user with required fields', () => {
      const user = new User(userId, email, password)

      expect(user.id).toBe(userId)
      expect(user.email).toBe(email)
      expect(user.password).toBe(password)
      expect(user.firstName).toBeUndefined()
      expect(user.lastName).toBeUndefined()
    })

    it('should create a user with all fields', () => {
      const createdAt = new Date('2024-01-01')
      const updatedAt = new Date('2024-01-02')

      const user = new User(
        userId,
        email,
        password,
        firstName,
        lastName,
        createdAt,
        updatedAt
      )

      expect(user.id).toBe(userId)
      expect(user.email).toBe(email)
      expect(user.password).toBe(password)
      expect(user.firstName).toBe(firstName)
      expect(user.lastName).toBe(lastName)
      expect(user.createdAt).toBe(createdAt)
      expect(user.updatedAt).toBe(updatedAt)
    })
  })

  describe('getFullName', () => {
    it('should return first and last name when both are provided', () => {
      const user = new User(userId, email, password, firstName, lastName)
      expect(user.getFullName()).toBe('John Doe')
    })

    it('should return only first name when last name is not provided', () => {
      const user = new User(userId, email, password, firstName)
      expect(user.getFullName()).toBe(firstName)
    })

    it('should return only last name when first name is not provided', () => {
      const user = new User(userId, email, password, undefined, lastName)
      expect(user.getFullName()).toBe(lastName)
    })
  })
})
