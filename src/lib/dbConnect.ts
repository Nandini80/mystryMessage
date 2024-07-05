import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?:number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    // Check ki phele se connection hai ya nhi
    if(connection.isConnected){
        console.log("already connected to database");
        return;
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || '',{})
        console.log("db",db);
        connection.isConnected = db.connections[0].readyState;
        console.log("DB connected succesfully");
    }
    catch(error){
      console.log("DB not connected, the error is : ", error);
      process.exit(1);
    }
}

export default dbConnect;