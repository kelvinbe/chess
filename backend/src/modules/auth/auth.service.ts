import bcrypt from "bcrypt";
import prisma from "../../config/database";


interface RegisterInput {
    username: string;
    email: string;
    password: string;
}


export async function registerUser(data: RegisterInput) {

    const existingUser = await prisma.user.findFirst({
        where:{
            OR:[
                {
                    email:data.email
                },
                {
                    username:data.username
                }
            ]
        }
    });


    if(existingUser){
        throw new Error("User already exists");
    }


    const passwordHash = await bcrypt.hash(
        data.password,
        10
    );


    const user = await prisma.user.create({
        data:{
            username:data.username,
            email:data.email,
            passwordHash
        }
    });


    return user;
}