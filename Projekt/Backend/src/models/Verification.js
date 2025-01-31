import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
	hash: { type: String, required: true },
	status: { type: Boolean, default: false },
});

const Verification = mongoose.model('Verification', verificationSchema);
export default Verification;
