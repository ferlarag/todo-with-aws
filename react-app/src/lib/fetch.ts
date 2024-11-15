import {TodoSchema} from "@/components/CreateTodoForm";

const date = new Date();

let store: TodoSchema[] = [
  {
    id: "0",
    title: "Me",
    createdAt: date,
    isCompleted: false,
  },
  {
    id: "1",
    title: "Set up project environment",
    description:
      "Install necessary dependencies and initialize project structure.",
    isCompleted: true,
    createdAt: date,
    dueDate: date,
  },
  {
    id: "2",
    title: "Write user authentication flow",
    isCompleted: true,
    createdAt: date,
    dueDate: date,
  },
  {
    id: "3",
    title: "Create homepage design",
    description: "Design a clean, user-friendly homepage layout in Figma.",
    isCompleted: false,
    createdAt: date,
  },
  {
    id: "4",
    title: "Build API endpoints",
    description: "Develop REST API endpoints for CRUD operations.",
    isCompleted: true,
    createdAt: date,
  },
  {
    id: "5",
    title: "Optimize database queries",
    description: "Analyze and improve performance of complex queries.",
    isCompleted: false,
    createdAt: date,
    dueDate: date,
  },
  {
    id: "6",
    title: "Add unit tests for components",
    description:
      "Write tests to ensure components render correctly and handle data as expected.",
    isCompleted: true,
    createdAt: date,
  },
  {
    id: "7",
    title: "Implement dark mode",
    description: "Add support for a dark theme and make it user-switchable.",
    isCompleted: true,
    createdAt: date,
    dueDate: date,
  },
  {
    id: "8",
    title: "Write documentation",
    description: "Document project setup, API endpoints, and common workflows.",
    isCompleted: false,
    createdAt: date,
    dueDate: date,
  },
  {
    id: "9",
    title: "Integrate payment gateway",
    description: "Add Stripe or PayPal to handle user transactions.",
    isCompleted: true,
    createdAt: date,
  },
  {
    id: "10",
    title: "Refactor codebase",
    description:
      "Improve readability, remove redundancies, and restructure files if needed.",
    isCompleted: true,
    createdAt: date,
    dueDate: date,
  },
];

export const getTodos = async (): Promise<TodoSchema[]> => {
  // Simulate a delay in fetching
  await new Promise((resolve) => {
    setTimeout(() => resolve("Promise resolved"), 200);
  });

  return store;
};

export const createTodo = async ({todo}: {todo: TodoSchema}) => {
  await new Promise((resolve) => {
    setTimeout(() => resolve("Resolved"), 200);
  });

  store = [...store, todo];
};

export const updateTodo = async ({newTodo}: {newTodo: TodoSchema}) => {
  await new Promise((resolve) => {
    setTimeout(() => resolve("Resolved"), 200);
  });

  store.map((prev) => (prev.id === newTodo.id ? {...prev, ...newTodo} : prev));
};

export const deleteTodo = async ({id}: {id: string}) => {
  await new Promise((resolve) => {
    setTimeout(() => resolve("Resolved"), 200);
  });

  const updatedArray = store.filter((prev) => prev.id !== id);
  store = updatedArray;
};
