import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@agazi.edu.et';
    const inputPassword = 'password123';

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.log(`❌ User with email ${email} NOT FOUND in database.`);
    } else {
        console.log(`✅ User found: ID=${user.id}, Role=${user.role}`);
        console.log(`🔑 Stored Hash: ${user.password.substring(0, 20)}...`);

        // Test comparison
        const isMatch = await bcrypt.compare(inputPassword, user.password);
        console.log(`🔐 Password Check ('${inputPassword}'): ${isMatch ? 'MATCH ✅' : 'FAIL ❌'}`);

        // If fail, let's force update it right here
        if (!isMatch) {
            console.log('⚠️ Password mismatch detected. Forcing update...');
            const newHash = await bcrypt.hash(inputPassword, 10);
            await prisma.user.update({
                where: { email },
                data: { password: newHash }
            });
            console.log('✅ Password forcefully updated to match.');
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
