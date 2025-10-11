import { FormDataSchema, FormDataSchemaChatBot } from '../form-schema'

describe('FormDataSchema', () => {
  it('should validate correct form data', () => {
    const validData = {
      level: 'N1',
      numberOfCards: 10,
      text: 'Sample text',
      csv: false,
      romanji: false,
      kanji: true,
      japanese: true,
      typeCard: 'basique',
    }

    const result = FormDataSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should apply default value for level', () => {
    const data = {
      numberOfCards: 5,
    }

    const result = FormDataSchema.parse(data)
    expect(result.level).toBe('N1')
  })

  it('should reject numberOfCards greater than 15', () => {
    const invalidData = {
      level: 'N1',
      numberOfCards: 20,
    }

    const result = FormDataSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        'Le nombre de cartes ne peut pas dépasser 30'
      )
    }
  })

  it('should reject text longer than 5000 characters', () => {
    const longText = 'a'.repeat(5001)
    const invalidData = {
      level: 'N1',
      numberOfCards: 5,
      text: longText,
    }

    const result = FormDataSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        'Le texte ne doit pas dépasser 15000 caractères'
      )
    }
  })

  it('should accept files within size limits', () => {
    const file = new File(['x'.repeat(100000)], 'test.pdf', {
      type: 'application/pdf',
    })

    const validData = {
      level: 'N1',
      numberOfCards: 5,
      files: [file],
    }

    const result = FormDataSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject files larger than 5MB', () => {
    const largeFile = new File(['x'.repeat(6000000)], 'large.pdf', {
      type: 'application/pdf',
    })

    const invalidData = {
      level: 'N1',
      numberOfCards: 5,
      files: [largeFile],
    }

    const result = FormDataSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        'Les fichiers ne doivent pas dépasser 5 MB'
      )
    }
  })

  it('should reject files smaller than 20KB', () => {
    const smallFile = new File(['x'.repeat(10000)], 'small.pdf', {
      type: 'application/pdf',
    })

    const invalidData = {
      level: 'N1',
      numberOfCards: 5,
      files: [smallFile],
    }

    const result = FormDataSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        'Les fichiers doivent faire au moins 20 KB'
      )
    }
  })

  it('should accept optional fields as undefined', () => {
    const minimalData = {
      level: 'N2',
      numberOfCards: 5,
    }

    const result = FormDataSchema.safeParse(minimalData)
    expect(result.success).toBe(true)
  })
})

describe('FormDataSchemaChatBot', () => {
  it('should validate correct chat bot form data', () => {
    const validData = {
      name: 'John',
      type: 'vocabulary',
      level: 'N3',
    }

    const result = FormDataSchemaChatBot.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject empty name', () => {
    const invalidData = {
      name: '',
      type: 'grammar',
      level: 'N1',
    }

    const result = FormDataSchemaChatBot.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le nom est requis')
    }
  })

  it('should reject name longer than 20 characters', () => {
    const invalidData = {
      name: 'a'.repeat(21),
      type: 'grammar',
      level: 'N1',
    }

    const result = FormDataSchemaChatBot.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        'Le nom ne doit pas dépasser 20 caractères'
      )
    }
  })

  it('should require type field', () => {
    const invalidData = {
      name: 'John',
      type: '',
      level: 'N1',
    }

    const result = FormDataSchemaChatBot.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        "Le type d'exercice est requis"
      )
    }
  })

  it('should require level field', () => {
    const invalidData = {
      name: 'John',
      type: 'grammar',
      level: '',
    }

    const result = FormDataSchemaChatBot.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le niveau est requis')
    }
  })

  it('should apply default value for isSubmitted', () => {
    const data = {
      name: 'John',
      type: 'vocabulary',
      level: 'N2',
    }

    const result = FormDataSchemaChatBot.parse(data)
    expect(result.isSubmitted).toBe(false)
  })

  it('should accept isSubmitted as true', () => {
    const data = {
      name: 'John',
      type: 'vocabulary',
      level: 'N2',
      isSubmitted: true,
    }

    const result = FormDataSchemaChatBot.parse(data)
    expect(result.isSubmitted).toBe(true)
  })
})
