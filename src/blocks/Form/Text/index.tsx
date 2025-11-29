import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Text: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    placeholder?: string        // 👈 accept placeholder from FormBlock
  }
> = ({ name, defaultValue, errors, label, register, required, width, placeholder }) => {
  // use the passed placeholder, or fall back to label text
  const effectivePlaceholder =
    placeholder || (typeof label === 'string' ? label : '') || ''

  return (
    <Width width={width}>
      {/* keep label for a11y but hide visually */}
      {label && (
        <Label htmlFor={name} className="sr-only">
          {label}
          {required && (
            <span className="required">
              * <span className="sr-only">(required)</span>
            </span>
          )}
        </Label>
      )}

      <Input
        defaultValue={defaultValue}
        id={name}
        type="text"
        placeholder={effectivePlaceholder}         // 👈 HERE
        {...register(name, { required })}
      />

      {errors[name] && <Error name={name} />}
    </Width>
  )
}
