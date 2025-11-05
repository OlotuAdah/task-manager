export class CreateCommentCommand {
  constructor(
    public readonly content: string,
    public readonly taskId: string,
    public readonly userId: string,
  ) {}
}