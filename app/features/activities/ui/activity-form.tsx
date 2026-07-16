import { useEffect } from "react"
import { useLoaderData, useFetcher, useParams, Link } from "react-router"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReactSelect } from "~/components/ui/react-select"
import { createActivitySchema, type CreateActivityInput } from "../activity.schema"
import type { action as createAction } from "../actions/create-activity.action"
import type { action as editAction } from "../actions/edit-activity.action"
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
import { activityLoader as loader } from "./activity.loader"

export { loader }

export function meta() {
  return [{ title: "Activity Form" }]
}

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "blocked", label: "Blocked" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

export default function ActivityFormPage() {
  const { activity, projects } = useLoaderData<typeof loader>()
  const params = useParams()
  const fetcher = useFetcher<typeof createAction | typeof editAction>()

  const isEditMode = Boolean(params.id)
  const activityId = params.id ? Number(params.id) : null

  const projectOptions = projects.map((p: { id: number; name: string }) => ({
    value: p.id,
    label: p.name,
  }))

  const form = useForm<CreateActivityInput>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      projectId: activity?.projectId ?? 0,
      parentActivityId: activity?.parentActivityId ?? null,
      title: activity?.title ?? "",
      description: activity?.description ?? "",
      priority: (activity?.priority as CreateActivityInput["priority"]) ?? "medium",
      status: (activity?.status as CreateActivityInput["status"]) ?? "pending",
      estimatedHours: activity?.estimatedHours ?? undefined,
      startDate: activity?.startDate ?? "",
      dueDate: activity?.dueDate ?? "",
    },
  })

  const isSubmitting = fetcher.state === "submitting"

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.errors) {
        toast.error("Error saving activity")
      } else if (fetcher.data.success) {
        toast.success(
          isEditMode ? "Activity updated successfully" : "Activity created successfully"
        )
        if (!isEditMode) {
          window.history.replaceState({}, "", window.location.href)
        }
      }
    }
  }, [fetcher.state, fetcher.data, isEditMode])

  const onSubmit = (data: CreateActivityInput) => {
    if (isEditMode && activityId) {
      fetcher.submit(
        { ...data, id: String(activityId) },
        { method: "post", action: "/activities/actions/edit" }
      )
    } else {
      fetcher.submit(
        { ...data },
        { method: "post", action: "/activities/actions/create" }
      )
    }
  }

  return (
    <div className="flex justify-center p-6">
      <div className="flex w-full min-w-0 flex-col gap-4 text-sm leading-loose">
        <div className="flex justify-between">
          <h1 className="font-medium text-lg">
            {isEditMode ? "Edit Activity" : "Create New Activity"}
          </h1>
          <Link to="/activities">
            <Button variant="outline" size="sm">
              Back to Activities
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
                name="projectId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Project *</FieldLabel>
                    <ReactSelect
                      inputId="activity-project"
                      options={projectOptions}
                      value={projectOptions.find((p) => p.value === field.value) ?? null}
                       onChange={(selected) => field.onChange(!Array.isArray(selected) && selected ? (selected as { value: number }).value : undefined)}
                      isDisabled={isSubmitting}
                      placeholder="Select project"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="activity-title">Title *</FieldLabel>
                    <Input
                      {...field}
                      id="activity-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Activity title"
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
                      inputId="activity-status"
                      options={statusOptions}
                      value={statusOptions.find((o) => o.value === field.value) ?? null}
                       onChange={(selected) => field.onChange(!Array.isArray(selected) && selected ? (selected as { value: string }).value : undefined)}
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
                  <FieldLabel htmlFor="activity-description">Description</FieldLabel>
                  <Textarea
                    {...field}
                    id="activity-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Describe the work to be done..."
                    className="min-h-[80px]"
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <Controller
                name="priority"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Priority</FieldLabel>
                    <ReactSelect
                      inputId="activity-priority"
                      options={priorityOptions}
                      value={priorityOptions.find((o) => o.value === field.value) ?? null}
                       onChange={(selected) => field.onChange((selected as { value: any } | null)?.value)}
                      isDisabled={isSubmitting}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="startDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="activity-startDate">Start Date</FieldLabel>
                    <Input
                      {...field}
                      id="activity-startDate"
                      type="date"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="dueDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="activity-dueDate">Due Date</FieldLabel>
                    <Input
                      {...field}
                      id="activity-dueDate"
                      type="date"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Controller
                name="estimatedHours"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="activity-estimatedHours">Estimated Hours</FieldLabel>
                    <Input
                      {...field}
                      id="activity-estimatedHours"
                      type="number"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. 8"
                      value={field.value ?? ""}
                      disabled={isSubmitting}
                    />
                    <FieldDescription>Optional hour estimate</FieldDescription>
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
                ? "Update Activity"
                : "Create Activity"}
          </Button>
        </form>
      </div>
    </div>
  )
}
