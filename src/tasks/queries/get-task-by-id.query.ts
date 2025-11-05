export class GetTaskByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}