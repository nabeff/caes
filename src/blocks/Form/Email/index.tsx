import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Email: React.FC<
  EmailField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    placeholder?: string            // 👈 allow placeholder
  }
> = ({ name, defaultValue, errors, label, register, required, width, placeholder }) => {
  const effectivePlaceholder =
    placeholder || (typeof label === 'string' ? label : '') || ''

  return (
    <Width width={width}>
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
        placeholder={effectivePlaceholder}     
        {...register(name, {
          pattern: /^\S[^\s@]*@\S+$/,
          required,
        })}
      />

      {errors[name] && <Error name={name} />}
    </Width>
  )
}
