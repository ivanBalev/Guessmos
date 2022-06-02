import { Schema, model } from 'mongoose';

const dayWordSchema = new Schema({
    wordId: {
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


const DayWord = model('DayWord', dayWordSchema);

export default DayWord;