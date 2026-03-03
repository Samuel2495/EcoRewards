// import { data } from "autoprefixer";
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const signup = async (req,res) =>{
    const { username, password, role} = req.body;


try{
    const existing =  await prisma.user.findUnique({
        where: { username }
    });

    if(existing)
        return res.status(400).json({message: "User already exists!!"});

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            role,
        },
    });

    res.status(201).json({message: "User created successfully!!"});
}   catch(err){
    res.status(500).json({message: "Server Error"});
}

};

export const login = async (req,res) => {
    const { username, password, role} = req.body;

    try{
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if( !user )
            return res.status(400).json({message: "Invalid Credentials"});

        if(user.role != role.toUpperCase())
            return res.status(403).json({message: "Selected Role doesnt match with the user"});

        const match = await bcrypt.compare(password, user.password);

        if(!match)
            return res.status(400).json({message: "Invalid password"});

        const token = jwt.sign(
            {id: user.id, role: user.role},
            process.env,JWT_SECRET,
            {expiresIn: "1d"}
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                points: user.points
            }
        });
    } catch (err){
        res.status(500).json({message: "Server Error"});
    }
};
