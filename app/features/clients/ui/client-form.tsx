import { useEffect } from "react"
import { useLoaderData, useFetcher, useParams, Link } from "react-router"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReactSelect } from "~/components/ui/react-select"
import { createClientSchema, type CreateClientInput } from "../client.schema"
import type { action as createAction } from "../actions/create-client.action"
import type { action as editAction } from "../actions/edit-client.action"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "~/components/ui/field"
import { toast } from "sonner"
import { clientLoader as loader } from "./client.loader"

export { loader }

export function meta() {
  return [{ title: "Client Form" }]
}

const entityTypeOptions = [
  { value: "legal_entity", label: "Company" },
  { value: "person", label: "Person" },
]

const countryOptions = [
  { value: "US", label: "United States" },
  { value: "MX", label: "Mexico" },
  { value: "CO", label: "Colombia" },
  { value: "AR", label: "Argentina" },
  { value: "CL", label: "Chile" },
  { value: "PE", label: "Peru" },
  { value: "ES", label: "Spain" },
]

export default function ClientFormPage() {
  const { client } = useLoaderData<typeof loader>()
  const params = useParams()
  const fetcher = useFetcher<typeof createAction | typeof editAction>()

  const isEditMode = Boolean(params.id)
  const clientId = params.id ? Number(params.id) : null

  const form = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      entityType: (client?.entityType as "legal_entity" | "person") ?? "legal_entity",
      legalName: client?.legalName ?? "",
      tradeName: client?.tradeName ?? "",
      taxId: client?.taxId ?? "",
      country: client?.country ?? "",
      address: client?.address ?? "",
      postalCode: client?.postalCode ?? "",
      email: client?.email ?? "",
      phone: client?.phone ?? "",
      notes: client?.notes ?? "",
    },
  })

  const isSubmitting = fetcher.state === "submitting"
  const entityType = form.watch("entityType")

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.errors) {
        toast.error("Error saving client")
      } else if (fetcher.data.success) {
        toast.success(
          isEditMode ? "Client updated successfully" : "Client created successfully"
        )
        if (!isEditMode) {
          window.history.replaceState({}, "", window.location.href)
        }
      }
    }
  }, [fetcher.state, fetcher.data, isEditMode])

  const onSubmit = (data: CreateClientInput) => {
    if (isEditMode && clientId) {
      fetcher.submit(
        { ...data, id: String(clientId) },
        { method: "post", action: "/clients/actions/edit" }
      )
    } else {
      fetcher.submit(
        { ...data },
        { method: "post", action: "/clients/actions/create" }
      )
    }
  }

  return (
    <div className="flex justify-center p-6">
      <div className="flex w-full min-w-0 flex-col gap-4 text-sm leading-loose">
        <div className="flex justify-between">
          <h1 className="font-medium text-lg">
            {isEditMode ? "Edit Client" : "Create New Client"}
          </h1>
          <Link to="/clients">
            <Button variant="outline" size="sm">
              Back to Clients
            </Button>
          </Link>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-2 flex flex-col gap-4 p-2 rounded-lg"
        >
          <FieldGroup>
            <div className="grid grid-cols-3 gap-4">
              <Controller
                name="entityType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Entity Type</FieldLabel>
                    <ReactSelect
                      inputId="entityType"
                      options={entityTypeOptions}
                      value={entityTypeOptions.find((o) => o.value === field.value)}
                      onChange={(selected) => field.onChange(selected?.value)}
                      isDisabled={isSubmitting}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="legalName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="client-legalName">
                      {entityType === "legal_entity" ? "Legal Name" : "Full Name"} *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="client-legalName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter legal name"
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="client-email">Email *</FieldLabel>
                    <Input
                      {...field}
                      id="client-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="contact@example.com"
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Controller
                name="tradeName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="client-tradeName">Trade Name</FieldLabel>
                    <Input
                      {...field}
                      id="client-tradeName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Optional trade name"
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="taxId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="client-taxId">
                      {entityType === "legal_entity" ? "Tax ID" : "ID Number"}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="client-taxId"
                      aria-invalid={fieldState.invalid}
                      placeholder="Tax/Legal ID"
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="client-phone">Phone</FieldLabel>
                    <Input
                      {...field}
                      id="client-phone"
                      aria-invalid={fieldState.invalid}
                      placeholder="Phone number"
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Controller
                name="country"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Country *</FieldLabel>
                    <ReactSelect
                      inputId="client-country"
                      options={countryOptions}
                      value={countryOptions.find((o) => o.value === field.value)}
                      onChange={(selected) => field.onChange(selected?.value)}
                      isDisabled={isSubmitting}
                      placeholder="Select country"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="address"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="client-address">Address</FieldLabel>
                    <Input
                      {...field}
                      id="client-address"
                      aria-invalid={fieldState.invalid}
                      placeholder="Physical/billing address"
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="postalCode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="client-postalCode">Postal Code *</FieldLabel>
                    <Input
                      {...field}
                      id="client-postalCode"
                      aria-invalid={fieldState.invalid}
                      placeholder="ZIP/Postal code"
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="notes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="client-notes">Notes</FieldLabel>
                  <Textarea
                    {...field}
                    id="client-notes"
                    aria-invalid={fieldState.invalid}
                    placeholder="Additional notes about the client..."
                    className="min-h-[80px]"
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Client"
                : "Create Client"}
          </Button>
        </form>
      </div>
    </div>
  )
}
