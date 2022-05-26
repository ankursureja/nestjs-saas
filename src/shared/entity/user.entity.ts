import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column
  } from 'typeorm';
  
  @Entity('user')
  export class UserEntity extends BaseEntity {
	@PrimaryGeneratedColumn({ comment: 'PK Auto Increment' })
	id: number;
  
	@Column({ type: 'varchar', nullable: false, length:255 })
	display_name: string;
  
	@Column({ type: 'varchar', nullable: false, length:255 })
	timezone_value: string;
  
	@Column({ type: 'varchar', nullable: false, length:255 })
	offset_minutes: string;
  }
  
