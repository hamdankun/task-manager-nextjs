import { LoginUseCase, type IPasswordService } from '@domain/usecases'
import { User } from '@domain/entities'
import { ValidationError, AppError, AuthenticationError } from '@domain/errors'
import { IUserRepository } from '@domain/repositories'

// Mock repository
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

// Mock password service
class MockPasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    return `hashed_${password}`
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return hash === `hashed_${password}`
  }
}

describe('LoginUseCase', () => {
  let useCase: LoginUseCase
  let mockRepository: MockUserRepository
  let mockPasswordService: MockPasswordService

  beforeEach(() => {
    mockRepository = new MockUserRepository()
    mockPasswordService = new MockPasswordService()
    useCase = new LoginUseCase(mockRepository, mockPasswordService)
  })

  describe('execute', () => {
    it('should login successfully with correct credentials', async () => {
      // Setup - create a user first
      const user = new User('user-1', 'john@example.com', await mockPasswordService.hash('password123'), 'John', 'Doe')
      await mockRepository.create(user)

      const input = {
        email: 'john@example.com',
        password: 'password123',
      }

      const result = await useCase.execute(input)

      expect(result).toBeInstanceOf(User)
      expect(result.email).toBe('john@example.com')
      expect(result.firstName).toBe('John')
      expect(result.lastName).toBe('Doe')
    })

    it('should login successfully with user info', async () => {
      const user = new User('user-2', 'jane@example.com', await mockPasswordService.hash('SecurePass456'), 'Jane', 'Smith')
      await mockRepository.create(user)

      const result = await useCase.execute({
        email: 'jane@example.com',
        password: 'SecurePass456',
      })

      expect(result.id).toBe('user-2')
      expect(result.firstName).toBe('Jane')
      expect(result.lastName).toBe('Smith')
    })

    it('should return user with all fields after login', async () => {
      const user = new User('user-3', 'bob@example.com', await mockPasswordService.hash('Password789'), 'Bob')
      await mockRepository.create(user)

      const result = await useCase.execute({
        email: 'bob@example.com',
        password: 'Password789',
      })

      expect(result).toBeDefined()
      expect(result.id).toBe('user-3')
      expect(result.email).toBe('bob@example.com')
      expect(result.firstName).toBe('Bob')
    })

    it('should throw AuthenticationError when email format is invalid', async () => {
      const input = {
        email: 'invalid-email',
        password: 'password123',
      }

      await expect(useCase.execute(input)).rejects.toThrow(AuthenticationError)
    })

    it('should throw ValidationError when email is empty', async () => {
      const input = {
        email: '',
        password: 'password123',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError when password is empty', async () => {
      const input = {
        email: 'john@example.com',
        password: '',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should throw AppError when user does not exist', async () => {
      const input = {
        email: 'nonexistent@example.com',
        password: 'password123',
      }

      await expect(useCase.execute(input)).rejects.toThrow(AppError)
    })

    it('should throw AppError when password is incorrect', async () => {
      const user = new User('user-1', 'john@example.com', await mockPasswordService.hash('password123'), 'John', 'Doe')
      await mockRepository.create(user)

      const input = {
        email: 'john@example.com',
        password: 'wrongpassword',
      }

      await expect(useCase.execute(input)).rejects.toThrow(AppError)
    })

    it('should throw AuthenticationError for invalid email without @', async () => {
      const input = {
        email: 'invalidemail.com',
        password: 'password123',
      }

      await expect(useCase.execute(input)).rejects.toThrow(AuthenticationError)
    })

    it('should throw AuthenticationError for invalid email without domain', async () => {
      const input = {
        email: 'user@',
        password: 'password123',
      }

      await expect(useCase.execute(input)).rejects.toThrow(AuthenticationError)
    })

    it('should be case sensitive for passwords', async () => {
      const user = new User('user-1', 'john@example.com', await mockPasswordService.hash('Password123'), 'John', 'Doe')
      await mockRepository.create(user)

      const input = {
        email: 'john@example.com',
        password: 'password123', // lowercase, should fail
      }

      await expect(useCase.execute(input)).rejects.toThrow(AppError)
    })

    it('should handle multiple login attempts for same user', async () => {
      const user = new User('user-1', 'john@example.com', await mockPasswordService.hash('password123'), 'John', 'Doe')
      await mockRepository.create(user)

      const validInput = {
        email: 'john@example.com',
        password: 'password123',
      }

      // First login
      const result1 = await useCase.execute(validInput)
      expect(result1.email).toBe('john@example.com')

      // Second login with same credentials
      const result2 = await useCase.execute(validInput)
      expect(result2.email).toBe('john@example.com')
      expect(result1.id).toBe(result2.id)
    })

    it('should reject login with whitespace in password', async () => {
      const user = new User('user-1', 'john@example.com', await mockPasswordService.hash('password123'), 'John', 'Doe')
      await mockRepository.create(user)

      const input = {
        email: 'john@example.com',
        password: ' password123 ', // with spaces
      }

      await expect(useCase.execute(input)).rejects.toThrow(AppError)
    })
  })

  describe('edge cases', () => {
    it('should handle user with very long password', async () => {
      const longPassword = 'a'.repeat(256)
      const user = new User('user-1', 'john@example.com', await mockPasswordService.hash(longPassword), 'John', 'Doe')
      await mockRepository.create(user)

      const result = await useCase.execute({
        email: 'john@example.com',
        password: longPassword,
      })

      expect(result.email).toBe('john@example.com')
    })

    it('should handle special characters in password', async () => {
      const specialPassword = 'P@ssw0rd!#$%'
      const user = new User('user-1', 'john@example.com', await mockPasswordService.hash(specialPassword), 'John', 'Doe')
      await mockRepository.create(user)

      const result = await useCase.execute({
        email: 'john@example.com',
        password: specialPassword,
      })

      expect(result.email).toBe('john@example.com')
    })

    it('should handle unicode characters in user names', async () => {
      const user = new User('user-1', 'john@example.com', await mockPasswordService.hash('password123'), 'João', 'Döe')
      await mockRepository.create(user)

      const result = await useCase.execute({
        email: 'john@example.com',
        password: 'password123',
      })

      expect(result.firstName).toBe('João')
      expect(result.lastName).toBe('Döe')
    })

    it('should handle email with subdomain', async () => {
      const user = new User('user-1', 'user@mail.example.co.uk', await mockPasswordService.hash('password123'), 'John', 'Doe')
      await mockRepository.create(user)

      const result = await useCase.execute({
        email: 'user@mail.example.co.uk',
        password: 'password123',
      })

      expect(result.email).toBe('user@mail.example.co.uk')
    })
  })

  describe('security', () => {
    it('should not expose password in result', async () => {
      const user = new User('user-1', 'john@example.com', await mockPasswordService.hash('password123'), 'John', 'Doe')
      await mockRepository.create(user)

      const result = await useCase.execute({
        email: 'john@example.com',
        password: 'password123',
      })

      // Password should not be returned in plain text (it's hashed)
      expect(result.password).not.toBe('password123')
    })

    it('should use password service for comparison', async () => {
      const hashSpy = jest.spyOn(mockPasswordService, 'compare')

      const user = new User('user-1', 'john@example.com', await mockPasswordService.hash('password123'), 'John', 'Doe')
      await mockRepository.create(user)

      await useCase.execute({
        email: 'john@example.com',
        password: 'password123',
      })

      expect(hashSpy).toHaveBeenCalled()
      hashSpy.mockRestore()
    })
  })
})
