export function notFound(name: string): never {
  const error = new Error(name + " not found");
  (error as any).status = 404;
  throw error;
}


export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}