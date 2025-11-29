// src/components/Form/Component.tsx
'use client'

import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { getClientSideURL } from '@/utilities/getURL'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

import { fields } from './fields'
import { SplitRevealText } from '@/components/animations/SplitRevealText'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState

  // NEW: title above the form
  formTitle?: string | null

  // NEW: right-side panel props coming from block config
  sideImage?: MediaType | null
  sideTitle?: string | null
  phone?: string | null
  email?: string | null
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,

    formTitle,

    // right-side content
    sideImage,
    sideTitle,
    phone,
    email,
  } = props

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>

      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)
            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })
            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect
            if (url) router.push(url)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({ message: 'Something went wrong.' })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div className="container mx-auto py-16">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}

      <div className="flex flex-col lg:flex-row-reverse w-full gap-8 items-center">
        <FormProvider {...formMethods}>
          <div className="w-full lg:w-[50%]">
            {/* Title above the form */}
            {!hasSubmitted && formTitle && (
              <SplitRevealText
                as="h2"
                variant="title"
                text={formTitle}
                className="mb-6 text-2xl md:text-3xl lg:text-6xl"
              />
            )}

            {!isLoading && hasSubmitted && confirmationType === 'message' && (
              <RichText data={confirmationMessage} />
            )}
            {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
            {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}

            {!hasSubmitted && (
              <form id={formID} onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4 last:mb-0">
                  {formFromProps?.fields?.map((field, index) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                    if (!Field) return null

                    const originalLabel =
                      'label' in field && typeof field.label === 'string' ? field.label : undefined

                    return (
                      <div className="mb-6 last:mb-0" key={index}>
                        <Field
                          form={formFromProps}
                          {...field}
                          // 👇 remove label text above input…
                          label=""
                          // …and use it as placeholder instead
                          placeholder={originalLabel}
                          {...formMethods}
                          control={control}
                          errors={errors}
                          register={register}
                        />
                      </div>
                    )
                  })}
                </div>

                <Button
                  form={formID}
                  type="submit"
                  variant="default"
                  className="!bg-black border border-black !text-white hover:!bg-white hover:!text-black transition-colors duration-200"
                >
                  {submitButtonLabel}
                </Button>
              </form>
            )}
          </div>
        </FormProvider>

        {sideImage && (
          <div className="relative w-full lg:w-[50%] min-h-[500px] md:min-h-[700px]">
            <Media resource={sideImage} fill imgClassName="object-cover grayscale" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </div>
        )}
      </div>
    </div>
  )
}
