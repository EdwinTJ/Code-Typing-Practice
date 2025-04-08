export interface CodeExercise {
  prompt: string;
  code: string;
}

export interface ExerciseCollection {
  [difficulty: string]: CodeExercise[];
}

export const pythonExercises: ExerciseCollection = {
  beginner: [
    {
      prompt: "Print 'Hello, World!'",
      code: "print('Hello, World!')",
    },
    {
      prompt: "Define a variable and print it",
      code: "x = 10\nprint(x)",
    },
    {
      prompt: "Basic if statement",
      code: "if 5 > 2:\n  print('Five is greater than two!')",
    },
  ],
  intermediate: [
    {
      prompt: "Define a function",
      code: "def greet(name):\n  print('Hello, ' + name)",
    },
    {
      prompt: "Use a for loop",
      code: "for i in range(5):\n  print(i)",
    },
    {
      prompt: "Create a list and access elements",
      code: "my_list = [1, 2, 3]\nprint(my_list[0])",
    },
  ],
  advanced: [
    {
      prompt: "Use list comprehension",
      code: "squares = [x**2 for x in range(10)]",
    },
    {
      prompt: "Handle exceptions with try-except",
      code: "try:\n  result = 10 / 0\nexcept ZeroDivisionError:\n  print('Cannot divide by zero')",
    },
    {
      prompt: "Read from a file",
      code: "with open('file.txt', 'r') as f:\n  content = f.read()",
    },
  ],
};
