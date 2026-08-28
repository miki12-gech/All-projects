import * as bcrypt from 'bcrypt';

// ... በክላሱ ውስጥ
async createUser(name: string, phone: string, pass: string) {
  const saltOrRounds = 10; // የሃሺንግ ጥንካሬ
  const hashedPassword = await bcrypt.hash(pass, saltOrRounds);
  
  return this.prisma.user.create({
    data: {
      name,
      phone,
      password: hashedPassword, // የተመሰጠረውን ፓስወርድ እናስቀምጣለን
    },
  });
}