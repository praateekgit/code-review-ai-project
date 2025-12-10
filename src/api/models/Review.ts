import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    owner: string;
    repo: string;
    pull_number: number;
    diff: string;
    reviewText: string;
    createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        owner: { type: String, required: true },
        repo: { type: String, required: true },
        pull_number: { type: Number, required: true },
        diff: { type: String, required: true },
        reviewText: { type: String, required: true }
    },
    { timestamps: true }
);

const Review = mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
