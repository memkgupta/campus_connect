import mongoose from "mongoose";

const connect = async()=>{
    const connectionState = mongoose.connection.readyState;
    if(connectionState===1){
        console.log("Already connected");
        return;
    }
    if(connectionState===2){
        console.log("Connecting...")
        return;
    }
    try{
        mongoose.connect(process.env.DB_URI!!
           
        )
    }
    catch(err:any){
        console.log(err);
        throw new Error("Error: ",err)
    }
}
export default connect;