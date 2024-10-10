import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { Game } from "./game.model";

export interface ReviewAttributes {
    id?: number;
    review_text: string;
    rating: number;
    game_id: number;
}

type ReviewCreationAttributes = Optional<ReviewAttributes, "id">;

export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
    public id!: number;
    public review_text!: string;
    public rating!: number;
    public game_id!: number;
    public game?: Game;
}

Review.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        review_text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
        game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'games',
                key: 'id'
            },
        },
    },
    {
        sequelize,
        tableName: "reviews",
    }
);

Review.belongsTo(Game, {
    foreignKey: "game_id",
    as: "game",
});