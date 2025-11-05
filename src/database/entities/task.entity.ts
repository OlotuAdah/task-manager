import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/shared/entities/base.entity';
import { TaskStatus } from '@/shared/enums/task-status.enum';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@Entity('tasks')
@Index(['userId', 'status'])
export class Task extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Comment, comment => comment.task)
  comments: Comment[];
}