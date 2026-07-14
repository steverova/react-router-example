import { useEffect, useState } from "react"
import { useLoaderData, useFetcher, useParams, Link } from "react-router"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReactSelect } from "~/components/ui/react-select"
import { createProjectSchema, type CreateProjectInput } from "../project.schema"
import type { action as createAction } from "../actions/create-project.action"
import type { action as editAction } from "../actions/edit-project.action"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "~/components/ui/field"
import { toast } from "sonner"
import { projectLoader as loader } from "./project.loader"

export { loader }

export function meta() {
  return [{ title: "Project Form" }]
}

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "archived", label: "Archived" },
]

export default function ProjectFormPage() {
  const { project } = useLoaderData<typeof loader>()
  const params = useParams()
  const fetcher = useFetcher<typeof createAction | typeof editAction>()

  const isEditMode = Boolean(params.id)
  const projectId = params.id ? Number(params.id) : null

  const [clients, setClients] = useState<{ value: number; label: string }[]>([])

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setClients(data.map((c: { id: number; legalName: string }) => ({ value: c.id, label: c.legalName })))
        }
      })
      .catch(() => {})
  }, [])

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      clientEntityId: project?.clientEntityId ?? 0,
      name: project?.name ?? "",
      description: project?.description ?? "",
      projectManagerId: project?.projectManagerId ?? null,
      ownerId: project?.ownerId ?? null,
      status: (project?.status as CreateProjectInput["status"]) ?? "draft",
      startDate: project?.startDate ?? "",
      targetEndDate: project?.targetEndDate ?? "",
      hoursBudget: project?.hoursBudget ?? null,
      documentationUrl: project?.documentationUrl ?? "",
      repositoryUrl: project?.repositoryUrl ?? "",
      contractReference: project?.contractReference ?? "",
    },
  })

  const isSubmitting = fetcher.state === "submitting"
  const selectedStatus = form.watch("status")

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.errors) {
        toast.error("Error saving project")
      } else if (fetcher.data.success) {
        toast.success(
          isEditMode ? "Project updated successfully" : "Project created successfully"
        )
        if (!isEditMode) {
          window.history.replaceState({}, "", window.location.href)
        }
      }
    }
  }, [fetcher.state, fetcher.data, isEditMode])

  const onSubmit = (data: CreateProjectInput) => {
    if (isEditMode && projectId) {
      fetcher.submit(
        { ...data, id: String(projectId) },
        { method: "post", action: "/projects/actions/edit" }
      )
    } else {
      fetcher.submit(
        { ...data },
        { method: "post", action: "/projects/actions/create" }
      )
    }
  }

  return (
    <div className="flex justify-center p-6">
      <div className="flex w-full min-w-0 flex-col gap-4 text-sm leading-loose">
        <div className="flex justify-between">
          <h1 className="font-medium text-lg">
            {isEditMode ? "Edit Project" : "Create New Project"}
          </h1>
          <Link to="/projects">
            <Button variant="outline" size="sm">
              Back to Projects
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
                name="clientEntityId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Client *</FieldLabel>
                    <ReactSelect
                      inputId="project-client"
                      options={clients}
                      value={clients.find((c) => c.value === field.value)}
                      onChange={(selected) => field.onChange(selected?.value)}
                      isDisabled={isSubmitting}
                      placeholder="Select client"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="project-name">Name *</FieldLabel>
                    <Input
                      {...field}
                      id="project-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Project name"
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Status</FieldLabel>
                    <ReactSelect
                      inputId="project-status"
                      options={statusOptions}
                      value={statusOptions.find((o) => o.value === field.value)}
                      onChange={(selected) => field.onChange(selected?.value)}
                      isDisabled={isSubmitting}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="project-description">Description</FieldLabel>
                  <Textarea
                    {...field}
                    id="project-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Scope and objectives of the project..."
                    className="min-h-[80px]"
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <Controller
                name="startDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="project-startDate">Start Date</FieldLabel>
                    <Input
                      {...field}
                      id="project-startDate"
                      type="date"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="targetEndDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="project-targetEndDate">Target End Date</FieldLabel>
                    <Input
                      {...field}
                      id="project-targetEndDate"
                      type="date"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="hoursBudget"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="project-hoursBudget">Hours Budget</FieldLabel>
                    <Input
                      {...field}
                      id="project-hoursBudget"
                      type="number"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. 100"
                      disabled={isSubmitting}
                    />
                    <FieldDescription>Optional hour budget</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Controller
                name="documentationUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="project-documentationUrl">Documentation URL</FieldLabel>
                    <Input
                      {...field}
                      id="project-documentationUrl"
                      type="url"
                      aria-invalid={fieldState.invalid}
                      placeholder="https://docs.example.com"
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="repositoryUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="project-repositoryUrl">Repository URL</FieldLabel>
                    <Input
                      {...field}
                      id="project-repositoryUrl"
                      type="url"
                      aria-invalid={fieldState.invalid}
                      placeholder="https://github.com/org/repo"
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="contractReference"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="project-contractReference">Contract Reference</FieldLabel>
                    <Input
                      {...field}
                      id="project-contractReference"
                      aria-invalid={fieldState.invalid}
                      placeholder="Contract #"
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Project"
                : "Create Project"}
          </Button>
        </form>
      </div>
    </div>
  )
}
