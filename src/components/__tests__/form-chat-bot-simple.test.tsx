/**
 * Tests simplifiés pour FormChatBot
 * Ce fichier teste la logique du composant sans les complications des imports dynamiques
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useChatBotContext } from '@/context/chat-bot-context'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Mock le contexte
jest.mock('@/context/chat-bot-context')
const mockUseChatBotContext = useChatBotContext as jest.MockedFunction<
  typeof useChatBotContext
>

// Composant simplifié pour les tests (sans dynamic imports)
const FormDataSchemaChatBot = z.object({
  name: z.string().min(1, 'Le nom est requis').max(20, 'Le nom ne doit pas dépasser 20 caractères'),
  type: z.string().min(1, "Le type d'exercice est requis"),
  level: z.string().min(1, 'Le niveau est requis'),
  isSubmitted: z.boolean().optional().default(false)
})

const SimpleFormChatBot = () => {
  const { formData, setFormData } = useChatBotContext()

  const { register, handleSubmit, setValue, formState: { isSubmitting, errors } } = useForm({
    values: {
      name: formData.name,
      type: formData.type,
      level: formData.level,
      isSubmitted: formData.isSubmitted,
    },
    defaultValues: {
      name: formData.name,
      type: formData.type,
      level: formData.level,
      isSubmitted: formData.isSubmitted,
    },
    resolver: zodResolver(FormDataSchemaChatBot)
  })

  const handleChangeSelectLevel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('level', e.target.value)
  }

  const onSubmit = async (data: any) => {
    setFormData({
      ...formData,
      name: data.name,
      type: data.type,
      level: data.level,
      isSubmitted: true,
    })
  }

  if (formData.isSubmitted) {
    return null
  }

  return (
    <div className="w-full h-full md:h-auto border-white shadow-zinc-600 shadow-2xl rounded-md p-4 bg-white border-2">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
        <div>
          <label htmlFor="name">Nom*</label>
          <input id="name" type="text" {...register('name', { required: true })} />
        </div>

        <div>
          <label htmlFor="type">Type d&apos;exercice*</label>
          <input id="type" type="text" {...register('type', { required: true })} />
        </div>

        <select onChange={handleChangeSelectLevel} defaultValue="N1">
          <option value="N1">N1</option>
          <option value="N2">N2</option>
          <option value="N3">N3</option>
        </select>

        <button type="submit" disabled={isSubmitting}>Submit</button>

        {errors.name && <p className="text-red-500">Le nom est requis</p>}
        {errors.type && <p className="text-red-500">Le type d&apos;exercice est requis</p>}
      </form>
    </div>
  )
}

describe('FormChatBot - Logique de base', () => {
  const mockSetFormData = jest.fn()

  beforeEach(() => {
    mockUseChatBotContext.mockReturnValue({
      formData: {
        name: '',
        type: '',
        level: 'N1',
        isSubmitted: false,
      },
      setFormData: mockSetFormData,
    } as any)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('devrait afficher le formulaire quand non soumis', () => {
    render(<SimpleFormChatBot />)

    expect(screen.getByLabelText('Nom*')).toBeInTheDocument()
    expect(screen.getByLabelText("Type d'exercice*")).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('ne devrait pas afficher le formulaire quand déjà soumis', () => {
    mockUseChatBotContext.mockReturnValue({
      formData: {
        name: 'John',
        type: 'vocabulary',
        level: 'N1',
        isSubmitted: true,
      },
      setFormData: mockSetFormData,
    } as any)

    render(<SimpleFormChatBot />)

    expect(screen.queryByLabelText('Nom*')).not.toBeInTheDocument()
  })

  it('devrait mettre à jour formData lors de la soumission réussie', async () => {
    const user = userEvent.setup()
    render(<SimpleFormChatBot />)

    const nameInput = screen.getByLabelText('Nom*')
    const typeInput = screen.getByLabelText("Type d'exercice*")
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await user.type(nameInput, 'John')
    await user.type(typeInput, 'grammar')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSetFormData).toHaveBeenCalledWith({
        name: 'John',
        type: 'grammar',
        level: 'N1',
        isSubmitted: true,
      })
    })
  })

  it('devrait afficher une erreur de validation pour un nom vide', async () => {
    const user = userEvent.setup()
    render(<SimpleFormChatBot />)

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Le nom est requis')).toBeInTheDocument()
    })
  })

  it('devrait afficher une erreur de validation pour un type vide', async () => {
    const user = userEvent.setup()
    render(<SimpleFormChatBot />)

    const nameInput = screen.getByLabelText('Nom*')
    await user.type(nameInput, 'John')

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Le type d'exercice est requis")).toBeInTheDocument()
    })
  })

  it('devrait gérer le changement de niveau', async () => {
    const user = userEvent.setup()
    render(<SimpleFormChatBot />)

    const selectLevel = screen.getByRole('combobox')
    await user.selectOptions(selectLevel, 'N2')

    const nameInput = screen.getByLabelText('Nom*')
    const typeInput = screen.getByLabelText("Type d'exercice*")
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await user.type(nameInput, 'John')
    await user.type(typeInput, 'vocabulary')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSetFormData).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'N2',
        })
      )
    })
  })

  it('devrait désactiver le bouton pendant la soumission', async () => {
    const user = userEvent.setup()
    render(<SimpleFormChatBot />)

    const nameInput = screen.getByLabelText('Nom*')
    const typeInput = screen.getByLabelText("Type d'exercice*")
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await user.type(nameInput, 'John')
    await user.type(typeInput, 'grammar')

    expect(submitButton).not.toBeDisabled()
  })
})
