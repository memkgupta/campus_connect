import mongoose from "mongoose";

const clubMemberSchema = new mongoose.Schema({
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',  // Assuming there is a 'Club' schema
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Reference to the user/student
      required: true,
    },
    role: {
      type: String,
      enum: ['President', 'Vice President', 'Secretary', 'Treasurer', 'Member', 'Head','Applicant'],
      default: 'Member',
    },
    team:{
        type:String,
        required:true
    },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Rejected'], // Membership status
      default: 'Pending',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  
  });

  const ClubMember = mongoose.models.ClubMember || mongoose.model('ClubMember',clubMemberSchema);
  export default ClubMember