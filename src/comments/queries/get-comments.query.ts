export class GetCommentsQuery {
  constructor(
    public readonly taskId: string,
    public readonly userId: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {}
}