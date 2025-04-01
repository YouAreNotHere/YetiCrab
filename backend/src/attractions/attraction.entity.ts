import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Attraction {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @CreateDateColumn()
    addedAt!: Date;

    @Column('json')
    rating!: number[];

    @Column()
    photoUrl!: string;

    @Column()
    location!: string;

    @Column('double')
    latitude!: number;

    @Column('double')
    longitude!: number;

    @Column()
    mapLink!: string;

    @Column({ default: false })
    isVisited!: boolean;
}