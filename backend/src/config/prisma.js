/*
// import { PrismaClient } from '@prisma/client'
import pkg from '@prisma/client';
const {PrismaClient} = pkg;
// require('@prisma/client')

const prisma = new PrismaClient({});
export default prisma;
*/


//From ChatGPT
// import { PrismaClient } from '@prisma/client';

// const prisma = global.prisma || new PrismaClient({
//     log: ['query'],
// })

// if(process.env.NODE_ENV !== 'production') {
//     global.prisma = prisma;
// }

// export default prisma;

//From Prisma Official Documentation
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString});
const prisma = new PrismaClient({ adapter });

export default { prisma };
