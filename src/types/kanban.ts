export type Task = {
	id: number
	title: string
	labels: Label[]
	assignee?: Assignee
	index?: number
	taskKey: string
	commentCount: number | null
	attachmentCount: number | null
	priorityId: number | null
	createdAt?: Date
}

export type Label = {
	label: {
		id: number
		name: string
		colorId: number
	}
}

export type Assignee = {
	id: string
	image: string | null
} | null

export type Column = {
	tasks: Task[]
	id: number
	name: string
	index: number
}
