import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/shared/entities/base.entity';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity('comments')
@Index(['taskId', 'createdAt'])
export class Comment extends BaseEntity {
  @Column()
  content: string;

  @Column()
  userId: string;

  @Column()
  taskId: string;

  @ManyToOne(() => User, user => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Task, task => task.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;
}