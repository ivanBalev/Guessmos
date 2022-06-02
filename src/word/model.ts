import { Schema, model } from 'mongoose';

export interface WordInput {
    id: string,
    language: string,
    length: number,
}

export interface IWord extends WordInput {
    _id: Schema.Types.ObjectId,
    content: string,
    createdAt: Date,
    updatedAt: Date,
}

const wordSchema = new Schema<IWord>({
    content: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        requred: true,
    },
    length: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

wordSchema.virtual('id').get(function () {
    return this._id.toString();
});

const Word = model('Word', wordSchema);

export default Word;