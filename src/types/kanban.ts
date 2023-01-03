export type Task = {
  title: string;
  labels: Label[];
  assignee: Assignee;
  id: number;
  index: number;
  commentCount: number | null;
  attachmentCount: number | null;
  priorityId: number;
};

export type Label = {
  label: {
    id: number;
    name: string;
    colorId: number;
  };
};

export type Assignee = {
  image: string | null;
  id: string;
} | null;

export type Column = {
  tasks: Task[];
  id: number;
  name: string;
  index: number;
};
