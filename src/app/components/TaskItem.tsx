import { Doc } from "../../../convex/_generated/dataModel";

export type TaskItemProps = {
  task: Doc<"tasks"> | Doc<"recommendedTasks">;
};

const TaskItem: React.FC<TaskItemProps> = (props) => {
  return <div>{props.task.title}</div>;
};

export default TaskItem;
