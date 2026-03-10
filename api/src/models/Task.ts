import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IComment {
  user: Types.ObjectId;
  message: string;
  createdAt: Date;
}

export interface ITask extends Document {
  projectId: Types.ObjectId;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  assignees: Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  message: {
    type: String,
    required: true,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TaskSchema: Schema<ITask> = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
      index: true,
    },

    assignees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],

    comments: [CommentSchema],
  },
  {
    timestamps: true,
  }
);

TaskSchema.index({ projectId: 1, status: 1 });

TaskSchema.index({ projectId: 1, createdAt: -1 });

TaskSchema.index({ assignees: 1 });

TaskSchema.index({
  title: "text",
  description: "text",
  "comments.message": "text",
});

const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

export default Task;
