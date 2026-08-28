import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const email = 'mikialegetachew@agazi.edu';
        const password = '12345678';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if admin already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email }
        });

        if (existingAdmin) {
            // Update existing admin
            const updatedUser = await prisma.user.update({
                where: { email },
                data: {
                    password: hashedPassword,
                    role: 'ADMIN',
                },
            });
            console.log('✅ Admin user updated successfully:', { 
                email: updatedUser.email, 
                role: updatedUser.role 
            });
        } else {
            // Create new admin
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: 'ADMIN',
                },
            });
            console.log('✅ Admin user created successfully:', { 
                email: newUser.email, 
                role: newUser.role 
            });
        }

        console.log('\n🔐 Login Credentials:');
        console.log('Email: mikialegetachew@agazi.edu');
        console.log('Password: 12345678');
        console.log('Role: ADMIN');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        
        if (error instanceof Error) {
            if (error.message.includes('Can\'t reach database server')) {
                console.log('\n💡 Database Connection Issue:');
                console.log('1. Make sure your database server is running');
                console.log('2. Check your DATABASE_URL in .env file');
                console.log('3. Run this script again once database is available');
            }
        }
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
