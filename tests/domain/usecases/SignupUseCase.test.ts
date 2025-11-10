import { SignupUseCase, type SignupInput } from '@domain/usecases'
import { User } from '@domain/entities'
import { ValidationError, AuthenticationError } from '@domain/errors'
import { IUserRepository } from '@domain/repositories'

// Mock repository for testing
class MockUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map()

  async create(user: User): Promise<User> {
    this.users.set(user.email, user)
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.get(email) || null
  }

  async findById(id: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.id === id) return user
    }
    return null
  }

  async update(user: User): Promise<User> {
    this.users.set(user.email, user)
    return user
  }

  async delete(id: string): Promise<boolean> {
    for (const [email, user] of this.users.entries()) {
      if (user.id === id) {
        this.users.delete(email)
        return true
      }
    }
    return false
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.users.has(email)
  }
}

describe('SignupUseCase', () => {
  let useCase: SignupUseCase
  let mockRepository: MockUserRepository

  beforeEach(() => {
    mockRepository = new MockUserRepository()
    useCase = new SignupUseCase(mockRepository)
  })

  describe('execute', () => {
    it('should successfully register a new user with valid input', async () => {
      const input: SignupInput = {
        email: 'john@example.com',
        password: 'SecurePassword123',
        firstName: 'John',
        lastName: 'Doe',
      }

      const result = await useCase.execute(input)

      expect(result).toBeInstanceOf(User)
      expect(result.email).toBe('john@example.com')
      expect(result.firstName).toBe('John')
      expect(result.lastName).toBe('Doe')
    })

    it('should successfully register a user without optional name fields', async () => {
      const input: SignupInput = {
        email: 'jane@example.com',
        password: 'SecurePassword123',
      }

      const result = await useCase.execute(input)

      expect(result).toBeInstanceOf(User)
      expect(result.email).toBe('jane@example.com')
      expect(result.firstName).toBeUndefined()
      expect(result.lastName).toBeUndefined()
    })

    it('should throw ValidationError when email is invalid (no @)', async () => {
      const input: SignupInput = {
        email: 'invalidemail.com',
        password: 'SecurePassword123',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(useCase.execute(input)).rejects.toThrow('Invalid email address')
    })

    it('should throw ValidationError when email is invalid (no domain)', async () => {
      const input: SignupInput = {
        email: 'user@',
        password: 'SecurePassword123',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError when email is empty', async () => {
      const input: SignupInput = {
        email: '',
        password: 'SecurePassword123',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(useCase.execute(input)).rejects.toThrow('Invalid email address')
    })

    it('should throw ValidationError when password is too short', async () => {
      const input: SignupInput = {
        email: 'john@example.com',
        password: 'Short1',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(useCase.execute(input)).rejects.toThrow('Password must be at least 8 characters')
    })

    it('should throw ValidationError when password is empty', async () => {
      const input: SignupInput = {
        email: 'john@example.com',
        password: '',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError when first name is empty string', async () => {
      const input: SignupInput = {
        email: 'john@example.com',
        password: 'SecurePassword123',
        firstName: '   ',
        lastName: 'Doe',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(useCase.execute(input)).rejects.toThrow('First name cannot be empty')
    })

    it('should throw ValidationError when last name is empty string', async () => {
      const input: SignupInput = {
        email: 'john@example.com',
        password: 'SecurePassword123',
        firstName: 'John',
        lastName: '   ',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(useCase.execute(input)).rejects.toThrow('Last name cannot be empty')
    })

    it('should throw AuthenticationError when user already exists', async () => {
      const firstUser: SignupInput = {
        email: 'john@example.com',
        password: 'SecurePassword123',
      }

      // Register first user
      await useCase.execute(firstUser)

      // Try to register with same email
      const secondUser: SignupInput = {
        email: 'john@example.com',
        password: 'DifferentPassword456',
      }

      await expect(useCase.execute(secondUser)).rejects.toThrow(AuthenticationError)
      await expect(useCase.execute(secondUser)).rejects.toThrow('User with this email already exists')
    })

    it('should create user with valid minimum password length (8 characters)', async () => {
      const input: SignupInput = {
        email: 'user@example.com',
        password: '12345678', // Exactly 8 characters
      }

      const result = await useCase.execute(input)

      expect(result).toBeInstanceOf(User)
      expect(result.email).toBe('user@example.com')
    })

    it('should accept valid email formats', async () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@test.io',
      ]

      for (const email of validEmails) {
        const input: SignupInput = {
          email,
          password: 'ValidPassword123',
        }

        const result = await useCase.execute(input)
        expect(result.email).toBe(email)
      }
    })

    it('should reject invalid email formats', async () => {
      const invalidEmails = [
        'user@',
        '@example.com',
        'user@example',
        'userexample.com',
        'user @example.com',
        'user@exam ple.com',
      ]

      for (const email of invalidEmails) {
        const input: SignupInput = {
          email,
          password: 'ValidPassword123',
        }

        await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
      }
    })
  })

  describe('integration scenarios', () => {
    it('should preserve user data after registration', async () => {
      const input: SignupInput = {
        email: 'john@example.com',
        password: 'SecurePassword123',
        firstName: 'John',
        lastName: 'Doe',
      }

      const registeredUser = await useCase.execute(input)

      // Verify user can be retrieved
      const retrievedUser = await mockRepository.findByEmail(input.email)

      expect(retrievedUser).not.toBeNull()
      expect(retrievedUser?.firstName).toBe('John')
      expect(retrievedUser?.lastName).toBe('Doe')
    })
  })
})
